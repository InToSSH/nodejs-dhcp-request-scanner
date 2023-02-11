
const express = require('express')
const app = express()

const mongoDbConnection = require('./repositories/MongoConnection')(
    process.env.DB_HOST,
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD
).getConnection()

const mongoRequestLogger = require('./repositories/MongoRequestLogger')(mongoDbConnection)
const DHCPListener = require('./services/DHCPListener')(mongoRequestLogger)

DHCPListener.listen()

app.get('/', (req, res) => {

    mongoRequestLogger.getLatestRequests()
        .then((result) => {
            res.json(result);
    })
})

app.listen(3000)



