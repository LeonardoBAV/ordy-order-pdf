#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function parseArgs(argv) {
    const result = { input: null, output: null, locale: null };
    for (let i = 2; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--input' || arg === '-i') {
            result.input = argv[++i];
        } else if (arg === '--output' || arg === '-o') {
            result.output = argv[++i];
        } else if (arg === '--locale' || arg === '-l') {
            result.locale = argv[++i];
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
    }
    return result;
}

function printHelp() {
    console.log(`Usage: order-pdf --input <file.json> [--output <file.pdf>] [--locale pt-BR|en]

Generate an order PDF from OrderPdfInput JSON.
`);
}

async function main() {
    const args = parseArgs(process.argv);
    if (!args.input) {
        console.error('Error: --input is required');
        printHelp();
        process.exit(1);
    }

    const inputPath = path.resolve(args.input);
    if (!fs.existsSync(inputPath)) {
        console.error(`Error: input file not found: ${inputPath}`);
        process.exit(1);
    }

    let payload;
    try {
        payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    } catch (error) {
        console.error('Error: invalid JSON input', error);
        process.exit(1);
    }

    if (args.locale) {
        payload.locale = args.locale;
    }

    const { generateOrderPdf } = require('../dist/generate-order-pdf');

    try {
        const { buffer, suggestedFileName } = await generateOrderPdf(payload);
        const outputPath = path.resolve(args.output ?? suggestedFileName);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, buffer);
        console.log(outputPath);
    } catch (error) {
        console.error('Error: PDF generation failed', error);
        process.exit(2);
    }
}

main();
