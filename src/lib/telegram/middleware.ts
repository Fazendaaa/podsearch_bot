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
        };
    }
};

export class setLocale {
    middleware () {
        return (ctx, next) => {
            if (ctx.hasOwnProperty('i18n') && ctx.hasOwnProperty('language')) {
                ctx.i18n.locale(ctx.language);
            }

            next();
        };
    }
};

/**
 * Do some bindings here.
 */
export const translate = (languageCode, resourceKey?) => translateRoot.t(language, languageCode, resourceKey);
