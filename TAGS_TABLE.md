# Tags 表完整字段文档

## 表结构

```sql
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 字段详解

### id
- **类型**: UUID
- **约束**: PRIMARY KEY, NOT NULL
- **说明**: 标签的唯一标识符
- **自动生成**: 是（使用 `gen_random_uuid()`）
- **示例**: `550e8400-e29b-41d4-a716-446655440000`

### name
- **类型**: VARCHAR(100)
- **约束**: NOT NULL, UNIQUE
- **说明**: 标签名称，在系统中唯一
- **长度**: 最多 100 个字符
- **用途**: 在 UI 中显示
- **示例**: `AI设计`, `UI设计`, `深色模式`

### slug
- **类型**: VARCHAR(100)
- **约束**: NOT NULL, UNIQUE
- **说明**: URL 友好的标签标识符，用于生成标签页面的 URL
- **长度**: 最多 100 个字符
- **格式**: 小写字母、数字和连字符（kebab-case）
- **用途**: URL 路由、数据库查询
- **示例**: 
  - name: `AI设计` → slug: `ai-design`
  - name: `UI设计` → slug: `ui-design`
  - name: `深色模式` → slug: `dark-mode`

### description
- **类型**: TEXT
- **约束**: 可选（NULL）
- **说明**: 标签的详细描述
- **用途**: 在标签页面显示，或用于 SEO
- **示例**: `与人工智能和机器学习相关的设计趋势和应用`

### created_at
- **类型**: TIMESTAMP WITH TIME ZONE
- **约束**: NOT NULL
- **说明**: 标签创建时间
- **默认值**: 当前系统时间（`now()`）
- **自动设置**: 是
- **用途**: 审计日志、统计

---

## 索引

```sql
-- 自动创建的索引
- PRIMARY KEY: id
- UNIQUE: name
- UNIQUE: slug
```

---

## 完整的插入示例

```sql
-- 单条插入
INSERT INTO tags (name, slug, description) VALUES
  ('AI设计', 'ai-design', '与人工智能相关的设计');

-- 批量插入
INSERT INTO tags (name, slug, description) VALUES
  ('AI设计', 'ai-design', 'AI和机器学习在设计中的应用'),
  ('UI设计', 'ui-design', '用户界面设计最佳实践'),
  ('UX设计', 'ux-design', '用户体验设计和研究'),
  ('动效设计', 'animation-design', '交互动画和过渡效果'),
  ('深色模式', 'dark-mode', '深色主题设计实现'),
  ('响应式设计', 'responsive-design', '响应式布局和自适应设计'),
  ('可访问性', 'accessibility', '无障碍设计和包容性设计'),
  ('设计系统', 'design-system', '组件库和设计系统构建'),
  ('品牌设计', 'brand-design', '品牌识别和视觉系统'),
  ('Web3设计', 'web3-design', 'Web3和去中心化应用设计'),
  ('移动应用', 'mobile-app', '移动应用UI和UX设计'),
  ('平面设计', 'graphic-design', '平面设计和排版');
```

---

## 数据库操作（使用 TypeScript）

### 获取所有标签
```typescript
import { getTags } from '@/app/lib/database'

const { data: tags } = await getTags()
// 返回: [
//   { id: '...', name: 'AI设计', slug: 'ai-design', description: '...', created_at: '2026-08-11T...' },
//   { id: '...', name: 'UI设计', slug: 'ui-design', ... },
//   ...
// ]
```

### 按 slug 获取特定标签
```typescript
const { data: tagData } = await supabase
  .from('tags')
  .select('*')
  .eq('slug', 'ai-design')
  .single()
// 返回: { id: '...', name: 'AI设计', slug: 'ai-design', ... }
```

### 创建新标签
```typescript
import { createTag } from '@/app/lib/database'

const { data: newTag } = await createTag({
  name: '新标签',
  slug: 'new-tag',
  description: '新标签的描述'
})
```

### 搜索标签
```typescript
const { data: searchResults } = await supabase
  .from('tags')
  .select('*')
  .ilike('name', '%AI%')  // 模糊搜索
```

---

## 关联关系

### 与 article_tags 表的关系
```sql
-- article_tags 表通过 tag_id 引用 tags 表
CREATE TABLE article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,  -- ← 外键
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(article_id, tag_id)
);
```

### 获取标签下的所有文章
```sql
SELECT 
  a.*
FROM articles a
JOIN article_tags at ON a.id = at.article_id
JOIN tags t ON at.tag_id = t.id
WHERE t.slug = 'ai-design'
AND a.status = 'published'
ORDER BY a.publish_date DESC;
```

---

## 标签使用场景

### 1. 首页标签云
```typescript
// 获取所有标签用于显示标签云
const { data: tags } = await supabase
  .from('tags')
  .select('*')
  .order('name', { ascending: true })
```

### 2. 标签页面 `/tags/[slug]`
```typescript
// 获取特定标签下的文章
export default async function TagPage({ params }: { params: { slug: string } }) {
  const { data: tag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', params.slug)
    .single()

  const { data: articles } = await supabase
    .from('article_tags')
    .select('articles(*)')
    .eq('tag_id', tag.id)

  return <div>{/* 显示标签信息和文章列表 */}</div>
}
```

### 3. 文章详情页的标签显示
```typescript
// 获取文章的所有标签
const { data: articleTags } = await supabase
  .from('article_tags')
  .select('tags(*)')
  .eq('article_id', articleId)

// 显示为：#AI设计 #UI设计 #设计系统
```

### 4. 标签自动完成
```typescript
// 创建文章时的标签搜索
const handleTagSearch = async (query: string) => {
  const { data: suggestions } = await supabase
    .from('tags')
    .select('id, name, slug')
    .ilike('name', `%${query}%`)
    .limit(10)
  
  return suggestions
}
```

---

## SEO 优化

### 标签页的 Meta 标签
```typescript
export const metadata: Metadata = {
  title: `${tagName} - Design Radar`,
  description: `浏览所有关于 ${tagName} 的设计文章和灵感`,
  keywords: `${tagName}, 设计, 趋势, 灵感`,
  openGraph: {
    title: `${tagName} - Design Radar`,
    description: `浏览所有关于 ${tagName} 的设计文章`,
    type: 'website',
    url: `https://designradar.com/tags/${slug}`,
  },
}
```

### 结构化数据
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "AI设计",
  "description": "与人工智能相关的设计",
  "url": "https://designradar.com/tags/ai-design"
}
```

---

## 性能优化

### 预加载标签
```typescript
// 在应用启动时加载所有标签到内存
const tagsCache = await getTags()
// 或使用 SWR/React Query 进行缓存
```

### 计算标签文章数
```sql
SELECT 
  t.id,
  t.name,
  t.slug,
  COUNT(at.article_id) as article_count
FROM tags t
LEFT JOIN article_tags at ON t.id = at.tag_id
LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
GROUP BY t.id, t.name, t.slug
ORDER BY article_count DESC;
```

---

## 常见问题

### Q: 如何在创建文章时自动创建标签？
A: 在事务中执行：
```typescript
const { data: tag } = await createTag(...)
const { data: articleTag } = await supabase
  .from('article_tags')
  .insert([{ article_id: articleId, tag_id: tag.id }])
```

### Q: 如何批量更新标签？
A: 使用 `upsert` 操作：
```typescript
const { data } = await supabase
  .from('tags')
  .upsert([
    { name: 'AI设计', slug: 'ai-design', description: '新描述' }
  ], { onConflict: 'name' })
```

### Q: 如何删除未使用的标签？
A: 
```sql
DELETE FROM tags
WHERE id NOT IN (
  SELECT DISTINCT tag_id FROM article_tags
);
```

### Q: slug 应该如何生成？
A: 从 name 转换：
```typescript
const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-+/g, '-')
}

const name = '深色模式'
const slug = slugify(name)  // 'dark-mode'
```

---

## 推荐的标签列表

```typescript
const RECOMMENDED_TAGS = [
  // 设计技术
  { name: 'UI设计', slug: 'ui-design', description: '用户界面设计' },
  { name: 'UX设计', slug: 'ux-design', description: '用户体验设计' },
  { name: '设计系统', slug: 'design-system', description: '组件库和设计系统' },
  
  // 新技术
  { name: 'AI设计', slug: 'ai-design', description: '人工智能在设计中的应用' },
  { name: 'Web3设计', slug: 'web3-design', description: 'Web3应用设计' },
  
  // 平台
  { name: '移动应用', slug: 'mobile-app', description: '移动应用设计' },
  { name: '网页设计', slug: 'web-design', description: '网页设计' },
  
  // 设计理论
  { name: '动效设计', slug: 'animation-design', description: '交互动画设计' },
  { name: '深色模式', slug: 'dark-mode', description: '深色主题设计' },
  { name: '响应式设计', slug: 'responsive-design', description: '响应式设计' },
  
  // 其他
  { name: '品牌设计', slug: 'brand-design', description: '品牌和视觉识别' },
  { name: '可访问性', slug: 'accessibility', description: '无障碍设计' },
]
```

---

## 数据库迁移脚本更新

```sql
-- 如果需要添加更多字段到 tags 表
ALTER TABLE tags ADD COLUMN color VARCHAR(7);          -- 标签颜色
ALTER TABLE tags ADD COLUMN icon VARCHAR(50);          -- 标签图标
ALTER TABLE tags ADD COLUMN popularity_score INTEGER DEFAULT 0;  -- 热度
ALTER TABLE tags ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();  -- 更新时间
```

---

现在你有了完整的 tags 表文档！✨
