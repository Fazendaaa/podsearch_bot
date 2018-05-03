/**
 * Subscription handling.
 */
'use strict';

import { Mongoose } from 'mongoose';

/**
 * This  class  will handle all the subscription data and notification. And must be a new class, not an extended version
 * of  Mongoose  because  there's  no  need  of  making the caller capable of changing anything aside adding or removing
 * subscription.
 */
export class Subscription {
    private database: Mongoose;

    constructor () {
        this.database = new Mongoose();
        this.notify();
    }

    public add (userId: number, podcastId: number): Promise<string> {
        return new Promise((resolve: (success: string) => void, reject: (error: Error) => void) => {
            if (undefined !== userId && undefined !== podcastId && 'number' === typeof(userId) && 'number' === typeof(podcastId)) {
                resolve('added.');
            } else {
                reject(new Error('wrong argument.'));
            }
        });
    }

    public remove (userId: number, podcastId: number): Promise<string> {
        return new Promise((resolve: (success: string) => void, reject: (error: Error) => void) => {
            if (undefined !== userId && undefined !== podcastId && 'number' === typeof (userId) && 'number' === typeof (podcastId)) {
                resolve('removed.');
            } else {
                reject(new Error('wrong argument.'));
            }
        });
    }

    /**
     * Method that runs user's notification upon new episode releases. This method is private because the bot itself, in
     * main.ts,  doesn't  need  to  handle this. As any other source file, notification is intrinsic to the Subscription
     * class and must run as independent as possible from whom is calling it.
     */
    private notify(): string {
        return 'working.';
        //throw new Error('not running.');
    }
}
