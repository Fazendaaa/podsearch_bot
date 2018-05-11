'use strict';

import { languagesCode } from './locales/locales';

const safeAttribution = async ({ cur }, { func }) => {
    let value;

    try {
        if ('resolve' === cur.type) {
            value = await expect(func).resolves.toEqual(cur.output);
        } if ('reject' === cur.type) {
            value = await expect(func).rejects.toEqual(cur.output);
        } if ('synchronous' === cur.type) {
            value = expect(func).toEqual(cur.output);
        }

        value = false;
    } catch (error) {
        value = false;

        console.error(error);
    } finally {
        return value;
    }
};

const setOptions = (opts, { translate }) => {
    if (opts.hasOwnProperty('translate') && true === opts.translate) {
        opts.translate = translate;
    }

    return opts;
};

export const functionTesting = ({ name, mock, languageCountry }, { func, opts }) => test(name, async () => {
    const translate = mock[languageCountry].translate;
    const array = mock[languageCountry].mock[name];
    const newOpts = setOptions(opts, { translate });

    expect.assertions(array.length);
    
    return array.reduce(async (acc, cur) => {
        const value = await safeAttribution({ cur }, { func: func(cur.input, newOpts) });
        acc.then((result) => result.push(value));

        return acc;
    }, Promise.resolve([]));
});

export const languageTesting = (functionTesting: (languageCountry) => void) => languagesCode.forEach((element: string) => {
    describe(`[${element}] Function Testing`, () => functionTesting(element));
});
