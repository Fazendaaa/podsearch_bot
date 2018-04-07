'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const i18n_node_yaml = require("i18n-node-yaml");
const path_1 = require("path");
const remove_accents_1 = require("remove-accents");
const i18n = i18n_node_yaml({
    debug: true,
    translationFolder: path_1.join(__dirname, '../../locales'),
    defaultLocale: 'en',
    locales: ['en', 'pt']
});
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
    return (undefined !== cmd && 'string' === typeof cmd) ? cmd.replace(/(\/\w+)\s*/, '') : undefined;
};
exports.messageToString = (message) => {
    return (undefined !== message && 'string' === typeof message) ?
        Buffer.from(remove_accents_1.remove(message), 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
        undefined;
};
exports.notFoundInline = (value, lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== value && 'string' === typeof (value) && undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api().t('notFoundInlineTitle', { value }, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('notFoundInlineMessage', { value }, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('notFoundInlineDescription', { value }, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
exports.errorInline = (lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api().t('errorInlineTitle', {}, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('errorInlineMessage', {}, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('errorInlineDescription', {}, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
exports.searchInline = (lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api().t('searchInlineTitle', {}, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('searchInlineMessage', {}, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('searchInlineDescription', {}, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
exports.endInline = (lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api().t('endInlineTitle', {}, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('endInlineMessage', {}, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('endInlineDescription', {}, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
//# sourceMappingURL=utils.js.map