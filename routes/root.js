const express = require("express")
const util = require("../util");


function rootRoutes(requestLogger) {
    const router = express.Router()
    const mainController = require('../controllers/MainController')(requestLogger)

    router.get('/', (req, res) => mainController.index(req, res))
    router.get('/:mac', (req, res) => mainController.detail(req, res))
    return router
}

module.exports.rootRoutes = rootRoutes