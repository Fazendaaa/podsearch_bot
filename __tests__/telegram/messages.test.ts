'use strict';

import { languagesCode, readFiles, translateRoot } from '../../__mocks__/mocks';
import { join } from 'path';
import { errorInline, searchInline, endInline, notFoundInline } from '../../src/lib/telegram/messages';

const functions = [{
    name: 'errorInline', func: errorInline }, {
    name: 'searchInline', func: searchInline }, {
    name: 'endInline', func: endInline }, {
    name: 'notFoundInline', func: notFoundInline 
}];
let mock;

const reduceMock = (acc, cur) => {
    const language = cur.split('_')[0];
    const obj = {
        mock: readFiles(cur, functions, 'telegram/messages'),
        translate: (languageCode, resourceKey) => translateRoot.t(language, languageCode, resourceKey)
    }

    acc[cur] = obj;

    return acc;
};

jest.setTimeout(60000);

beforeAll(async (done) => {
    mock = languagesCode.reduce(reduceMock, {});
    
    done();
});

const functionTesting = (element) => functions.forEach(({ name, func }) => {
    test(name, () => {
        const translateFunction = mock[element].translate;
        const outputFile = mock[element].mock[name];

        expect(func(translateFunction, 'mistyped')).toEqual(outputFile);
    });
});

languagesCode.forEach((element: string) => {
    describe(`[${element}] Function testing`, () => functionTesting(element));
});
