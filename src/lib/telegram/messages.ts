'use strict';

export const errorInline = (translate: Function) => {
    return {
        id: '0',
        title: translate('errorInlineTitle'),
        type: 'article',
        input_message_content: {
            message_text: translate('errorInlineMessage'),
            parse_mode: 'Markdown'
        },
        description: translate('errorInlineDescription'),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
    };
};

export const searchInline = (translate: Function) => {
    return {
        id: '0',
        title: translate('searchInlineTitle'),
        type: 'article',
        input_message_content: {
            message_text: translate('searchInlineMessage'),
            parse_mode: 'Markdown'
        },
        description: translate('searchInlineDescription'),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
    };
};

export const endInline = (translate: Function) => {
    return {
        id: '0',
        title: translate('endInlineTitle'),
        type: 'article',
        input_message_content: {
            message_text: translate('endInlineMessage'),
            parse_mode: 'Markdown'
        },
        description: translate('endInlineDescription'),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
    };
};

export const notFoundInline = (translate: Function, value: string) => {
    return {
        id: '0',
        title: translate('notFoundInlineTitle', { value }),
        type: 'article',
        input_message_content: {
            message_text: translate('notFoundInlineMessage', { value }),
            parse_mode: 'Markdown'
        },
        description: translate('notFoundInlineDescription', { value }),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
    };
};
