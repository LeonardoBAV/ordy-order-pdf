import type {
    OrderPdfInput,
    OrderPdfInputLineItem,
    OrderPdfLocale,
    OrderPdfStatus,
} from '../types/order-pdf-input';

const VALID_STATUSES: OrderPdfStatus[] = ['pending', 'completed', 'cancelled'];
const VALID_LOCALES: OrderPdfLocale[] = ['pt-BR', 'en'];

function assertNonEmpty(value: string, field: string): void {
    if (!value.trim()) {
        throw new Error(`OrderPdfInput: ${field} is required`);
    }
}

export function normalizeInput(input: OrderPdfInput): OrderPdfInput {
    if (!VALID_LOCALES.includes(input.locale)) {
        throw new Error(`OrderPdfInput: unsupported locale "${input.locale}"`);
    }
    if (!VALID_STATUSES.includes(input.meta.status)) {
        throw new Error(`OrderPdfInput: invalid status "${input.meta.status}"`);
    }
    assertNonEmpty(String(input.meta.orderNumber), 'meta.orderNumber');
    assertNonEmpty(input.meta.createdAt, 'meta.createdAt');
    if (!Array.isArray(input.items) || input.items.length === 0) {
        throw new Error('OrderPdfInput: at least one item is required');
    }

    const items: OrderPdfInputLineItem[] = input.items.map((item, index) => {
        if (item.qty <= 0) {
            throw new Error(`OrderPdfInput: items[${index}].qty must be positive`);
        }
        if (item.unitPrice < 0) {
            throw new Error(`OrderPdfInput: items[${index}].unitPrice must be >= 0`);
        }
        return {
            sku: item.sku ?? '',
            name: item.name ?? '',
            category: item.category ?? '',
            qty: item.qty,
            unitPrice: item.unitPrice,
        };
    });

    return {
        locale: input.locale,
        meta: {
            orderNumber: input.meta.orderNumber,
            createdAt: input.meta.createdAt,
            status: input.meta.status,
            eventName: input.meta.eventName?.trim() || undefined,
        },
        client: {
            fantasyName: input.client.fantasyName ?? '',
            corporateName: input.client.corporateName ?? '',
            cpfCnpj: input.client.cpfCnpj ?? '',
            phone: input.client.phone ?? '',
            buyerName: input.client.buyerName?.trim() || undefined,
        },
        items,
        paymentMethod: input.paymentMethod?.trim() || null,
        notes: input.notes?.trim() || null,
        signatureImageBase64: input.signatureImageBase64?.trim() || null,
    };
}
