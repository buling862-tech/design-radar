# Design Radar 数据库架构文档

## 📊 完整的表结构

### articles（文章表）
核心表，存储所有文章内容。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符，自动生成 |
| title | VARCHAR(255) | ✅ | 文章标题 |
| summary | TEXT | ❌ | 文章摘要/描述 |
| content | TEXT | ❌ | 完整的文章内容 |
| type | VARCHAR(100) | ❌ | 文章类型（如"文章"、"案例分析"） |
| brand | VARCHAR(100) | ❌ | 相关品牌（如"Netflix"） |
| category | VARCHAR(100) | ❌ | 分类（如"趋势分析"） |
| publish_date | TIMESTAMP | ❌ | 发布日期 |
| source | VARCHAR(255) | ❌ | 信息来源 |
| source_url | TEXT | ❌ | 原文链接 |
| image | TEXT | ❌ | 封面图片 URL |
| created_at | TIMESTAMP | ✅ | 创建时间，自动设置 |
| updated_at | TIMESTAMP | ✅ | 更新时间，自动设置 |
| featured | BOOLEAN | ❌ | 是否精选推荐 |
| status | VARCHAR(50) | ✅ | 状态（draft/published/archived）|
| views_count | INTEGER | ✅ | 浏览次数 |
| likes_count | INTEGER | ✅ | 点赞次数 |
| author_id | UUID | ❌ | 作者用户 ID |

**索引：**
- category, brand, type（快速过滤）
- publish_date DESC（按时间排序）
- status, featured（发布状态）
- created_at DESC（创建时间）

**示例数据：**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "2026 年设计趋势预测",
  "summary": "深入分析即将改变设计行业的关键趋势",
  "content": "<h2>...</h2>",
  "type": "文章",
  "brand": "Netflix",
  "category": "趋势分析",
  "publish_date": "2026-08-10T00:00:00Z",
  "source": "Medium",
  "source_url": "https://medium.com/...",
  "image": "https://images.unsplash.com/...",
  "created_at": "2026-08-11T12:00:00Z",
  "featured": true,
  "status": "published",
  "views_count": 1234,
  "likes_count": 45
}
```

---

### tags（标签表）
存储所有可用的标签。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| name | VARCHAR(100) | ✅ | 标签名称（唯一） |
| slug | VARCHAR(100) | ✅ | URL 友好的标签（唯一） |
| description | TEXT | ❌ | 标签描述 |
| created_at | TIMESTAMP | ✅ | 创建时间 |

**示例数据：**
```json
{
  "name": "AI设计",
  "slug": "ai-design",
  "description": "与人工智能相关的设计"
}
```

---

### article_tags（文章-标签关联表）
实现文章和标签的多对多关系。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| article_id | UUID | ✅ | 文章 ID（外键） |
| tag_id | UUID | ✅ | 标签 ID（外键） |
| created_at | TIMESTAMP | ✅ | 创建时间 |

**约束：** (article_id, tag_id) 唯一

---

### categories（分类表）
文章分类管理。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| name | VARCHAR(100) | ✅ | 分类名称（唯一） |
| slug | VARCHAR(100) | ✅ | URL 友好的分类（唯一） |
| description | TEXT | ❌ | 分类描述 |
| color | VARCHAR(7) | ❌ | 十六进制颜色代码 |
| icon | VARCHAR(50) | ❌ | 图标类名或图标 ID |
| order_index | INTEGER | ✅ | 排序顺序 |
| created_at | TIMESTAMP | ✅ | 创建时间 |

**示例数据：**
```json
{
  "name": "趋势分析",
  "slug": "trends",
  "description": "设计趋势分析",
  "color": "#3B82F6",
  "icon": "TrendingUp",
  "order_index": 1
}
```

---

### brands（品牌表）
追踪的品牌信息。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| name | VARCHAR(100) | ✅ | 品牌名称（唯一） |
| description | TEXT | ❌ | 品牌描述 |
| logo_url | TEXT | ❌ | 品牌 logo URL |
| website_url | TEXT | ❌ | 品牌官网 URL |
| created_at | TIMESTAMP | ✅ | 创建时间 |

---

### article_types（文章类型表）
文章类型的预定义列表。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| name | VARCHAR(100) | ✅ | 类型名称（唯一） |
| description | TEXT | ❌ | 类型描述 |
| color | VARCHAR(7) | ❌ | 十六进制颜色代码 |
| icon | VARCHAR(50) | ❌ | 图标类名 |
| created_at | TIMESTAMP | ✅ | 创建时间 |

---

### users（用户表）
系统用户信息。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 用户唯一标识符 |
| email | VARCHAR(255) | ✅ | 邮箱（唯一） |
| username | VARCHAR(100) | ✅ | 用户名（唯一） |
| full_name | VARCHAR(255) | ❌ | 真实名字 |
| avatar_url | TEXT | ❌ | 头像 URL |
| bio | TEXT | ❌ | 个人简介 |
| created_at | TIMESTAMP | ✅ | 注册时间 |
| updated_at | TIMESTAMP | ✅ | 更新时间 |

---

### comments（评论表）
文章评论。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| article_id | UUID | ✅ | 文章 ID（外键） |
| user_id | UUID | ❌ | 用户 ID（外键） |
| content | TEXT | ✅ | 评论内容 |
| status | VARCHAR(50) | ✅ | 状态（pending/approved/rejected）|
| created_at | TIMESTAMP | ✅ | 创建时间 |
| updated_at | TIMESTAMP | ✅ | 更新时间 |

**索引：** article_id, user_id, status

---

### likes（点赞表）
用户对文章的点赞。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| article_id | UUID | ✅ | 文章 ID（外键） |
| user_id | UUID | ❌ | 用户 ID（外键） |
| created_at | TIMESTAMP | ✅ | 点赞时间 |

**约束：** (article_id, user_id) 唯一

---

### bookmarks（收藏表）
用户的文章收藏。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | ✅ | 唯一标识符 |
| article_id | UUID | ✅ | 文章 ID（外键） |
| user_id | UUID | ❌ | 用户 ID（外键） |
| created_at | TIMESTAMP | ✅ | 收藏时间 |

**约束：** (article_id, user_id) 唯一

---

## 🔐 行级安全性（RLS）策略

### Articles
```sql
-- 已发布的文章所有人可读
SELECT: status = 'published' OR auth.uid() = author_id

-- 登录用户可创建文章
INSERT: auth.uid() = author_id

-- 作者可编辑/删除自己的文章
UPDATE/DELETE: auth.uid() = author_id
```

### Comments
```sql
-- 已批准的评论所有人可读
SELECT: status = 'approved' OR auth.uid() = user_id

-- 登录用户可创建评论
INSERT: auth.uid() = user_id
```

### Likes & Bookmarks
```sql
-- 用户只能管理自己的数据
SELECT/INSERT/DELETE: auth.uid() = user_id
```

---

## 📈 常见查询示例

### 获取首页的文章
```sql
SELECT * FROM articles
WHERE status = 'published'
ORDER BY featured DESC, publish_date DESC
LIMIT 10;
```

### 获取特定分类的文章
```sql
SELECT * FROM articles
WHERE status = 'published' AND category = '趋势分析'
ORDER BY publish_date DESC
LIMIT 20;
```

### 获取文章及其标签
```sql
SELECT 
  a.id,
  a.title,
  a.summary,
  ARRAY_AGG(t.name) as tags
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id, a.title, a.summary;
```

### 获取最受欢迎的文章
```sql
SELECT * FROM articles
WHERE status = 'published'
ORDER BY likes_count DESC, views_count DESC
LIMIT 10;
```

### 统计各分类的文章数
```sql
SELECT 
  category,
  COUNT(*) as count,
  SUM(views_count) as total_views
FROM articles
WHERE status = 'published'
GROUP BY category
ORDER BY count DESC;
```

---

## 🔄 关系图

```
articles
├── article_tags (多对多)
│   └── tags
├── categories
├── brands
├── article_types
└── users (author_id)

comments
├── articles
└── users

likes
├── articles
└── users

bookmarks
├── articles
└── users
```

---

## 📝 数据导入

### 导入 CSV 数据
1. 在 Supabase 控制面板中选择表
2. 点击 "Import data"
3. 上传 CSV 文件
4. 映射字段并导入

### 使用 API 批量插入
```javascript
const { data, error } = await supabase
  .from('articles')
  .insert([
    { title: '文章1', status: 'published' },
    { title: '文章2', status: 'published' },
    // ...
  ])
```

---

## 🚀 性能优化建议

1. **使用分页**：避免一次加载过多数据
2. **合理使用索引**：已创建关键字段的索引
3. **缓存热数据**：使用 Redis 或客户端缓存
4. **异步操作**：后台更新统计数据
5. **监控查询**：定期检查慢查询

---

## 📚 相关文件

- `supabase/migrations/001_create_tables.sql` - SQL 迁移文件
- `app/lib/supabase.ts` - Supabase 客户端配置
- `app/lib/database.ts` - 数据库操作函数库
