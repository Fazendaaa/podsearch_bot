'use strict';

import { languagesCode, readFiles, translateRoot } from '../../__mocks__/mocks';
import { handleStage } from '../../src/lib/handlers/stage';

const functions = [{
    name: 'handleStage', func: handleStage
}];
let mock;

const reduceMock = (acc, cur) => {
    const language = cur.split('_')[0];
    const obj = {
        mock: readFiles(cur, functions, 'handlers/stage'),
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

const functionTesting = (element) => functions.forEach(( { name, func } ) => test(name, async () => {
    const translate = mock[element].translate;
    const array = mock[element].mock[name];

    expect.assertions(array.length);

    return array.reduce(async (acc, cur) => {
        const value = ('resolve' === cur.type) ?
                      await expect(func(cur.input, { translateRoot, translate })).resolves.toEqual(cur.output) :
                      await expect(func(cur.input, { translateRoot, translate })).rejects.toEqual(cur.output);

        acc.then((result) => result.push(value));
        
        return acc;
    }, Promise.resolve( [] ));
}));

languagesCode.forEach((element: string) => {
    describe(`[${element}] Function Testing`, () => functionTesting(element));
});
