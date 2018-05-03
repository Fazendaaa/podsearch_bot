'use strict';

export class languageCode {
    middleware () {
        return (ctx, next) => {
            if (ctx.hasOwnProperty('message')) {
                ctx.language = ctx.message.from.language_code.split('-')[0] || 'en';
                ctx.country = ctx.message.from.language_code.split('-')[1] || 'us';
            } else if (ctx.hasOwnProperty('inlineQuery')) {
                ctx.language = ctx.inlineQuery.from.language_code.split('-')[0] || 'en';
                ctx.country = ctx.inlineQuery.from.language_code.split('-')[1] || 'us';
            }
    
            next();
        }
    }
};
