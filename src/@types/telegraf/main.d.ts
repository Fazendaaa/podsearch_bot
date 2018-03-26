/**
 * Since this package has no typings for TS, this is an unofficial.
 */
declare module 'telegraf' {
    export type telegramInline = {
        id: string;
        title: string;
        type: string;
        input_message_content: {
            message_text: string;
            parse_mode: string;
        },
        description: string;
        thumb_url: string;
    };
}
