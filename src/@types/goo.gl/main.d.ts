/**
 * Since this package has no typings for TS, this is an unofficial.
 */
declare module 'goo.gl' {
    export function _googleRequest(type: string, url: string, extraOptions?: object): Promise<string>;
    export function analytics(url: string, extraOptions?: object): Promise<string>;
    export function expand(url: string, extraOptions?: object): Promise<string>;
    export function getKey(): string;
    /**
     * Had to change the orignal typing for this function because since this project is using enviroment variables, they
     * can have the undefined value if none is set.
     * @param {string | undefined} key - Google's API key.
     * @returns {string} Same Google's API key. 
     */
    export function setKey(key?: string): string;
    export function shorten(url: string, extraOptions?: object): Promise<string>;
}
