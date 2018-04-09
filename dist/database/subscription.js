'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Subscription {
    constructor() {
        this.database = new mongoose_1.Mongoose();
        this.notify();
    }
    add(userId, podcastId) {
        return new Promise((resolve, reject) => {
            if (undefined !== userId && undefined !== podcastId && 'number' === typeof (userId) && 'number' === typeof (podcastId)) {
                resolve('added.');
            }
            else {
                reject(new Error('wrong argument.'));
            }
        });
    }
    remove(userId, podcastId) {
        return new Promise((resolve, reject) => {
            if (undefined !== userId && undefined !== podcastId && 'number' === typeof (userId) && 'number' === typeof (podcastId)) {
                resolve('removed.');
            }
            else {
                reject(new Error('wrong argument.'));
            }
        });
    }
    notify() {
        return 'working.';
    }
}
exports.Subscription = Subscription;
//# sourceMappingURL=subscription.js.map