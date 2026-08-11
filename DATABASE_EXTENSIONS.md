# Design Radar 数据库扩展 - AI 分析字段

## 🎯 articles 表新增字段

现有的 `articles` 表需要添加以下字段来支持 AI 分析结果的存储：

### SQL 迁移脚本

```sql
-- 添加 AI 分析字段到 articles 表
ALTER TABLE articles ADD COLUMN IF NOT EXISTS focus_points TEXT[] DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS inspiration_points TEXT[] DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_design_trend BOOLEAN DEFAULT FALSE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_competitor_tracking BOOLEAN DEFAULT FALSE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source VARCHAR(100);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_url TEXT;

-- 创建索引用于快速查询
CREATE INDEX IF NOT EXISTS idx_articles_is_design_trend ON articles(is_design_trend);
CREATE INDEX IF NOT EXISTS idx_articles_is_competitor_tracking ON articles(is_competitor_tracking);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
```

---

## 📋 字段详解

| 字段 | 类型 | 说明 | 来源 |
|-----|-----|------|------|
| `focus_points` | `TEXT[]` | 设计关注点数组（3 条） | AI 分析 |
| `inspiration_points` | `TEXT[]` | 设计启发数组（3 条） | AI 分析 |
| `is_design_trend` | `BOOLEAN` | 是否属于设计趋势 | AI 判断 |
| `is_competitor_tracking` | `BOOLEAN` | 是否属于竞品追踪 | AI 判断 |
| `source` | `VARCHAR(100)` | 内容源（Figma Blog, Dezeen 等） | 原始采集 |
| `source_url` | `TEXT` | 原始链接 | 原始采集 |

---

## 🔄 数据库操作流程

### 1. 用户提交内容
```javascript
POST /api/collect
{
  "source": "Figma Blog",
  "title": "...",
  "url": "https://figma.com/...",
  "content": "完整内容...",
  "image": "缩略图...",
  "publishedAt": "2026-08-11T10:00:00Z"
}
```

### 2. 系统分析
```
AI 分析内容
  ↓
生成 JSON
{
  "title": "...",
  "summary": "...",
  "focus": ["...", "...", "..."],
  "inspiration": ["...", "...", "..."],
  "tags": ["AI", "Figma", ...],
  "category": "design_trends"
}
```

### 3. 数据库写入
```sql
INSERT INTO articles (
  title,
  description,
  content,
  image_url,
  source_url,
  source,
  focus_points,
  inspiration_points,
  is_design_trend,
  is_competitor_tracking,
  published_date,
  status
) VALUES (
  'AI Design Generation',
  'Figma 发布新的 AI 生成设计功能',
  '完整内容...',
  'https://image.png',
  'https://figma.com/blog/...',
  'Figma Blog',
  '{"AI 生成初稿", "提高效率 50%", "实时协作"}',
  '{"智能硬件 UI 生成", "AI 在设计领域应用", "人机协作流程"}',
  true,
  true,
  '2026-08-11T10:00:00Z',
  'draft'
);
```

### 4. 标签关联
```sql
INSERT INTO article_tags (article_id, tag_id)
SELECT article.id, tag.id
FROM tags
WHERE tag.name IN ('AI', 'Figma', '生成设计', '设计工具')
```

---

## 📊 查询示例

### 查询所有设计趋势
```sql
SELECT 
  id,
  title,
  description,
  focus_points,
  inspiration_points,
  source,
  published_date
FROM articles
WHERE is_design_trend = true
  AND status = 'published'
ORDER BY published_date DESC
LIMIT 10;
```

### 查询竞品追踪
```sql
SELECT 
  id,
  title,
  description,
  source,
  is_competitor_tracking,
  published_date
FROM articles
WHERE is_competitor_tracking = true
  AND status = 'published'
ORDER BY published_date DESC;
```

### 查询特定源的文章
```sql
SELECT 
  id,
  title,
  focus_points,
  inspiration_points,
  published_date
FROM articles
WHERE source = 'Figma Blog'
ORDER BY published_date DESC;
```

### 获取文章详情（包括标签）
```sql
SELECT 
  a.id,
  a.title,
  a.description,
  a.content,
  a.image_url,
  a.focus_points,
  a.inspiration_points,
  a.source,
  a.source_url,
  ARRAY_AGG(t.name) as tags
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.id = 'article-uuid'
GROUP BY a.id, a.title, a.description, a.content, 
         a.image_url, a.focus_points, a.inspiration_points, 
         a.source, a.source_url;
```

---

## 🔍 前端数据结构

### TypeScript 类型定义

```typescript
// app/types/article.ts

export interface Article {
  id: string
  title: string
  description: string
  content: string
  image_url?: string
  source: string
  source_url: string
  focus_points: string[]
  inspiration_points: string[]
  is_design_trend: boolean
  is_competitor_tracking: boolean
  tags: string[]
  published_date: string
  created_at: string
  updated_at: string
  status: 'draft' | 'published' | 'archived'
}

export interface ArticleAnalysis {
  title: string
  summary: string
  focus: string[]
  inspiration: string[]
  tags: string[]
  category: 'design_trends' | 'competitor_tracking' | 'general'
  isDesignTrend: boolean
  isCompetitorTracking: boolean
}

export interface RawContent {
  source: string
  title: string
  url: string
  content: string
  image?: string
  publishedAt?: Date
}
```

---

## 🚀 部署步骤

### 1. 在 Supabase SQL Editor 中执行迁移脚本

```bash
# 复制 SQL 脚本到 Supabase SQL Editor
# 点击执行
```

### 2. 验证字段是否添加成功

```sql
-- 检查 articles 表结构
\d articles

-- 或查询表信息
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles'
ORDER BY ordinal_position;
```

### 3. 查看现有数据

```sql
SELECT 
  id, 
  title, 
  source, 
  focus_points, 
  inspiration_points,
  is_design_trend,
  is_competitor_tracking
FROM articles
LIMIT 5;
```

---

## 💡 使用场景

### 场景 1: 首页设计趋势展示
```typescript
// 获取最新的设计趋势（AI 标记的）
const { data: trends } = await supabase
  .from('articles')
  .select('id, title, description, image_url, focus_points, published_date')
  .eq('is_design_trend', true)
  .eq('status', 'published')
  .order('published_date', { ascending: false })
  .limit(6)
```

### 场景 2: 竞品追踪页面
```typescript
// 获取竞品追踪内容
const { data: competitors } = await supabase
  .from('articles')
  .select('id, title, source, published_date, inspiration_points')
  .eq('is_competitor_tracking', true)
  .eq('status', 'published')
  .order('published_date', { ascending: false })
```

### 场景 3: 文章详情页
```typescript
// 显示文章的分析结果
const { data: article } = await supabase
  .from('articles')
  .select(`
    *,
    article_tags (
      tags (name)
    )
  `)
  .eq('id', articleId)
  .single()

// article.focus_points -> 设计关注点
// article.inspiration_points -> 设计启发
// article.is_design_trend -> 标记为趋势
```

---

## ✨ 前端展示示例

### 设计关注点卡片
```tsx
<div className="bg-blue-50 p-4 rounded-lg">
  <h3 className="font-semibold mb-2">🎨 设计关注点</h3>
  <ul className="space-y-1">
    {article.focus_points.map((point) => (
      <li key={point} className="text-sm text-gray-700">
        • {point}
      </li>
    ))}
  </ul>
</div>
```

### 设计启发卡片
```tsx
<div className="bg-green-50 p-4 rounded-lg">
  <h3 className="font-semibold mb-2">💡 对智能硬件设计启发</h3>
  <ul className="space-y-1">
    {article.inspiration_points.map((inspiration) => (
      <li key={inspiration} className="text-sm text-gray-700">
        • {inspiration}
      </li>
    ))}
  </ul>
</div>
```

### 分类标签
```tsx
<div className="flex gap-2">
  {article.is_design_trend && (
    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
      📈 设计趋势
    </span>
  )}
  {article.is_competitor_tracking && (
    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
      🎯 竞品追踪
    </span>
  )}
</div>
```

---

## 📈 数据统计

### 统计设计趋势数量
```sql
SELECT COUNT(*) as trend_count
FROM articles
WHERE is_design_trend = true
  AND status = 'published';
```

### 按源统计内容
```sql
SELECT 
  source,
  COUNT(*) as article_count,
  SUM(CASE WHEN is_design_trend THEN 1 ELSE 0 END) as trend_count
FROM articles
GROUP BY source
ORDER BY article_count DESC;
```

---

## 🎯 检查清单

- [ ] SQL 迁移脚本执行成功
- [ ] 新字段在 articles 表中可见
- [ ] 索引创建成功
- [ ] 现有数据不受影响
- [ ] API 端点正常工作
- [ ] 测试 AI 分析功能
- [ ] 前端能正确显示新字段
- [ ] 生产环境部署测试

---

现在数据库已经准备好存储 AI 分析的结果了！ 🎉
