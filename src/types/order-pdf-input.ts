export type OrderPdfLocale = 'pt-BR' | 'en';

export type OrderPdfStatus = 'pending' | 'completed' | 'cancelled';

export interface OrderPdfInputLineItem {
    sku: string;
    name: string;
    category: string;
    qty: number;
    unitPrice: number;
}

export interface OrderPdfInput {
    locale: OrderPdfLocale;
    meta: {
        orderNumber: string | number;
        createdAt: string;
        status: OrderPdfStatus;
        eventName?: string;
    };
    client: {
        fantasyName: string;
        corporateName: string;
        cpfCnpj: string;
        phone: string;
        buyerName?: string | null;
    };
    items: OrderPdfInputLineItem[];
    paymentMethod?: string | null;
    notes?: string | null;
    signatureImageBase64?: string | null;
}

export interface OrderPdfResult {
    buffer: Buffer;
    suggestedFileName: string;
}
