# Design Radar 数据库表完整总结

## 📊 数据模型图

```
┌─────────────────────────────────────────────────────────────┐
│                       数据库结构概览                          │
└─────────────────────────────────────────────────────────────┘

核心表：
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  articles    │◄─────│article_tags  │─────►│     tags     │
│  (文章内容)  │      │  (关联表)    │      │   (标签)     │
└──────────────┘      └──────────────┘      └──────────────┘
       ▲                                            
       │                                            
       ├─► categories (分类)                       
       ├─► brands (品牌)                          
       └─► article_types (文章类型)               

交互表：
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   comments   │      │    likes     │      │  bookmarks   │
│   (评论)     │      │  (点赞)      │      │  (收藏)      │
└──────────────┘      └──────────────┘      └──────────────┘
       ▲                   ▲                      ▲
       │                   │                      │
       └───────────────────┼──────────────────────┘
                           │
                    ┌──────────────┐
                    │    users     │
                    │   (用户)     │
                    └──────────────┘
```

---

## 📋 10张表详细对照表

### 1️⃣ articles（文章表）- 核心表

| 字段 | 类型 | 必填 | 说明 | 外键 |
|------|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID | - |
| **title** | VARCHAR(255) | ✅ | 文章标题 | - |
| **summary** | TEXT | ❌ | 文章摘要 | - |
| **content** | TEXT | ❌ | 完整内容 | - |
| **type** | VARCHAR(100) | ❌ | 文章类型 | ⚠️ 需关联 article_types |
| **brand** | VARCHAR(100) | ❌ | 品牌 | ⚠️ 需关联 brands |
| **category** | VARCHAR(100) | ❌ | 分类 | ⚠️ 需关联 categories |
| **publish_date** | TIMESTAMP | ❌ | 发布日期 | - |
| **source** | VARCHAR(255) | ❌ | 来源 | - |
| **source_url** | TEXT | ❌ | 原文链接 | - |
| **image** | TEXT | ❌ | 封面图片 | - |
| **created_at** | TIMESTAMP | ✅ | 创建时间 | - |
| **updated_at** | TIMESTAMP | ✅ | 更新时间 | - |
| **featured** | BOOLEAN | ✅ | 精选标记 | - |
| **status** | VARCHAR(50) | ✅ | 发布状态 | - |
| **views_count** | INTEGER | ✅ | 浏览次数 | - |
| **likes_count** | INTEGER | ✅ | 点赞次数 | - |
| **author_id** | UUID | ❌ | 作者ID | ➡️ users |

---

### 2️⃣ tags（标签表）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID |
| **name** | VARCHAR(100) | ✅ | 标签名称（唯一） |
| **slug** | VARCHAR(100) | ✅ | URL友好标签（唯一） |
| **description** | TEXT | ❌ | 标签描述 |
| **created_at** | TIMESTAMP | ✅ | 创建时间 |

**示例数据：**
- AI设计 / ai-design
- UI设计 / ui-design
- 动效设计 / animation-design

---

### 3️⃣ article_tags（关联表）- 多对多

| 字段 | 类型 | 必填 | 说明 | 外键 |
|------|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID | - |
| **article_id** | UUID | ✅ | 文章ID | ➡️ articles |
| **tag_id** | UUID | ✅ | 标签ID | ➡️ tags |
| **created_at** | TIMESTAMP | ✅ | 创建时间 | - |

**约束：** UNIQUE(article_id, tag_id) - 防止重复关联

**用途：** 连接 articles 和 tags 的多对多关系

---

### 4️⃣ categories（分类表）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID |
| **name** | VARCHAR(100) | ✅ | 分类名称（唯一） |
| **slug** | VARCHAR(100) | ✅ | URL友好分类（唯一） |
| **description** | TEXT | ❌ | 分类描述 |
| **color** | VARCHAR(7) | ❌ | 十六进制颜色 |
| **icon** | VARCHAR(50) | ❌ | 图标类名 |
| **order_index** | INTEGER | ✅ | 排序顺序 |
| **created_at** | TIMESTAMP | ✅ | 创建时间 |

**示例数据：**
- 趋势分析 / trends / #3B82F6
- 竞品追踪 / competitors / #F59E0B
- 设计指南 / guide / #10B981
- 实战教程 / tutorial / #8B5CF6

---

### 5️⃣ brands（品牌表）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID |
| **name** | VARCHAR(100) | ✅ | 品牌名称（唯一） |
| **description** | TEXT | ❌ | 品牌描述 |
| **logo_url** | TEXT | ❌ | 品牌logo URL |
| **website_url** | TEXT | ❌ | 品牌官网URL |
| **created_at** | TIMESTAMP | ✅ | 创建时间 |

**示例数据：**
- Netflix
- Spotify
- Apple
- Google
- Meta
- Microsoft

---

### 6️⃣ article_types（文章类型表）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID |
| **name** | VARCHAR(100) | ✅ | 类型名称（唯一） |
| **description** | TEXT | ❌ | 类型描述 |
| **color** | VARCHAR(7) | ❌ | 十六进制颜色 |
| **icon** | VARCHAR(50) | ❌ | 图标类名 |
| **created_at** | TIMESTAMP | ✅ | 创建时间 |

**示例数据：**
- 文章 / FileText
- 案例分析 / Briefcase
- 工具推荐 / Wrench
- 周刊 / Calendar

---

### 7️⃣ users（用户表）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID |
| **email** | VARCHAR(255) | ✅ | 邮箱（唯一） |
| **username** | VARCHAR(100) | ✅ | 用户名（唯一） |
| **full_name** | VARCHAR(255) | ❌ | 真实名字 |
| **avatar_url** | TEXT | ❌ | 头像URL |
| **bio** | TEXT | ❌ | 个人简介 |
| **created_at** | TIMESTAMP | ✅ | 注册时间 |
| **updated_at** | TIMESTAMP | ✅ | 更新时间 |

---

### 8️⃣ comments（评论表）

| 字段 | 类型 | 必填 | 说明 | 外键 |
|------|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID | - |
| **article_id** | UUID | ✅ | 文章ID | ➡️ articles |
| **user_id** | UUID | ❌ | 用户ID | ➡️ users |
| **content** | TEXT | ✅ | 评论内容 | - |
| **status** | VARCHAR(50) | ✅ | 状态（pending/approved/rejected） | - |
| **created_at** | TIMESTAMP | ✅ | 创建时间 | - |
| **updated_at** | TIMESTAMP | ✅ | 更新时间 | - |

---

### 9️⃣ likes（点赞表）

| 字段 | 类型 | 必填 | 说明 | 外键 |
|------|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID | - |
| **article_id** | UUID | ✅ | 文章ID | ➡️ articles |
| **user_id** | UUID | ❌ | 用户ID | ➡️ users |
| **created_at** | TIMESTAMP | ✅ | 点赞时间 | - |

**约束：** UNIQUE(article_id, user_id) - 每个用户每篇文章只能点赞一次

---

### 🔟 bookmarks（收藏表）

| 字段 | 类型 | 必填 | 说明 | 外键 |
|------|------|------|------|------|
| **id** | UUID | ✅ | 唯一ID | - |
| **article_id** | UUID | ✅ | 文章ID | ➡️ articles |
| **user_id** | UUID | ❌ | 用户ID | ➡️ users |
| **created_at** | TIMESTAMP | ✅ | 收藏时间 | - |

**约束：** UNIQUE(article_id, user_id) - 每个用户每篇文章只能收藏一次

---

## 🔗 表间关系总结

```
articles (1) ────────────────── (M) article_tags (M) ────────────────── (1) tags
   │                                                                        │
   │ (1M)                                                                  │
   ├─► categories (通过 category 字段)                                    └─► tags
   │
   ├─► brands (通过 brand 字段)
   │
   ├─► article_types (通过 type 字段)
   │
   ├─► users (通过 author_id 外键)
   │
   ├─► comments (1M 通过 article_id 外键)
   │
   ├─► likes (1M 通过 article_id 外键)
   │
   └─► bookmarks (1M 通过 article_id 外键)

users (1) ────────────────── (M) comments
   │
   ├─► likes
   │
   └─► bookmarks
```

---

## 🎯 快速查询参考

### 获取文章及其所有关联数据
```sql
SELECT 
  a.*,
  c.name as category_name,
  b.name as brand_name,
  at.name as type_name,
  ARRAY_AGG(t.name) as tags
FROM articles a
LEFT JOIN categories c ON a.category = c.id::TEXT
LEFT JOIN brands b ON a.brand = b.id::TEXT
LEFT JOIN article_types at ON a.type = at.id::TEXT
LEFT JOIN article_tags artags ON a.id = artags.article_id
LEFT JOIN tags t ON artags.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id, c.name, b.name, at.name;
```

### 获取某个标签下的所有文章
```sql
SELECT a.*
FROM articles a
JOIN article_tags at ON a.id = at.article_id
JOIN tags t ON at.tag_id = t.id
WHERE t.slug = 'ai-design'
AND a.status = 'published'
ORDER BY a.publish_date DESC;
```

### 获取某篇文章的评论（已批准）
```sql
SELECT c.*, u.username, u.avatar_url
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.article_id = 'article-id'
AND c.status = 'approved'
ORDER BY c.created_at DESC;
```

### 获取某用户的收藏
```sql
SELECT a.*
FROM bookmarks b
JOIN articles a ON b.article_id = a.id
WHERE b.user_id = 'user-id'
ORDER BY b.created_at DESC;
```

---

## 📝 数据验证清单

- ✅ articles：articles.ts
- ✅ tags：TAGS_TABLE.md
- ✅ article_tags：ARTICLE_TAGS_TABLE.md
- ✅ categories：DATABASE_SCHEMA.md
- ✅ brands：DATABASE_SCHEMA.md
- ✅ article_types：DATABASE_SCHEMA.md
- ✅ users：DATABASE_SCHEMA.md
- ✅ comments：DATABASE_SCHEMA.md
- ✅ likes：DATABASE_SCHEMA.md
- ✅ bookmarks：DATABASE_SCHEMA.md

---

## 🚀 下一步

1. **创建表**：在 Supabase 中运行 `001_create_tables.sql`
2. **插入数据**：运行 `002_insert_sample_data.sql`
3. **验证完整性**：确保所有表都已创建且数据正确
4. **集成应用**：使用 `app/lib/database.ts` 中的函数操作数据库

所有文档已完成！现在你有了一个完整的、生产级别的数据库设计。🎉
