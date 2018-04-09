/**
 * Subscription testing.
 */
'use strict';

import { Subscription } from '../../src/database/subscription';

const mockUserId: number = 0;
const mockPodcastId: number = 0;
let subscription;

jest.setTimeout(60000);

/**
 * Instantiating a new subscription dataset.
 */
beforeAll(() => {
    subscription = new Subscription();
});

describe('Testing add function.', () => {
    test('userID and podcastId is \"undefined\".', () => {
        expect.assertions(1);

        return expect(subscription.add(undefined, undefined)).rejects.toThrow('wrong argument.');
    });

    test('userID is \"undefined\".', () => {
        expect.assertions(1);

        return expect(subscription.add(undefined, mockPodcastId)).rejects.toThrow('wrong argument.');
    });

    test('podcastId is \"undefined\".', () => {
        expect.assertions(1);

        return expect(subscription.add(mockUserId, undefined)).rejects.toThrow('wrong argument.');
    });

    test('Added subscription.', () => {
        expect.assertions(1);

        return expect(subscription.add(mockUserId, mockPodcastId)).resolves.toMatch('added.');
    });

    /*
    test('Already subscribed.', () => {
        expect.assertions(1);

        return expect(subscription.add(mockUserId, mockPodcastId)).resolves.toMatch('already subscribed.');
    });
    */
});

describe('Testing remove function.', () => {
    test('userID and podcastId is \"undefined\".', () => {
        expect.assertions(1);

        return expect(subscription.remove(undefined, undefined)).rejects.toThrow('wrong argument.');
    });

    test('userID is \"undefined\".', () => {
        expect.assertions(1);

        return expect(subscription.remove(undefined, mockPodcastId)).rejects.toThrow('wrong argument.');
    });

    test('podcastId is \"undefined\".', () => {
        expect.assertions(1);

        return expect(subscription.remove(mockUserId, undefined)).rejects.toThrow('wrong argument.');
    });

    test('Added subscription.', () => {
        expect.assertions(1);

        return expect(subscription.remove(mockUserId, mockPodcastId)).resolves.toMatch('removed.');
    });
});
