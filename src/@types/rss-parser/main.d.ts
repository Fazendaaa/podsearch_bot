/**
 * Since this package has no typings for TS, this is an unofficial.
 */
export class Parser {
    constructor(options?: object);
    
    parseURL(feedUrl: string, callback?: Function, redirectCount?: number);
}
