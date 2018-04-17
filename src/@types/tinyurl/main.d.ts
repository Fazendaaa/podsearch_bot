/**
 * Since this package has no typings for TS, this is an unofficial.
 */
declare module 'tinyurl' {
    export function shorten(url: string, callback: (shortened: string) => void): void;
    export type shorten = (url: string, callback: (shortened: string) => void) => void;
}
