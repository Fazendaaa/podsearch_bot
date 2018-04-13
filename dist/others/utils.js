'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const remove_accents_1 = require("remove-accents");
exports.readAsync = (filename) => new Promise((resolve, reject) => {
    fs_1.readFile(path_1.join(__dirname, `../../__mocks__/${filename}`), 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(JSON.parse(data));
        }
    });
});
exports.arrayLoad = (options) => {
    if (undefined !== options && 'object' === typeof (options)) {
        return options.map((element) => {
            if ('function' === typeof (element)) {
                return element();
            }
            else {
                return exports.arrayLoad(element);
            }
        });
    }
    else {
        throw new Error('Wrong argument.');
    }
};
exports.removeCmd = (cmd) => {
    return (undefined !== cmd && 'string' === typeof cmd) ? remove_accents_1.remove(cmd.replace(/(\/\w+)\s*/, '')) : undefined;
};
exports.messageToString = (message) => {
    return (undefined !== message && 'string' === typeof message) ?
        Buffer.from(remove_accents_1.remove(message), 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
        undefined;
};
exports.notFoundInline = (value, lanCode, i18n) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== value && 'string' === typeof (value) && undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        resolve({
            id: '0',
            title: i18n().t('notFoundInlineTitle', { value }, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('notFoundInlineMessage', { value }, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('notFoundInlineDescription', { value }, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
        });
    }
    else {
        reject(undefined);
    }
});
exports.errorInline = (lanCode, i18n) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        resolve({
            id: '0',
            title: i18n().t('errorInlineTitle', {}, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('errorInlineMessage', {}, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('errorInlineDescription', {}, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
        });
    }
    else {
        reject(undefined);
    }
});
exports.searchInline = (lanCode, i18n) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        resolve({
            id: '0',
            title: i18n().t('searchInlineTitle', {}, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('searchInlineMessage', {}, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('searchInlineDescription', {}, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
        });
    }
    else {
        reject(undefined);
    }
});
exports.endInline = (lanCode, i18n) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        resolve({
            id: '0',
            title: i18n().t('endInlineTitle', {}, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('endInlineMessage', {}, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('endInlineDescription', {}, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
        });
    }
    else {
        reject(undefined);
    }
});
//# sourceMappingURL=utils.js.map