import type { TDocumentDefinitions } from 'pdfmake/interfaces';

interface FontVfs {
    'Roboto-Regular.ttf': string;
    'Roboto-Medium.ttf': string;
    'Roboto-Italic.ttf': string;
    'Roboto-MediumItalic.ttf': string;
}

interface PdfKitDocument {
    on(event: 'data', listener: (chunk: Buffer) => void): PdfKitDocument;
    on(event: 'end', listener: () => void): PdfKitDocument;
    on(event: 'error', listener: (error: Error) => void): PdfKitDocument;
    end(): void;
}

interface PdfPrinterInstance {
    createPdfKitDocument(docDefinition: TDocumentDefinitions): PdfKitDocument;
}

interface PdfPrinterConstructor {
    new (fontDescriptors: Record<string, Record<string, Buffer>>): PdfPrinterInstance;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake') as PdfPrinterConstructor;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const vfs = require('pdfmake/build/vfs_fonts') as FontVfs;

let printerInstance: PdfPrinterInstance | null = null;

function getPrinter(): PdfPrinterInstance {
    if (!printerInstance) {
        const fonts = {
            Roboto: {
                normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
                bold: Buffer.from(vfs['Roboto-Medium.ttf'], 'base64'),
                italics: Buffer.from(vfs['Roboto-Italic.ttf'], 'base64'),
                bolditalics: Buffer.from(vfs['Roboto-MediumItalic.ttf'], 'base64'),
            },
        };
        printerInstance = new PdfPrinter(fonts);
    }
    return printerInstance;
}

export function renderPdf(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const pdfDoc = getPrinter().createPdfKitDocument(docDefinition);
            const chunks: Buffer[] = [];
            pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', (error: Error) => reject(error));
            pdfDoc.end();
        } catch (error: unknown) {
            reject(error instanceof Error ? error : new Error(String(error)));
        }
    });
}
