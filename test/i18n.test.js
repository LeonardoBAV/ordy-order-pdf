const { test } = require('node:test');
const assert = require('node:assert/strict');
const { translate } = require('../dist/i18n');

test('translate pt-BR status', () => {
    assert.equal(translate('pt-BR', 'status.pending'), 'Aberto');
    assert.equal(translate('pt-BR', 'status.completed'), 'Concluído');
});

test('translate en status', () => {
    assert.equal(translate('en', 'status.pending'), 'Open');
});

test('translate filename interpolation', () => {
    assert.equal(
        translate('pt-BR', 'filename', { orderNumber: 123 }),
        'pedido-123.pdf',
    );
    assert.equal(
        translate('en', 'filename', { orderNumber: 456 }),
        'order-456.pdf',
    );
});
