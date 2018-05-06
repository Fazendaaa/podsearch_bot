'use strict';

import { languagesCode, readMock, translateRoot } from '../../__mocks__/mocks';
import { join } from 'path';
import { errorInline, searchInline, endInline, notFoundInline } from '../../src/lib/telegram/messages';

const functions = [{
    name: 'errorInline', func: errorInline }, {
    name: 'searchInline', func: searchInline }, {
    name: 'endInline', func: endInline }, {
    name: 'notFoundInline', func: notFoundInline 
}];
let mock;

const readFiles = (root) => functions.reduce((acc, cur) => {
    const functionName = cur.name;
    acc[functionName] = readMock(`telegram/messages/${root}/${functionName}.json`);

    return acc;
}, {});

const reduceMock = (acc, cur) => {
    const language = cur.split('_')[0];
    const obj = {
        output: readFiles(cur),
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
        const outputFile = mock[element].output[name];

        expect(func(translateFunction, 'mistyped')).toEqual(outputFile);
    });
});

languagesCode.forEach((element) => {
    describe(`[${element}] Function testing`, () => functionTesting(element));
});
