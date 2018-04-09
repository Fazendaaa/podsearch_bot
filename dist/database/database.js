'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscription = (userId, podcastId) => new Promise((resolve, reject) => {
    if (undefined !== userId && undefined !== podcastId && 'number' === typeof (userId) && 'number' === typeof (podcastId)) {
        resolve('added.');
    }
    else {
        reject(new Error('wrong argument.'));
    }
});
exports.removeSubscription = (userId, podcastId) => new Promise((resolve, reject) => {
    if (undefined !== userId && undefined !== podcastId && 'number' === typeof (userId) && 'number' === typeof (podcastId)) {
        resolve('removed.');
    }
    else {
        reject(new Error('wrong argument.'));
    }
});
exports.notify = () => {
    throw new Error('not running.');
};
//# sourceMappingURL=database.js.map