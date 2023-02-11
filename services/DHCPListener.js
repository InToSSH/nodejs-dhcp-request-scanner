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
        this.#udpServer = udp.createSocket('udp4');
        this.#protocol = require('../lib/protocol');

        this.#sendToHaService = require('./SendToHomeAssistant')(process.env.HA_ENDPOINT);

        this.#requestLogger = requestLogger
    }

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

                console.log('Request from MAC address : ', req.chaddr);
                console.log('Received %d bytes from %s:%d\n',buf.length, info.address, info.port);

                this.#sendToHaService.newDHCPRequest(req.chaddr);
                this.#requestLogger.storeRequest(req.chaddr, req.options[53]);
            }

        });

        this.#udpServer.bind(67, '0.0.0.0');
    }
}

module.exports = function create(requestLogger) {
    return new DHCPListener(requestLogger);
}