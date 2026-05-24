import { formatCurrency, formatCpfCnpj, formatDate } from '../format';
import { translate } from '../i18n';
import type { OrderPdfInput } from '../types/order-pdf-input';
import type { OrderPdfViewModel } from '../types/order-pdf-view-model';

export function mapInputToViewModel(input: OrderPdfInput): OrderPdfViewModel {
    const locale = input.locale;
    const items = input.items.map((item) => {
        const lineTotalValue = item.qty * item.unitPrice;
        return {
            sku: item.sku,
            name: item.name,
            category: item.category,
            qty: item.qty,
            unitPrice: formatCurrency(locale, item.unitPrice),
            lineTotal: formatCurrency(locale, lineTotalValue),
        };
    });

    const grandTotalValue = input.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

    const clientDisplayName =
        input.client.fantasyName.trim() || input.client.corporateName.trim() || '—';

    return {
        locale,
        labels: {
            title: translate(locale, 'title'),
            client: translate(locale, 'client'),
            buyer: translate(locale, 'buyer'),
            payment: translate(locale, 'payment'),
            notes: translate(locale, 'notes'),
            total: translate(locale, 'total'),
            signature: translate(locale, 'signature'),
            itemsHeader: {
                product: translate(locale, 'itemsHeader.product'),
                qty: translate(locale, 'itemsHeader.qty'),
                unit: translate(locale, 'itemsHeader.unit'),
                total: translate(locale, 'itemsHeader.total'),
            },
        },
        meta: {
            orderNumber: String(input.meta.orderNumber),
            createdAt: formatDate(locale, input.meta.createdAt),
            status: translate(locale, `status.${input.meta.status}`),
            eventName: input.meta.eventName,
        },
        client: {
            fantasyName: clientDisplayName,
            corporateName: input.client.corporateName,
            cpfCnpj: formatCpfCnpj(locale, input.client.cpfCnpj),
            phone: input.client.phone || '—',
            buyerName: input.client.buyerName ?? undefined,
        },
        items,
        totals: {
            itemCount: input.items.reduce((sum, item) => sum + item.qty, 0),
            grandTotal: formatCurrency(locale, grandTotalValue),
        },
        paymentMethod: input.paymentMethod ?? undefined,
        notes: input.notes ?? undefined,
        signatureImageBase64: input.signatureImageBase64 ?? undefined,
    };
}
