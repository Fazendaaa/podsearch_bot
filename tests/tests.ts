'use strict';

import { languagesCode } from './locales/locales';

const safeAttribution = async ({ cur }, { func }) => {
    let value;

    try {
        value = ('resolve' === cur.type) ?
                await expect(func).resolves.toEqual(cur.output) :
                await expect(func).rejects.toEqual(cur.output);
    } catch (error) {
        console.error(error);
    } finally {
        return value;
    }
};

export const functionTesting = ({ name, mock, languageCountry }, { func, opts }) => test(name, async () => {
    const translate = mock[languageCountry].translate;
    const array = mock[languageCountry].mock[name];

    expect.assertions(array.length);

    return array.reduce(async (acc, cur) => {
        const value = await safeAttribution({ cur }, { func: func(cur.input, opts) });
        acc.then((result) => result.push(value));

        return acc;
    }, Promise.resolve([]));
});

export const languageTesting = (functionTesting: (languageCountry) => void) => languagesCode.forEach((element: string) => {
    describe(`[${element}] Function Testing`, () => functionTesting(element));
});
