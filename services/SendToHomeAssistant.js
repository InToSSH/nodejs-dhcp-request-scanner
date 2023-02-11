const http = require("node:http");
module.exports = class {
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
            res.setEncoding('utf8');
        })

        req.write(JSON.stringify({
            'macAddress': macAddress,
        }))
        req.end();
    }


}