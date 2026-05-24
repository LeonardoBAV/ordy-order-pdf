declare module 'pdfmake/interfaces' {
    export interface TDocumentDefinitions {
        content?: unknown;
        pageSize?: string | { width: number; height: number };
        pageMargins?: number | [number, number, number, number];
        defaultStyle?: Record<string, unknown>;
        styles?: Record<string, unknown>;
        [key: string]: unknown;
    }

    export type Content = unknown;
}

declare module 'pdfmake/build/vfs_fonts' {
    const vfs: Record<string, string>;
    export = vfs;
}

declare module 'pdfmake' {
    class PdfPrinter {
        constructor(fontDescriptors: Record<string, Record<string, Buffer>>);
        createPdfKitDocument(docDefinition: unknown): unknown;
    }
    export = PdfPrinter;
}
