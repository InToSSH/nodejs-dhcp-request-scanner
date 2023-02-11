const util = require("../util");

class MainController {
    #requestLogger
    constructor(requestLogger) {
        this.#requestLogger = requestLogger
    }

    index(req, res) {
        let limit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 50

        this.#requestLogger.getLatestRequests(limit).then((result) => {
            if (req.get('accept').includes('application/json')) {
                res.json(result)
            } else {
                res.render('list', {latestRequests: result, requestTypeToString: util.requestTypeToString})
            }
        })

        return res;
    }

    detail(req, res) {
        let limit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 50

        this.#requestLogger.getRequestsForMac(req.params.mac, limit).then((result) => {
            if (req.get('accept').includes('application/json')) {
                res.json(result)
            } else {
                res.render('detail', {mac: req.params.mac, latestRequests: result, requestTypeToString: util.requestTypeToString})
            }
        })

        return res

    }

}

module.exports = function (requestLogger) {
    return new MainController(requestLogger)
}