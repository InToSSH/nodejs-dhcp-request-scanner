const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static("public"));

const mongoDbConnection = require('./repositories/MongoConnection')(
    process.env.DB_HOST,
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD
).getConnection()

const mongoRequestLogger = require('./repositories/MongoRequestLogger')(mongoDbConnection)

const rootRouter = require('./routes/root')

app.use('/', rootRouter.rootRoutes(mongoRequestLogger))

const DHCPListener = require('./services/DHCPListener')(mongoRequestLogger)
DHCPListener.listen()


app.listen(3000)

