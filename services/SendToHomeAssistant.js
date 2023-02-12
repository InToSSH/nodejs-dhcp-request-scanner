/**
 * Module responsible for sending requests to Home Assistant instance, more precisely to Node-Red integration
 * where they are processed and used to set the device tracker state
 *
 * @module SendToHomeAssistant
 */
const {isValidUrl} = require("../util");

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

    /**
     * Sends a new POST request with newly seen MAC address
     * @param {String} macAddress
     */
    newDHCPRequest(macAddress) {
        if (isValidUrl(this.#endpoint)) {
            const req = this.#http.request(this.#endpoint, this.#options, (res) => {
                res.setEncoding('utf8')
            })

            req.write(JSON.stringify({
                'macAddress': macAddress,
            }))
            req.end()
        }
    }

}

module.exports = function create(endpoint) {
    return new SendToHomeAssistant(endpoint)
}