'use strict';

import { handleStage } from '../../src/lib/handlers/stage';
import { languageTesting, initMock, translateRoot, safeAttribution } from '../../__mocks__/mocks';

jest.setTimeout(60000);

/**
 * functions and mock should be global variables so, that way, languageTesting doesn't read all the input files for each
 * language mock since it's read all of them once.
 */
const functions = [{
    name: 'handleStage', func: handleStage
}];
const mock = initMock('handlers/stage', functions);

const functionTesting = ({ name, mock, languageCountry }, { func }) => test(name, async () => {
    const translate = mock[languageCountry].translate;
    const array = mock[languageCountry].mock[name];
    
    expect.assertions(array.length);

    return array.reduce(async (acc, cur) => {
        const value = await safeAttribution({ cur }, { func: func(cur.input, { translateRoot, translate }) });
        acc.then((result) => result.push(value));
        
        return acc;
    }, Promise.resolve([]));
});

languageTesting((languageCountry) => {
    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func }));
});
