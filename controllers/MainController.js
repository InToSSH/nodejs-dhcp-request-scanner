const util = require("../util");

/**
 * @module MainController
 */
class MainController {
    #requestLogger
    constructor(requestLogger) {
        this.#requestLogger = requestLogger
    }

    /**
     * Returns either the list.js view with list of the latest requests or
     * returns json response in case client accepts it
     * @param req
     * @param res
     * @returns {*}
     */
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

    /**
     * Returns either the detail.js view with list of the latest requests for specific MAC address or
     * returns json response in case client accepts it
     * @param req
     * @param res
     * @returns {*}
     */
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