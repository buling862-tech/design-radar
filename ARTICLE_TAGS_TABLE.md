# article_tags 表完整字段文档

## 表结构

```sql
CREATE TABLE IF NOT EXISTS article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(article_id, tag_id)
);
```

## 字段详解

### id
- **类型**: UUID
- **约束**: PRIMARY KEY, NOT NULL
- **说明**: 关联记录的唯一标识符
- **自动生成**: 是（使用 `gen_random_uuid()`）
- **用途**: 内部记录标识
- **示例**: `550e8400-e29b-41d4-a716-446655440000`

### article_id ⭐ 
- **类型**: UUID
- **约束**: NOT NULL, FOREIGN KEY
- **说明**: 关联的文章 ID
- **引用**: `articles.id`
- **删除策略**: ON DELETE CASCADE（当文章被删除时，关联记录也被删除）
- **用途**: 指定该标签属于哪篇文章
- **示例**: `article-uuid-1`

### tag_id ⭐
- **类型**: UUID
- **约束**: NOT NULL, FOREIGN KEY
- **说明**: 关联的标签 ID
- **引用**: `tags.id`
- **删除策略**: ON DELETE CASCADE（当标签被删除时，关联记录也被删除）
- **用途**: 指定要关联的标签
- **示例**: `tag-uuid-ai-design`

### created_at
- **类型**: TIMESTAMP WITH TIME ZONE
- **约束**: NOT NULL
- **说明**: 关联创建时间
- **默认值**: 当前系统时间（`now()`）
- **自动设置**: 是
- **用途**: 审计日志、统计
- **示例**: `2026-08-11T12:00:00Z`

---

## 约束

### UNIQUE 约束
```sql
UNIQUE(article_id, tag_id)
```

- **说明**: 同一篇文章不能关联同一个标签两次
- **用途**: 防止重复数据
- **效果**: 每条 (article_id, tag_id) 组合只能出现一次

### 外键约束
```sql
-- article_id 外键
FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE

-- tag_id 外键
FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
```

- **说明**: 确保数据完整性和一致性
- **ON DELETE CASCADE**: 级联删除（删除父记录时自动删除关联记录）
- **效果**: 
  - 删除文章 → 自动删除该文章的所有标签关联
  - 删除标签 → 自动删除所有引用该标签的关联

---

## 索引

```sql
-- 自动创建的索引
CREATE INDEX idx_article_tags_article ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);

-- 内部约束
UNIQUE(article_id, tag_id)
```

- **article_id 索引**: 快速查询某篇文章的所有标签
- **tag_id 索引**: 快速查询某个标签的所有文章

---

## 完整的 SQL 操作示例

### 插入单条关联

```sql
-- 为文章 article-id-1 添加标签 tag-id-ai-design
INSERT INTO article_tags (article_id, tag_id)
VALUES (
  (SELECT id FROM articles WHERE title = '2026年设计趋势预测'),
  (SELECT id FROM tags WHERE slug = 'ai-design')
);
```

### 批量插入关联

```sql
-- 为某篇文章添加多个标签
INSERT INTO article_tags (article_id, tag_id) VALUES
  ('article-uuid-1', 'tag-uuid-ai-design'),
  ('article-uuid-1', 'tag-uuid-ui-design'),
  ('article-uuid-1', 'tag-uuid-2026-trends');
```

### 查询文章的所有标签

```sql
-- 获取特定文章的所有标签
SELECT t.id, t.name, t.slug, t.description
FROM article_tags at
JOIN tags t ON at.tag_id = t.id
WHERE at.article_id = 'article-uuid-1'
ORDER BY t.name;
```

### 查询标签下的所有文章

```sql
-- 获取特定标签下的所有文章
SELECT a.id, a.title, a.summary, a.publish_date
FROM article_tags at
JOIN articles a ON at.article_id = a.id
WHERE at.tag_id = 'tag-uuid-ai-design'
AND a.status = 'published'
ORDER BY a.publish_date DESC;
```

### 删除关联

```sql
-- 删除某篇文章与某个标签的关联
DELETE FROM article_tags
WHERE article_id = 'article-uuid-1'
AND tag_id = 'tag-uuid-ai-design';

-- 删除某篇文章的所有标签
DELETE FROM article_tags
WHERE article_id = 'article-uuid-1';

-- 删除某个标签的所有关联（通常不需要，CASCADE 会自动处理）
DELETE FROM article_tags
WHERE tag_id = 'tag-uuid-ai-design';
```

### 统计信息

```sql
-- 统计每个标签关联的文章数
SELECT 
  t.id,
  t.name,
  COUNT(at.article_id) as article_count
FROM tags t
LEFT JOIN article_tags at ON t.id = at.tag_id
GROUP BY t.id, t.name
ORDER BY article_count DESC;

-- 统计每篇文章的标签数
SELECT 
  a.id,
  a.title,
  COUNT(at.tag_id) as tag_count
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
GROUP BY a.id, a.title
ORDER BY tag_count DESC;
```

---

## 数据库操作（使用 TypeScript）

### 为文章添加标签

```typescript
import { supabase } from '@/app/lib/supabase'

// 单个标签
async function addTagToArticle(articleId: string, tagId: string) {
  const { data, error } = await supabase
    .from('article_tags')
    .insert([{ article_id: articleId, tag_id: tagId }])
    .select()
    .single()

  return { data, error }
}

// 多个标签
async function addTagsToArticle(articleId: string, tagIds: string[]) {
  const rows = tagIds.map(tagId => ({
    article_id: articleId,
    tag_id: tagId
  }))

  const { data, error } = await supabase
    .from('article_tags')
    .insert(rows)
    .select()

  return { data, error }
}
```

### 获取文章的所有标签

```typescript
async function getArticleTags(articleId: string) {
  const { data, error } = await supabase
    .from('article_tags')
    .select('tags(*)')
    .eq('article_id', articleId)

  // 返回: [
  //   { id: 'tag-uuid-1', name: 'AI设计', slug: 'ai-design', ... },
  //   { id: 'tag-uuid-2', name: 'UI设计', slug: 'ui-design', ... }
  // ]

  return { data, error }
}
```

### 获取标签下的所有文章

```typescript
async function getArticlesByTag(tagId: string) {
  const { data, error } = await supabase
    .from('article_tags')
    .select('articles(*)')
    .eq('tag_id', tagId)
    .then(result => ({
      ...result,
      data: result.data?.map((at: any) => at.articles).flat()
    }))

  return { data, error }
}
```

### 删除标签关联

```typescript
async function removeTagFromArticle(articleId: string, tagId: string) {
  const { error } = await supabase
    .from('article_tags')
    .delete()
    .eq('article_id', articleId)
    .eq('tag_id', tagId)

  return { error }
}

// 删除文章的所有标签
async function removeAllTagsFromArticle(articleId: string) {
  const { error } = await supabase
    .from('article_tags')
    .delete()
    .eq('article_id', articleId)

  return { error }
}
```

### 检查标签是否已关联

```typescript
async function isArticleTagged(articleId: string, tagId: string) {
  const { data, count } = await supabase
    .from('article_tags')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)
    .eq('tag_id', tagId)

  return count === 1
}
```

---

## 实际应用场景

### 场景 1：创建文章时添加标签

```typescript
async function createArticleWithTags(
  article: ArticleData,
  tagIds: string[]
) {
  // 1. 创建文章
  const { data: newArticle, error: articleError } = await createArticle(article)
  if (articleError) return { error: articleError }

  // 2. 添加标签
  const rows = tagIds.map(tagId => ({
    article_id: newArticle.id,
    tag_id: tagId
  }))

  const { error: tagsError } = await supabase
    .from('article_tags')
    .insert(rows)

  if (tagsError) return { error: tagsError }

  return { data: newArticle }
}
```

### 场景 2：编辑文章标签

```typescript
async function updateArticleTags(
  articleId: string,
  newTagIds: string[]
) {
  // 1. 删除所有旧标签
  await supabase
    .from('article_tags')
    .delete()
    .eq('article_id', articleId)

  // 2. 添加新标签
  const rows = newTagIds.map(tagId => ({
    article_id: articleId,
    tag_id: tagId
  }))

  const { data, error } = await supabase
    .from('article_tags')
    .insert(rows)
    .select()

  return { data, error }
}
```

### 场景 3：标签页面显示文章

```typescript
// 在 /tags/[slug]/page.tsx 中使用
export default async function TagPage({ params }: { params: { slug: string } }) {
  // 1. 获取标签
  const { data: tag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!tag) return notFound()

  // 2. 获取该标签下的所有文章
  const { data: articleTags } = await supabase
    .from('article_tags')
    .select('articles(*)')
    .eq('tag_id', tag.id)

  const articles = articleTags?.map((at: any) => at.articles) || []

  return (
    <div>
      <h1>{tag.name}</h1>
      <div className="grid">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
```

### 场景 4：文章详情页显示标签

```typescript
export default async function ArticlePage({ params }: { params: { id: string } }) {
  // 1. 获取文章
  const { data: article } = await getArticleById(params.id)

  // 2. 获取文章的标签
  const { data: articleTags } = await supabase
    .from('article_tags')
    .select('tags(*)')
    .eq('article_id', params.id)

  const tags = articleTags?.map((at: any) => at.tags) || []

  return (
    <article>
      <h1>{article.title}</h1>
      <div className="tags">
        {tags.map(tag => (
          <Link key={tag.id} href={`/tags/${tag.slug}`}>
            #{tag.name}
          </Link>
        ))}
      </div>
    </article>
  )
}
```

---

## 关系图

```
articles (1)
    ↓
    ↓ article_id (FK)
    ↓
article_tags (多)
    ↓
    ↓ tag_id (FK)
    ↓
tags (多)

实际多对多关系：
- 一篇文章可以有多个标签
- 一个标签可以属于多篇文章
```

---

## 性能优化

### 预加载标签

```typescript
// 在获取文章列表时同时加载标签
const { data: articles } = await supabase
  .from('articles')
  .select('*, article_tags(tags(*))')  // 深层嵌套查询
  .eq('status', 'published')
```

### 缓存热门标签

```typescript
// 计算标签热度
const tagHeatMap = new Map<string, number>()

articles.forEach(article => {
  article.article_tags?.forEach(at => {
    const tagId = at.tag_id
    tagHeatMap.set(tagId, (tagHeatMap.get(tagId) || 0) + 1)
  })
})
```

### 批量操作优化

```typescript
// 避免 N+1 查询问题
const articles = await getArticles()

// ❌ 错误：会产生 N+1 查询
for (const article of articles) {
  const tags = await getArticleTags(article.id)  // N 个额外查询
}

// ✅ 正确：一次查询获取所有
const { data: allArticleTags } = await supabase
  .from('article_tags')
  .select('*')
  .in('article_id', articles.map(a => a.id))
```

---

## SEO 优化

### 动态 Sitemap 包含标签页

```typescript
// app/sitemap.ts
export default function sitemap() {
  const { data: tags } = await getTags()
  
  return [
    ...tags.map(tag => ({
      url: `https://designradar.com/tags/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  ]
}
```

### Schema.org 结构化数据

```typescript
// 标签页的结构化数据
const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": tagName,
  "hasPart": articles.map(a => ({
    "@type": "Article",
    "@id": `https://designradar.com/articles/${a.id}`,
    "headline": a.title
  }))
}
```

---

## 常见问题

### Q: 如何防止添加重复的标签关联？
A: 使用 UNIQUE 约束，Supabase 会自动防止重复：
```typescript
try {
  await supabase.from('article_tags').insert({
    article_id: articleId,
    tag_id: tagId
  })
} catch (error) {
  // 处理重复关联错误
  if (error.code === '23505') {
    console.log('Tag already associated with this article')
  }
}
```

### Q: 删除文章时标签关联会怎样？
A: 由于设置了 ON DELETE CASCADE，文章的所有标签关联会自动删除
```sql
-- 删除文章时
DELETE FROM articles WHERE id = 'article-id'
-- 自动删除
DELETE FROM article_tags WHERE article_id = 'article-id'
```

### Q: 如何获取文章的标签列表和文章信息？
A: 使用嵌套查询：
```typescript
const { data } = await supabase
  .from('articles')
  .select('*, article_tags(tags(id, name, slug))')
  .eq('id', articleId)
```

### Q: 如何排序标签关联？
A: 在查询中添加排序：
```typescript
const { data } = await supabase
  .from('article_tags')
  .select('*')
  .eq('article_id', articleId)
  .order('created_at', { ascending: false })
```

---

## 数据完整性检查

```sql
-- 检查是否有孤立的关联记录
SELECT at.*
FROM article_tags at
WHERE NOT EXISTS (SELECT 1 FROM articles a WHERE a.id = at.article_id)
OR NOT EXISTS (SELECT 1 FROM tags t WHERE t.id = at.tag_id);

-- 如果有孤立记录，清理它们
DELETE FROM article_tags at
WHERE NOT EXISTS (SELECT 1 FROM articles a WHERE a.id = at.article_id)
OR NOT EXISTS (SELECT 1 FROM tags t WHERE t.id = at.tag_id);
```

---

## 总结

**article_tags 表**是一个中间表，用于实现 **articles** 和 **tags** 之间的**多对多**关系：

- ✅ 一篇文章可以有多个标签
- ✅ 一个标签可以属于多篇文章
- ✅ 自动级联删除确保数据一致性
- ✅ 唯一约束防止重复关联
- ✅ 完善的索引确保查询性能

现在你已经掌握了完整的 article_tags 表用法！ 🎉
