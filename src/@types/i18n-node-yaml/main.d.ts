/**
 * Since this package has no typings for TS, this is an unofficial.
 */
type response = {
    ready: () => Promise<object>;
    middleware: (req, res, next) => void;
    api: api;
};

type options = {
    locales: Array<string>;
    debug: boolean;
    defaultLocale: string;
    queryParameters: Array<string>;
    cookieName: string;
};

type responseApi = {
    getLocale: () => string;
    getLanguage: () => string;
    getLocales: () => Array<string>;
    getLanguages: () => Array<string>;
    t: (arg1: string, arg2?: object, arg3?: string, arg4?) => looseTranslate;
};

type init = (options?: object) => response;
type looseTranslate = (arg1: string, arg2?: object, arg3?: string, arg4?, selectedLocale?) => string | Array<string>;

export type api = (selectedLocale?: string) => responseApi;
export default init;
