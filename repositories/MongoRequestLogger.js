/**
 * Repository to store and get DHCP Request data from MongoDB
 *
 * @module MongoRequestLogger
 */
class MongoRequestLogger {
    // TODO: Figure out how to implement an interface with TypeScript

    #DhcpRequest

    constructor(db) {

        const dhcpRequestSchema = db.Schema({
            macAddress: {type: String, required: true},
            requestType: Number
        }, { timestamps: true })

        this.#DhcpRequest = db.model('DhcpRequest', dhcpRequestSchema);
    }

    /**
     * Stores new Request with MAC to DB
     * @param {String} mac
     * @param {Number} type
     */
    storeRequest(mac, type) {
        const newRequest = new this.#DhcpRequest({
            macAddress: mac,
            requestType: type
        });
        newRequest.save()
    }

    /**
     * Gets the latest requests
     * @param {Number} limit
     * @returns {Promise<*>}
     */
    async getLatestRequests(limit) {
        if (!limit) {
            limit = 20
        }
        return this.#DhcpRequest.find().sort({createdAt: -1}).limit(limit).exec()
    }

    /**
     * Gets the latest requests for specific MAC address
     * @param {String} mac
     * @param {Number} limit
     * @returns {Promise<null|*>}
     */
    async getRequestsForMac(mac, limit) {
        if (!limit) {
            limit = 20
        }

        if (mac) {
            return this.#DhcpRequest.find({macAddress: mac}).sort({createdAt: -1}).limit(limit).exec()
        }

        return null
    }

    /**
     * Deletes records that are older than specified number of days
     * @param {Number} olderThanDays
     */
    purgeOldRequests(olderThanDays) {
        if (!olderThanDays) {
            olderThanDays = 14
        }
        const today = new Date()
        const daysAgo = new Date(today.getTime() - olderThanDays * 24 * 60 * 60 * 1000)

        this.#DhcpRequest.deleteMany({ createdAt: { $lt: daysAgo } })
    }

}

module.exports = function create(db) {
    return new MongoRequestLogger(db)
}