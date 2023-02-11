const util = require("../util");

class MainController {
    #requestLogger
    constructor(requestLogger) {
        this.#requestLogger = requestLogger
    }

    index(req, res) {
        this.#requestLogger.getLatestRequests(50).then((result) => {
            console.log(req.headers)
            if (req.get('accept').includes('application/json')) {
                res.json(result)
            } else {
                res.render('list', {latestRequests: result, requestTypeToString: util.requestTypeToString})
            }
        })

        return res;
    }

}

module.exports = function (requestLogger) {
    return new MainController(requestLogger)
}