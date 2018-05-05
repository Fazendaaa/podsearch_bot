'use strict';

import { remove } from 'remove-accents';

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
