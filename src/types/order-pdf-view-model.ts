import type { OrderPdfLocale } from './order-pdf-input';

export interface OrderPdfViewModelLineItem {
    sku: string;
    name: string;
    category: string;
    qty: number;
    unitPrice: string;
    lineTotal: string;
}

export interface OrderPdfViewModel {
    locale: OrderPdfLocale;
    labels: {
        title: string;
        client: string;
        buyer: string;
        payment: string;
        notes: string;
        total: string;
        signature: string;
        itemsHeader: {
            product: string;
            qty: string;
            unit: string;
            total: string;
        };
    };
    meta: {
        orderNumber: string;
        createdAt: string;
        status: string;
        eventName?: string;
    };
    client: {
        fantasyName: string;
        corporateName: string;
        cpfCnpj: string;
        phone: string;
        buyerName?: string;
    };
    items: OrderPdfViewModelLineItem[];
    totals: {
        itemCount: number;
        grandTotal: string;
    };
    paymentMethod?: string;
    notes?: string;
    signatureImageBase64?: string;
}
