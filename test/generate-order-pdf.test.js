const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { generateOrderPdf } = require('../dist/generate-order-pdf');
const { mapInputToViewModel } = require('../dist/map/map-input-to-view-model');

const fixturePath = path.join(__dirname, 'fixtures', 'sample-order.pt-BR.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

test('mapInputToViewModel calculates totals', () => {
    const viewModel = mapInputToViewModel(fixture);
    assert.equal(viewModel.totals.itemCount, 3);
    assert.equal(viewModel.totals.grandTotal, 'R$ 46,00');
});

test('generateOrderPdf returns non-empty buffer', async () => {
    const result = await generateOrderPdf(fixture);
    assert.ok(result.buffer.length > 0);
    assert.equal(result.suggestedFileName, 'pedido-123.pdf');
    assert.equal(result.buffer.subarray(0, 4).toString(), '%PDF');
});
