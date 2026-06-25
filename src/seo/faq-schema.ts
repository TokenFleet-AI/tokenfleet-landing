/**
 * FAQPage JSON-LD 生成器。
 *
 * 给搜索引擎与 AI 引擎一组可直接抽取的问答对（首页通用 FAQ / 模型页 per-model FAQ）。
 * 约束：传入的 `q`/`a` 必须与页面可见文本逐字一致——Google 要求 FAQ 结构化数据
 * 与可见内容相符，schema-only / 与正文不符的问答属违规。调用方负责保证同源。
 *
 * 返回纯对象，调用方经 `Base.astro` 的 `jsonLd` prop 注入。
 */
export interface FaqItem {
  q: string;
  a: string;
}

export function faqPageSchema(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
