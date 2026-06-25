/**
 * BreadcrumbList JSON-LD 生成器。
 *
 * 模型详情页已有可见面包屑（首页 › 模型 › <模型名>），此函数输出对应的结构化数据，
 * 让搜索引擎与 AI 引擎理解页面在站点层级中的位置。`url` 必须与可见面包屑、canonical
 * 完全一致（同样经 `new URL(localePath(...), site)` 绝对化）。
 *
 * 末项（当前页）按 schema.org 惯例仍带 `item`，指向自身 canonical。
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
