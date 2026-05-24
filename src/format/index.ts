import type { OrderPdfLocale } from '../types/order-pdf-input';

export function formatCurrency(locale: OrderPdfLocale, value: number): string {
    if (locale === 'en') {
        const fixed = value.toFixed(2);
        const [intPart, decPart] = fixed.split('.');
        const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return 'R$ ' + withThousands + '.' + decPart;
    }

    const fixed = value.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return 'R$ ' + withThousands + ',' + decPart;
}

export function formatDate(locale: OrderPdfLocale, iso: string): string {
    const trimmed = iso.trim();
    const datePart = trimmed.includes('T') ? trimmed.split('T')[0] : trimmed.slice(0, 10);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
    if (!m) {
        return iso;
    }
    if (locale === 'en') {
        return `${m[2]}/${m[3]}/${m[1]}`;
    }
    return `${m[3]}/${m[2]}/${m[1]}`;
}

export function formatCpfCnpj(_locale: OrderPdfLocale, raw: string | null | undefined): string {
    if (!raw) {
        return '—';
    }
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (digits.length === 14) {
        return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return raw;
}
