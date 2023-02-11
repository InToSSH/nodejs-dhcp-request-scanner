
const express = require('express')
const app = express()
const mongoDb = require('./repositories/MongoConnection')
const mongoDbConnection = (new mongoDb()).getConnection();

const MongoRequestLoggerRepository = require('./repositories/MongoRequestLogger')
const mongoRequestLogger = new MongoRequestLoggerRepository(mongoDbConnection)

const DHCPListenerService = require('./services/DHCPListener')
const DHCPListener = new DHCPListenerService(mongoRequestLogger)

DHCPListener.listen()

app.get('/', (req, res) => {

    mongoRequestLogger.getLatestRequests()
        .then((result) => {
            res.json(result);
    })
})

app.listen(3000)



