module.exports = class {
    // TODO: Figure out how to implement an interface with TypeScript
    #db
    #DhcpRequest
    constructor(db) {
        this.#db = db;

        const dhcpRequestSchema = this.#db.Schema({
            macAddress: String,
            requestType: Number
        }, { timestamps: true })

        this.#DhcpRequest = this.#db.model('DhcpRequest', dhcpRequestSchema);
    }

    storeRequest(mac, type) {
        const newRequest = new this.#DhcpRequest({
            macAddress: mac,
            requestType: type
        });
        newRequest.save()
    }

    async getLatestRequests(limit) {
        if (!limit) {
            limit = 20
        }
        return this.#DhcpRequest.find().sort({createdAt: -1}).limit(limit).exec();
    }

    async getRequestsForMac(mac, limit) {
        if (!limit) {
            limit = 20
        }

        if (mac) {
            return this.#DhcpRequest.find({macAddress: mac}).sort({createdAt: -1}).limit(limit).exec();
        }

        return null;
    }

    purgeOldRequests(olderThanDays) {
        if (!olderThanDays) {
            olderThanDays = 14
        }
        const today = new Date();
        const daysAgo = new Date(today.getTime() - olderThanDays * 24 * 60 * 60 * 1000)

        this.#DhcpRequest.deleteMany({ createdAt: { $lt: daysAgo } });
    }

}