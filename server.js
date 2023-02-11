
const express = require('express')
const app = express()
const mongoDb = require('./repositories/MongoConnection')
const mongoDbConnection = (new mongoDb()).getConnection();

const MongoRequestLoggerRepository = require('./repositories/MongoRequestLogger')
const mongoRequestLogger = new MongoRequestLoggerRepository(mongoDbConnection);

app.get('/', (req, res) => {

    mongoRequestLogger.getRequestsForMac('03-23-83-DE-12-F8')
        .then((result) => {
            res.json(result);
    })
})

app.listen(3000)

const udp = require('dgram')
const udpServer = udp.createSocket('udp4');

const Protocol = require('./lib/protocol');

const DHCPDISCOVER = 1;
const DHCPREQUEST = 3;
const BOOTREQUEST = 1;

udpServer.on('message',function(buf,info){

    let req;

    try {
        req = Protocol.parse(buf);
    } catch (e) {
        console.log('error', e);
        return;
    }

    if (req.op === BOOTREQUEST
        && req.options[53]
        && (req.options[53] === DHCPDISCOVER || req.options[53] === DHCPREQUEST)) {

        console.log('Request from MAC address : ', req.chaddr);
        console.log('Received %d bytes from %s:%d\n',buf.length, info.address, info.port);


        const sendToHaService = require('./services/SendToHomeAssistant');
        const sendToHa = new sendToHaService(process.env.HA_ENDPOINT);
        sendToHa.newDHCPRequest(req.chaddr);
        mongoRequestLogger.storeRequest(req.chaddr, req.options[53]);

    }

});

udpServer.bind(67, '0.0.0.0');