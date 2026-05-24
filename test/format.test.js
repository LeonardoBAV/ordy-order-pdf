const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formatCurrency, formatDate, formatCpfCnpj } = require('../dist/format');

test('formatCurrency pt-BR', () => {
    assert.equal(formatCurrency('pt-BR', 1234.5), 'R$ 1.234,50');
    assert.equal(formatCurrency('pt-BR', 10.5), 'R$ 10,50');
});

test('formatCurrency en', () => {
    assert.equal(formatCurrency('en', 1234.5), 'R$ 1,234.50');
});

test('formatDate pt-BR', () => {
    assert.equal(formatDate('pt-BR', '2026-05-23T10:00:00.000Z'), '23/05/2026');
});

test('formatDate en', () => {
    assert.equal(formatDate('en', '2026-05-23'), '05/23/2026');
});

test('formatCpfCnpj', () => {
    assert.equal(formatCpfCnpj('pt-BR', '12345678901'), '123.456.789-01');
    assert.equal(formatCpfCnpj('pt-BR', '12345678000190'), '12.345.678/0001-90');
});
