import type { OrderPdfLocale } from '../types/order-pdf-input';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';

type LocaleMessages = Record<string, unknown>;

const MESSAGES: Record<OrderPdfLocale, LocaleMessages> = {
    'pt-BR': ptBR as LocaleMessages,
    en: en as LocaleMessages,
};

function getNestedValue(obj: LocaleMessages, keyPath: string): unknown {
    const parts = keyPath.split('.');
    let current: unknown = obj;
    for (const part of parts) {
        if (current == null || typeof current !== 'object') {
            return undefined;
        }
        current = (current as Record<string, unknown>)[part];
    }
    return current;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
    if (!params) {
        return template;
    }
    return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
        const value = params[key];
        return value !== undefined ? String(value) : `{${key}}`;
    });
}

export function translate(
    locale: OrderPdfLocale,
    key: string,
    params?: Record<string, string | number>,
): string {
    const messages = MESSAGES[locale] ?? MESSAGES['pt-BR'];
    const value = getNestedValue(messages, key);
    if (typeof value !== 'string') {
        return key;
    }
    return interpolate(value, params);
}
