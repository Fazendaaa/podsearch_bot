"use strict";
/**
 * I  know  that  isn't  the right way of doing mocking tests but, right now, is the way that I came up to. This testing
 * file  is  a nightmare of reading I/O -- need to correct ASAP this, if this continue tha way it is, scale testing will
 * be impossible.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.readAsync = (filename) => new Promise((resolve, reject) => {
    fs_1.readFile(path_1.join(__dirname, `../__mocks__/${filename}`), 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(JSON.parse(data));
        }
    });
});
//# sourceMappingURL=readAsync.js.map