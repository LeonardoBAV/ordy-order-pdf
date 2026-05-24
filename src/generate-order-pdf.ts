import { buildDocumentDefinition } from './layout/build-document-definition';
import { mapInputToViewModel } from './map/map-input-to-view-model';
import { normalizeInput } from './normalize/normalize-input';
import { renderPdf } from './render/pdfmake-renderer';
import { translate } from './i18n';
import type { OrderPdfInput, OrderPdfResult } from './types/order-pdf-input';

export async function generateOrderPdf(input: OrderPdfInput): Promise<OrderPdfResult> {
    const normalized = normalizeInput(input);
    const viewModel = mapInputToViewModel(normalized);
    const docDefinition = buildDocumentDefinition(viewModel);
    const buffer = await renderPdf(docDefinition);
    const suggestedFileName = translate(normalized.locale, 'filename', {
        orderNumber: String(normalized.meta.orderNumber),
    });

    return { buffer, suggestedFileName };
}
