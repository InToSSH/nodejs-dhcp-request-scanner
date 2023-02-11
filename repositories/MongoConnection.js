/**
 * Mongo DB connector using Mongoose
 *
 * @module MongoConnection
 */
class MongoConnection {
    #connection
    constructor(host, dbName, username, password) {
        const mongoose = require('mongoose')
        mongoose.set('strictQuery', true);
        mongoose.connect(`mongodb://${username}:${password}@${host}/${dbName}?authSource=admin`, { useNewUrlParser: true })
        this.#connection = mongoose
    }

    /**
     * Returns the Mongoose instance
     * @returns {*}
     */
    getConnection() {
        return this.#connection
    }
}

module.exports = function create(host, dbName, username, password) {
    return new MongoConnection(host, dbName, username, password);
}