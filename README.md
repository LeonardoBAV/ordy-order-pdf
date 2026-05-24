# @ordy/order-pdf

Pacote npm para gerar PDF de pedidos. Agnóstico de runtime — Node (Laravel) ou webpack (NativeScript).

- **Repositório:** https://github.com/LeonardoBAV/ordy-order-pdf
- **Input:** `OrderPdfInput` — DTO bruto + `locale`
- **Output:** `Buffer` + `suggestedFileName`
- **Internamente:** i18n, formatação, layout pdfmake

Arquitetura (app NativeScript): [`scancode-app-sample` specs](https://github.com/LeonardoBAV/scancode-app-sample/blob/main/specs/07-order-pdf-engine.md) — ou clone local `myCoolApp/specs/07-order-pdf-engine.md`

## Instalação

**NativeScript / Laravel (Git — recomendado):**

```json
{
  "dependencies": {
    "@ordy/order-pdf": "git+ssh://git@github.com/LeonardoBAV/ordy-order-pdf.git#v0.1.0"
  }
}
```

```bash
npm install
```

**Monorepo (legado — só durante migração):**

```json
"workspaces": ["packages/*"],
"@ordy/order-pdf": "workspace:*"
```

Requisito Laravel/servidor: **Node 18+**.

## API

```typescript
import { generateOrderPdf, type OrderPdfInput } from '@ordy/order-pdf';

const { buffer, suggestedFileName } = await generateOrderPdf(input);
```

Ver contrato completo em `src/types/order-pdf-input.ts` e fixture `test/fixtures/sample-order.pt-BR.json`.

## CLI

```bash
node node_modules/@ordy/order-pdf/bin/order-pdf.js -i order.json -o pedido.pdf
```

| Flag | Descrição |
| --- | --- |
| `--input` / `-i` | JSON `OrderPdfInput` |
| `--output` / `-o` | Caminho PDF |
| `--locale` / `-l` | Override opcional |

## NativeScript

No device não corre Node — webpack empacota o pacote. Ver `app/services/order-pdf/` no monorepo:

- `order-pdf.mapper.ts` — Order → DTO bruto
- `order-pdf.service.ts` — chama `generateOrderPdf`
- `order-pdf-file-writer.ts` — grava em `knownFolders.documents()`

```typescript
const filePath = await OrderPdfService.generateForOrderId(orderId);
```

## Laravel

PHP não executa o pacote. Montar JSON bruto e chamar Node:

```php
Process::run([
    'node', base_path('node_modules/@ordy/order-pdf/bin/order-pdf.js'),
    '--input', $jsonPath,
    '--output', $pdfPath,
]);
```

Mapper PHP: serializar Eloquent → mesmo JSON do app (sem formatação de PDF no PHP).

## Desenvolvimento

```bash
npm run build -w @ordy/order-pdf
npm run test -w @ordy/order-pdf
```
