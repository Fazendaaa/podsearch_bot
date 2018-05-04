'use strict';

import { readFile } from 'fs';
import { join } from 'path';
import { remove } from 'remove-accents';

export const readAsync = (filename: string): Promise<object> =>
new Promise((resolve: (data: object) => void, reject: (data: Error) => void) => {
    readFile(join(__dirname, `../../__mocks__/${filename}`), 'utf8', (err: Error, data: string) => {
        if (err) {
            reject(err);
        } else {
            resolve(JSON.parse(data));
        }
    });
});

export const arrayLoad = (options: Array<object>): Array<string | object> | Error => {
    if (undefined == options || 'object' !== typeof(options)) {
        throw new Error('Wrong argument.');
    }

    return options.map((element: Function) => {
        if ('function' === typeof(element)) {
            return element();
        }

        return arrayLoad(element);
    });
};

export const removeCmd = (cmd: string): string => {
    return (undefined !== cmd && 'string' === typeof cmd) ? remove(cmd.replace(/(\/\w+)\s*/, '')) : undefined;
};

export const messageToString = (message: string): string => {
    return (undefined !== message && 'string' === typeof message) ?
        Buffer.from(remove(message), 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
        undefined;
};
