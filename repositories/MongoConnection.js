const mongoose = require("mongoose");
module.exports = class {
    #connection
    constructor() {
        const mongoose = require('mongoose')
        mongoose.set('strictQuery', true);
        mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin`, { useNewUrlParser: true })
        this.#connection = mongoose
    }

    getConnection() {
        return this.#connection
    }
}