'use strict';

import { languageTesting, initMock, translateRoot } from '../../__mocks__/mocks';
import { handleStage } from '../../src/lib/handlers/stage';

jest.setTimeout(60000);

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

const functionTesting = (languageCountry) => {
    const functions = [{
        name: 'handleStage', func: handleStage
    }];
    const mock = initMock('handlers/stage', functions);

    return functions.forEach(({ name, func }) => applyFunction({ name, func, mock, languageCountry }));
};

languageTesting(functionTesting);
