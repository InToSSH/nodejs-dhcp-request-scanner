/**
 * Builds the UDP server to listen on port 67 to receive DHCP broadcast packets
 *
 * @module DHCPListener
 */
class DHCPListener {
    #DHCPDISCOVER = 1
    #DHCPREQUEST = 3;
    #BOOTREQUEST = 1;

    #protocol
    #udpServer
    #sendToHaService
    #requestLogger
    constructor(requestLogger) {
        const udp = require('dgram')
        this.#udpServer = udp.createSocket('udp4')
        this.#protocol = require('../lib/protocol')

        this.#sendToHaService = require('./SendToHomeAssistant')(process.env.HA_ENDPOINT)

        this.#requestLogger = requestLogger
    }

    /**
     * Starts up the server
     */
    listen() {
        this.#udpServer.on('message',(buf,info) => {
            let req;
            try {
                req = this.#protocol.parse(buf);
            } catch (e) {
                console.log('error', e);
                return;
            }

            if (req.op === this.#BOOTREQUEST
                && req.options[53]
                && (req.options[53] === this.#DHCPDISCOVER || req.options[53] === this.#DHCPREQUEST)) {

                console.log('Request from MAC address : ', req.chaddr)
                console.log('Received %d bytes from %s:%d\n',buf.length, info.address, info.port)

                this.#sendToHaService.newDHCPRequest(req.chaddr)
                this.#requestLogger.storeRequest(req.chaddr, req.options[53])
                this.#requestLogger.purgeOldRequests()
            }

        });

        // We could also bind to port 68 to get the DHCPOFFER packets with proposed IP address, so we could store
        // both the MAC and IP, however this will not work on any host that uses DHCP client, because this port is
        // already bound on the host by DHCP client.
        this.#udpServer.bind(67, '0.0.0.0')
    }
}

module.exports = function create(requestLogger) {
    return new DHCPListener(requestLogger)
}