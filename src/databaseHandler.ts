'use strict';

import { Subscription } from './lib/database/subscription';

const subscription = new Subscription();

export const handleSubscribe = async ({ userId, podcastId }, { translate }): Promise<string> => {
    const result = await subscription.add(userId, podcastId).catch(console.error);

    if ('added' === result) {
        return translate('working');
    } if ('already subscribed' === result) {
        return translate('working');
    }

    /**
     * Even in a case of error trough the subscription's catch, this will run.
     */
    return translate('working');
};

export const handleUnsubscribe = async ({ userId, podcastId }, { translate }): Promise<string> => {
    const result = await subscription.remove(userId, podcastId).catch(console.error);

    if ('added' === result) {
        return translate('working');
    } if ('already subscribed' === result) {
        return translate('working');
    }

    return translate('working');
};
