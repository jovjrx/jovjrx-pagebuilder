#!/usr/bin/env node
const path = require('path')
const admin = require('firebase-admin')

const svcPath = path.join(__dirname, '../destravar-adminsdk.json')
const svc = require(svcPath)

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(svc), projectId: svc.project_id })

const db = admin.firestore()
const now = admin.firestore.FieldValue.serverTimestamp()
const t = (pt, en) => ({ 'pt-BR': pt, en })
const isoIn = (h) => new Date(Date.now() + h * 3600 * 1000).toISOString()

const product = {
  title: 'Streamer Pro: Viver de Lives',
  slug: 'streamer-pro-lives',
  description: 'Conteúdo exclusivo para iniciar e escalar ganhos com lives usando IA. Do zero ao lucro em 7 dias.',
  price: { amount: 19.9, currency: 'BRL' },
  type: 'digital_content',
  active: true,
  featured: true,
  image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop',
  video_url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
  tags: ['lives', 'streaming', 'IA', 'monetização'],
  mentor_id: 'q9zGqVrJokjVVG993mHP',
  access_key: 'STREAMERPRO',
  created_at: now,
  updated_at: now
}

const buildBlocks = (parentId) => [
  {
    type: 'hero',
    kind: 'section',
    title: t('Viver de Lives com IA', 'Live off Streaming with AI'),
    subtitle: t('Guia simples. Resultado rápido.', 'Simple guide. Fast results.'),
    description: t('Aprenda o método que transforma audiência em receita.', 'Learn the method that turns audience into revenue.'),
    content: [
      { type: 'text', variant: 'heading', value: t('💸 Comece a faturar com lives em 7 dias', '💸 Start earning from streams in 7 days'), order: 1 },
      { type: 'text', variant: 'subtitle', value: t('Setup, roteiros e IA prontos para usar', 'Setup, scripts and AI ready to use'), order: 2 },
      { type: 'media', media: { kind: 'youtube', url: 'https://www.youtube.com/embed/ysz5S6PUM-U', alt: 'Pitch' }, order: 3 },
      {
        type: 'actions',
        primary: {
          text: t('Acessar por R$ 19,90', 'Get access for R$ 19.90'),
          url: '/buy/streamer-pro-lives',
          action: 'buy',
          style: 'primary',
          price: { amount: 19.9, currency: 'BRL', original: 49.9 }
        },
        secondary: { text: t('Ver detalhes', 'See details'), url: '#detalhes', action: 'more_info', style: 'secondary' },
        benefits: [t('Acesso imediato', 'Instant access'), t('Atualizações incluídas', 'Updates included'), t('Garantia de 7 dias', '7-day guarantee')],
        urgency: { type: 'limited_time', message: t('Preço de lançamento por tempo limitado', 'Limited-time launch price'), endDate: isoIn(48) },
        order: 4
      }
    ],
    layout: { variant: 'split', align: 'center' },
    order: 1,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('O que você recebe', 'What you get'),
    subtitle: t('Tudo pronto para usar hoje', 'Everything ready to use today'),
    description: t('Processo enxuto de 4 passos', 'Lean 4-step process'),
    content: [
      { type: 'text', variant: 'heading', value: t('⚙️ Ferramentas e fluxos validados', '⚙️ Battle-tested tools and flows'), order: 1 },
      {
        type: 'list',
        role: 'feature',
        items: [
          { role: 'feature', title: t('Setup rápido', 'Fast setup'), text: t('Configuração em 30 minutos', '30-minute configuration'), meta: { icon: 'zap' } },
          { role: 'feature', title: t('Roteiros com IA', 'AI scripts'), text: t('Prompts prontos para lives', 'Ready-to-use live prompts'), meta: { icon: 'bot' } },
          { role: 'feature', title: t('Monetização', 'Monetization'), text: t('Mapas de oferta e CTA', 'Offer maps and CTAs'), meta: { icon: 'coin' } },
          { role: 'feature', title: t('Métricas', 'Metrics'), text: t('Painel simples de progresso', 'Simple progress dashboard'), meta: { icon: 'chart' } }
        ],
        order: 2
      },
      {
        type: 'list',
        role: 'feature',
        items: [
          { role: 'feature', title: t('Templates prontos', 'Ready templates'), text: t('Modelos para lives e ofertas', 'Models for streams and offers'), highlighted: true, meta: { icon: 'layout' } },
          { role: 'feature', title: t('Recursos bônus', 'Bonus resources'), text: t('Checklists, prompts e planilhas', 'Checklists, prompts and sheets'), meta: { icon: 'gift' } }
        ],
        order: 3
      }
    ],
    layout: { variant: 'grid', columns: 4, align: 'center', spacing: 'normal' },
    order: 2,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Resultados reais', 'Real results'),
    subtitle: t('Alunos e criadores', 'Students and creators'),
    description: t('Depoimentos verificados', 'Verified testimonials'),
    content: [
      { type: 'text', variant: 'heading', value: t('💬 Provas de ganho com lives', '💬 Proof of streaming income'), order: 1 },
      {
        type: 'list',
        role: 'testimonial',
        items: [
          {
            role: 'testimonial',
            title: t('Luana', 'Luana'),
            subtitle: t('Criadora iniciante', 'New creator'),
            text: t('Primeira semana e já paguei o investimento. Roteiros de IA ajudam muito.', 'First week and I already paid it back. AI scripts help a lot.'),
            rating: 5,
            media: { kind: 'image', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces' }
          },
          {
            role: 'testimonial',
            title: t('Rafael', 'Rafael'),
            subtitle: t('Streamer part-time', 'Part-time streamer'),
            text: t('Plano de oferta e CTAs aumentaram minhas conversões.', 'Offer plan and CTAs boosted my conversions.'),
            rating: 5,
            media: { kind: 'image', url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces' }
          }
        ],
        order: 2
      }
    ],
    layout: { variant: 'grid', columns: 2, align: 'center' },
    order: 3,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Acesso único', 'One-time access'),
    subtitle: t('Sem mensalidade', 'No subscription'),
    description: t('Preço de lançamento', 'Launch price'),
    content: [
      { type: 'text', variant: 'heading', value: t('💰 R$ 19,90 hoje', '💰 R$ 19.90 today'), order: 1 },
      {
        type: 'list',
        role: 'plan',
        items: [
          {
            role: 'plan',
            title: t('Acesso Streamer Pro', 'Streamer Pro Access'),
            subtitle: t('Documento exclusivo + bônus', 'Exclusive doc + bonus'),
            price: { amount: 19.9, currency: 'BRL', original: 49.9 },
            features: [
              t('Documento completo (PDF + links)', 'Full document (PDF + links)'),
              t('Prompts de IA prontos', 'Ready AI prompts'),
              t('Checklist de live', 'Live checklist'),
              t('Roteiros de oferta', 'Offer scripts')
            ],
            cta: { text: t('Comprar agora', 'Buy now'), url: '/buy/streamer-pro-lives', action: 'buy', style: 'primary' },
            highlighted: true,
            popular: true
          }
        ],
        order: 2
      },
      {
        type: 'actions',
        primary: {
          text: t('Comprar agora', 'Buy now'),
          url: '/buy/streamer-pro-lives',
          action: 'buy',
          style: 'primary',
          price: { amount: 19.9, currency: 'BRL', original: 49.9 }
        },
        secondary: { text: t('Falar com suporte', 'Talk to support'), url: '/contato', action: 'contact', style: 'outline' },
        order: 3
      }
    ],
    layout: { variant: 'stack', align: 'center' },
    order: 4,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Perguntas frequentes', 'FAQ'),
    subtitle: t('Antes de comprar', 'Before you buy'),
    description: t('Tire suas dúvidas', 'Clear your doubts'),
    content: [
      { type: 'text', variant: 'heading', value: t('❓ Dúvidas comuns', '❓ Common questions'), order: 1 },
      {
        type: 'list',
        role: 'faq',
        items: [
          { role: 'faq', qa: { q: t('O que é entregue?', 'What do I get?'), a: t('Documento com links, prompts e roteiros.', 'Document with links, prompts and scripts.') } },
          { role: 'faq', qa: { q: t('Tem garantia?', 'Is there a guarantee?'), a: t('Sim, 7 dias.', 'Yes, 7 days.') } },
          { role: 'faq', qa: { q: t('Serve para iniciantes?', 'For beginners?'), a: t('Sim, passo a passo.', 'Yes, step by step.') } }
        ],
        order: 2
      },
      {
        type: 'list',
        role: 'detail',
        items: [
          { role: 'detail', title: t('Acesso', 'Access'), text: t('Imediato após a compra', 'Immediate after purchase'), meta: { icon: 'bolt' } },
          { role: 'detail', title: t('Suporte', 'Support'), text: t('Canal dedicado para dúvidas', 'Dedicated help channel'), meta: { icon: 'life-buoy' } }
        ],
        order: 3
      }
    ],
    layout: { variant: 'stack', align: 'center' },
    order: 5,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Indicadores chave', 'Key indicators'),
    subtitle: t('Metas simples', 'Simple goals'),
    description: t('Foque no que importa', 'Focus on what matters'),
    content: [
      { type: 'text', variant: 'kpi', value: t('ROI em 7 dias', '7-day ROI'), order: 1 },
      {
        type: 'list',
        role: 'stat',
        items: [
          { role: 'stat', title: t('Conversão por live', 'Conversion per live'), stat: { value: '3–5%', color: 'green' } },
          { role: 'stat', title: t('Tempo on-air', 'On-air time'), stat: { value: '60–90m', color: 'blue' } },
          { role: 'stat', title: t('Ticket médio', 'Average ticket'), stat: { value: 'R$ 29–59', color: 'purple' } }
        ],
        order: 2
      }
    ],
    layout: { variant: 'grid', columns: 3, align: 'center' },
    order: 6,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Como funciona', 'How it works'),
    subtitle: t('4 passos práticos', '4 practical steps'),
    description: t('Aplicação imediata', 'Immediate application'),
    content: [
      { type: 'text', variant: 'paragraph', value: t('1) Setup. 2) Roteiro. 3) Oferta. 4) Análise.', '1) Setup. 2) Script. 3) Offer. 4) Review.'), order: 1 }
    ],
    layout: { variant: 'stack', align: 'start' },
    order: 7,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Exemplo de layout', 'Layout example'),
    subtitle: t('Tela limpa e objetiva', 'Clean and objective screen'),
    description: t('Referência visual', 'Visual reference'),
    content: [
      { type: 'media', media: { kind: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop', alt: 'Setup de live' }, order: 1 }
    ],
    layout: { variant: 'stack', align: 'center' },
    order: 8,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Checklist essencial', 'Essential checklist'),
    subtitle: t('Antes de entrar ao vivo', 'Before you go live'),
    description: t('Evite erros bobos', 'Avoid silly mistakes'),
    content: [
      {
        type: 'list',
        role: 'benefit',
        items: [
          { role: 'benefit', title: t('Áudio testado', 'Audio tested'), tags: ['mic'] },
          { role: 'benefit', title: t('Cena e luz', 'Scene and lighting'), tags: ['light'] },
          { role: 'benefit', title: t('Oferta definida', 'Offer defined'), tags: ['offer'] },
          { role: 'benefit', title: t('CTA visível', 'Visible CTA'), tags: ['cta'] }
        ],
        order: 1
      }
    ],
    layout: { variant: 'grid', columns: 2, align: 'start' },
    order: 9,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'cta',
    kind: 'section',
    title: t('Última chamada', 'Last call'),
    subtitle: t('Garanta o preço de lançamento', 'Lock the launch price'),
    description: t('Oferta expira em breve', 'Offer expires soon'),
    content: [
      {
        type: 'actions',
        primary: {
          text: t('Acessar por R$ 19,90', 'Get access for R$ 19.90'),
          url: '/buy/streamer-pro-lives',
          action: 'buy',
          style: 'primary',
          price: { amount: 19.9, currency: 'BRL', original: 49.9 }
        },
        benefits: [t('Acesso imediato', 'Instant access'), t('Atualizações incluídas', 'Updates included'), t('Garantia de 7 dias', '7-day guarantee')],
        urgency: { type: 'limited_quantity', message: t('Lotes promocionais quase no fim', 'Promo lots almost gone'), quantity: 200 },
        order: 1
      }
    ],
    layout: { variant: 'stack', align: 'center' },
    order: 10,
    active: true,
    version: 'published',
    parentId
  },

  {
    type: 'content',
    kind: 'section',
    title: t('Contagem para o bônus', 'Bonus countdown'),
    subtitle: t('Liberado até o fim do cronômetro', 'Available until the timer ends'),
    description: t('Gatilho objetivo', 'Objective nudge'),
    content: [
      { type: 'timer', endDate: isoIn(72), title: t('Bônus “Roteiro Express” incluso', '“Express Script” bonus included'), subtitle: t('Expira em', 'Expires in'), style: 'countdown', order: 1 }
    ],
    layout: { variant: 'stack', align: 'center' },
    order: 11,
    active: true,
    version: 'published',
    parentId
  },

  // Custom block example (renders without header, only content)
  {
    type: 'custom',
    kind: 'section',
    title: t('Custom', 'Custom'),
    subtitle: t('Somente HTML', 'HTML only'),
    description: t('Exemplo de bloco customizado', 'Custom block example'),
    content: [
      {
        type: 'html',
        value: t('<div style="padding:12px;border:1px dashed #94a3b8;border-radius:8px">Bloco <strong>Custom</strong> via HTML</div>', '<div style="padding:12px;border:1px dashed #94a3b8;border-radius:8px">Custom block via <strong>HTML</strong></div>'),
        order: 1
      }
    ],
    layout: { variant: 'stack', align: 'center' },
    order: 12,
    active: true,
    version: 'published',
    parentId
  }
]

async function run() {
  try {
    const productRef = await db.collection('products').add(product)
    const data = buildBlocks(productRef.id)
    for (let i = 0; i < data.length; i++) {
      const b = { ...data[i], parentId: productRef.id, created_at: now, updated_at: now }
      await db.collection('product_blocks').add(b)
    }
    console.log(`/comprar/${product.slug}`)
    console.log(`/${product.slug}`)
    console.log(`/admin/products/${productRef.id}`)
  } catch (e) {
    console.error(e?.message || e)
    process.exit(1)
  } finally {
    await admin.app().delete()
  }
}

run()
