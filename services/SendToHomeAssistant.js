class SendToHomeAssistant {
    #endpoint
    #http
    #options
    constructor(endpoint) {
        this.#endpoint = endpoint
        this.#http = require('node:http')
        this.#options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        }
    }

    newDHCPRequest(macAddress) {
        const req = this.#http.request(this.#endpoint, this.#options, (res) => {
            res.setEncoding('utf8')
        })

        req.write(JSON.stringify({
            'macAddress': macAddress,
        }))
        req.end()
    }

}

module.exports = function create(endpoint) {
    return new SendToHomeAssistant(endpoint)
}