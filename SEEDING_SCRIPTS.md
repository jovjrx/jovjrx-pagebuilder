# Seeding Scripts Guide

This guide explains how to create insertion (seeding) scripts to populate Firestore with Pages or Blocks using the JovJrx PageBuilder schema.

## Collections and Modes

- Pages mode: store entire pages in a collection (default: `pages`).
- Blocks-only mode: store blocks referencing a parent entity (e.g., product) in a collection (default: `product_blocks`).

Pick one strategy and keep it consistent in your app. The examples below use blocks-only mode for a `products` collection and a `product_blocks` collection.

## Block Schema Overview

Structural block types:
- `hero` | `cta` | `content` | `custom`

Content items allowed inside `block.content`:
- `text` (variant: heading | subtitle | paragraph | caption | kpi | list)
- `media` (image | video | youtube | vimeo)
- `actions` (primary/secondary CTA, benefits, urgency)
- `list` with role: `feature | testimonial | faq | plan | benefit | stat | detail`
- `html` (raw HTML string or i18n)
- `timer` (deprecated; prefer `actions.urgency`)

Key layout fields (optional, mostly for `content` blocks):
- `variant: 'stack' | 'split' | 'grid' | 'carousel'`
- `container: 'boxed' | 'fluid' | 'none'` (section container)
- `gridColumns` or `templateColumns` (for grid)
- `gap` (spacing token or px)

Theme overrides (optional):
- `background`, `text`, `accent`, `border`, `shadow` (prefer theme tokens)

## Minimal Block Example

```js
const block = {
  type: 'content',
  kind: 'section',
  title: { 'pt-BR': 'Título', en: 'Title' },
  content: [
    { type: 'text', variant: 'paragraph', value: { 'pt-BR': 'Olá', en: 'Hello' }, order: 0 },
    { type: 'list', role: 'feature', items: [ { role: 'feature', title: { 'pt-BR': 'Rápido', en: 'Fast' } } ], order: 1 }
  ],
  layout: { variant: 'stack', align: 'center' },
  order: 1,
  active: true,
  version: 'published'
}
```

## List Roles Cheatsheet

- feature: `title`, `text`, optional `meta.icon`, optional `stat.value/color`
- testimonial: `text` (quote), `title` (author), `subtitle` (role), optional `media.image` (avatar), `rating`
- faq: `qa.q`, `qa.a` (fallback: `title`/`text`)
- plan: `title`, `subtitle`, `price.{amount,currency,original}`, `features: MultiLanguageContent[]`, optional `cta`
- benefit: `title`, optional `tags: string[]`
- stat: `stat.value/color`, label in `title`
- detail: `title` (term), `text` (description), optional `meta.icon`

## Authentication and Admin SDK

Seeding scripts typically use Firebase Admin SDK via a service account JSON:

```js
const admin = require('firebase-admin')
const svc = require('./service-account.json')
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(svc), projectId: svc.project_id })
const db = admin.firestore()
```

Note: keep service account files private and out of source control.

## Writing to Firestore

Blocks-only mode example (products + product_blocks):

```js
const productRef = await db.collection('products').add({
  title: 'My Product', created_at: admin.firestore.FieldValue.serverTimestamp()
})

const blocks = buildBlocks(productRef.id)
for (const b of blocks) {
  await db.collection('product_blocks').add({
    ...b,
    parentId: productRef.id,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  })
}
```

## Prompt template for GPT (to generate a seeding script)

Copy-paste and customize:

```
You are generating a Node.js Firestore seeding script for the "JovJrx PageBuilder" schema.
Requirements:
- Use Firebase Admin SDK with a local service account JSON (path provided by user)
- Write one document to a parent collection (e.g., products) and a list of blocks to a child collection (e.g., product_blocks)
- Use the PageBuilder Block schema:
  - Block.type: hero | cta | content | custom
  - Block.kind: section | component
  - content items: text | media | actions | list (role: feature | testimonial | faq | plan | benefit | stat | detail) | html | timer (deprecated)
- Provide i18n fields for strings: at least 'pt-BR' and 'en'
- Avoid custom colors (default theme). Layout can be stack/split/grid.
- Include representative data for all list roles and basic actions/media/text
- Order items via `order`
- Add timestamps using FieldValue.serverTimestamp()
Output:
- A single runnable JS file (Node >=16) with buildBlocks(parentId) and run() that writes to Firestore and logs created URLs/IDs
- Use try/catch and finally admin.app().delete()
```

## Tips

- Always set `order` in each content item to control render order.
- Prefer structured `list` roles over custom HTML when possible; keep HTML for extras.
- For urgency, prefer `actions.urgency` instead of a separate `timer` item.
- Keep themes at defaults in seed data to focus on structure validation.
