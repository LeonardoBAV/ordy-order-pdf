import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { translate } from '../i18n';
import type { OrderPdfViewModel } from '../types/order-pdf-view-model';

function toSignatureImage(base64: string): string {
    if (base64.startsWith('data:')) {
        return base64;
    }
    return `data:image/png;base64,${base64}`;
}

export function buildDocumentDefinition(viewModel: OrderPdfViewModel): TDocumentDefinitions {
    const locale = viewModel.locale;
    const headerLines: Content[] = [
        {
            text: `${viewModel.labels.title} #${viewModel.meta.orderNumber}`,
            style: 'header',
        },
        {
            columns: [
                {
                    width: '*',
                    stack: [
                        { text: `${translate(locale, 'date')}: ${viewModel.meta.createdAt}`, style: 'muted' },
                        { text: `${translate(locale, 'statusLabel')}: ${viewModel.meta.status}`, style: 'muted' },
                    ],
                },
            ],
        },
    ];

    if (viewModel.meta.eventName) {
        headerLines.push({
            text: `${translate(locale, 'event')}: ${viewModel.meta.eventName}`,
            style: 'muted',
            margin: [0, 4, 0, 0] as [number, number, number, number],
        });
    }

    const clientStack: Content[] = [
        { text: viewModel.labels.client, style: 'sectionTitle' },
        { text: viewModel.client.fantasyName, style: 'body' },
    ];
    if (viewModel.client.corporateName && viewModel.client.corporateName !== viewModel.client.fantasyName) {
        clientStack.push({ text: viewModel.client.corporateName, style: 'muted' });
    }
    clientStack.push(
        { text: viewModel.client.cpfCnpj, style: 'muted' },
        { text: viewModel.client.phone, style: 'muted' },
    );
    if (viewModel.client.buyerName) {
        clientStack.push({
            text: `${viewModel.labels.buyer}: ${viewModel.client.buyerName}`,
            style: 'body',
            margin: [0, 6, 0, 0] as [number, number, number, number],
        });
    }

    const tableBody: Content[][] = [
        [
            { text: viewModel.labels.itemsHeader.product, style: 'tableHeader' },
            { text: viewModel.labels.itemsHeader.qty, style: 'tableHeader', alignment: 'center' },
            { text: viewModel.labels.itemsHeader.unit, style: 'tableHeader', alignment: 'right' },
            { text: viewModel.labels.itemsHeader.total, style: 'tableHeader', alignment: 'right' },
        ],
        ...viewModel.items.map((item) => [
            {
                stack: [
                    { text: item.name, style: 'body' },
                    { text: `${item.sku} · ${item.category}`, style: 'mutedSmall' },
                ],
            },
            { text: String(item.qty), alignment: 'center', style: 'body' },
            { text: item.unitPrice, alignment: 'right', style: 'body' },
            { text: item.lineTotal, alignment: 'right', style: 'body' },
        ]),
    ];

    const footerBlocks: Content[] = [
        {
            columns: [
                { width: '*', text: '' },
                {
                    width: 'auto',
                    stack: [
                        {
                            text: `${viewModel.labels.total}: ${viewModel.totals.grandTotal}`,
                            style: 'total',
                            alignment: 'right',
                        },
                        {
                            text: `${viewModel.labels.itemsHeader.qty}: ${viewModel.totals.itemCount}`,
                            style: 'muted',
                            alignment: 'right',
                        },
                    ],
                },
            ],
            margin: [0, 12, 0, 0] as [number, number, number, number],
        },
    ];

    if (viewModel.paymentMethod) {
        footerBlocks.push({
            text: `${viewModel.labels.payment}: ${viewModel.paymentMethod}`,
            style: 'body',
            margin: [0, 12, 0, 0] as [number, number, number, number],
        });
    }

    if (viewModel.notes) {
        footerBlocks.push(
            { text: viewModel.labels.notes, style: 'sectionTitle', margin: [0, 12, 0, 4] as [number, number, number, number] },
            { text: viewModel.notes, style: 'body' },
        );
    }

    if (viewModel.signatureImageBase64) {
        footerBlocks.push(
            { text: viewModel.labels.signature, style: 'sectionTitle', margin: [0, 16, 0, 4] as [number, number, number, number] },
            {
                image: toSignatureImage(viewModel.signatureImageBase64),
                width: 180,
                height: 80,
            },
        );
    }

    const content: Content[] = [
        ...headerLines,
        { text: '', margin: [0, 0, 0, 12] as [number, number, number, number] },
        { stack: clientStack },
        { text: '', margin: [0, 0, 0, 12] as [number, number, number, number] },
        {
            table: {
                headerRows: 1,
                widths: ['*', 40, 70, 70],
                body: tableBody,
            },
            layout: 'lightHorizontalLines',
        },
        ...footerBlocks,
    ];

    return {
        pageSize: 'A4',
        pageMargins: [40, 48, 40, 48],
        defaultStyle: {
            font: 'Roboto',
            fontSize: 10,
            color: '#18181b',
        },
        styles: {
            header: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] as [number, number, number, number] },
            sectionTitle: { fontSize: 11, bold: true, color: '#52525b' },
            body: { fontSize: 10 },
            muted: { fontSize: 9, color: '#71717a' },
            mutedSmall: { fontSize: 8, color: '#a1a1aa' },
            tableHeader: { fontSize: 9, bold: true, color: '#52525b' },
            total: { fontSize: 14, bold: true },
        },
        content,
    };
}
