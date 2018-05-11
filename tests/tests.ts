'use strict';

import { languagesCode } from './locales/locales';

const safeAttribution = async ({ cur }, { func, opts }) => {
    let value;

    try {
        if ('resolve' === cur.type) {
            value = await expect(func(cur.input, opts)).resolves.toEqual(cur.output);
        } if ('reject' === cur.type) {
            value = await expect(func(cur.input, opts)).rejects.toEqual(cur.output);
        } if ('synchronous_equal' === cur.type) {
            value = expect(func(cur.input, opts)).toEqual(cur.output);
        } if ('synchronous_throw' === cur.type) {
            value = expect(() => func(cur.input, opts)).toThrow();
        } else {
            value = false;
        }
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
        const value = await safeAttribution({ cur }, { func, opts: newOpts });
        acc.then((result) => result.push(value));

        return acc;
    }, Promise.resolve([]));
});

export const languageTesting = (functionTesting: (languageCountry) => void) => languagesCode.forEach((element: string) => {
    describe(`[${element}] Function Testing`, () => functionTesting(element));
});
