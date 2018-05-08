'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
import { languagesCode, translateRoot } from '../locales/locales';

const readMock = (filename: string) => JSON.parse(readFileSync(join(__dirname, `./${filename}.json`), 'utf8'));

const readFiles = (root, functions, path) => functions.reduce((acc, cur) => {
    const functionName = cur.name;
    acc[functionName] = readMock(`${path}/${root}/${functionName}`);
    
    return acc;
}, {});

const curryReduceMock = ({ path }, { functions }) => ((acc, cur) => {
    const language = cur.split('_')[0];
    const obj = {
        mock: readFiles(cur, functions, path),
        translate: (languageCode, resourceKey) => translateRoot.t(language, languageCode, resourceKey)
    }
    
    acc[cur] = obj;
    
    return acc;
});

export const initMock = ({ path }, { functions }) => languagesCode.reduce(curryReduceMock({ path }, { functions }), {});
