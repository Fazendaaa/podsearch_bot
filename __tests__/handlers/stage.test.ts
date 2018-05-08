'use strict';

import { languageTesting, initMock, translateRoot } from '../../__mocks__/mocks';
import { handleStage } from '../../src/lib/handlers/stage';

jest.setTimeout(60000);

/**
 * functions and mock should be global variables so, that way, languageTesting doesn't read all the input files for each
 * language mock since it's read all of them once.
 */
const functions = [{
    name: 'handleStage', func: handleStage
}];
const mock = initMock('handlers/stage', functions);

const applyFunction = ({ name, func, mock, languageCountry }) => test(name, async () => {
    const translate = mock[languageCountry].translate;
    const array = mock[languageCountry].mock[name];
    
    expect.assertions(array.length);
    
    return array.reduce(async (acc, cur) => {
        const value = ('resolve' === cur.type) ?
        await expect(func(cur.input, { translateRoot, translate })).resolves.toEqual(cur.output) :
        await expect(func(cur.input, { translateRoot, translate })).rejects.toEqual(cur.output);
        
        acc.then((result) => result.push(value));
        
        return acc;
    }, Promise.resolve([]));
});

languageTesting((languageCountry) => {
    functions.forEach(({ name, func }) => applyFunction({ name, func, mock, languageCountry }));
});
