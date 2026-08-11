# 数据库快速设置指南

## 📋 5分钟快速开始

### 第一步：创建 Supabase 项目（1分钟）

1. 访问 [supabase.com](https://supabase.com)
2. 点击 **"New Project"**
3. 填写项目信息：
   - Project Name: `design-radar`
   - Password: 自定义（记住它！）
   - Region: 选择离你最近的地区
4. 点击 **"Create new project"**，等待 ~2 分钟创建完成

### 第二步：获取 API 密钥（1分钟）

项目创建后：

1. 点击左侧 **"Settings"** → **"API"**
2. 复制以下密钥：

```
NEXT_PUBLIC_SUPABASE_URL = https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [anon-key]
SUPABASE_SERVICE_KEY = [service_role-key]
```

### 第三步：更新环境变量（30秒）

编辑 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 第四步：创建数据库表（2分钟）

#### 方式 A：使用 SQL Editor（最简单）

1. 在 Supabase 控制面板，点击左侧 **"SQL Editor"**
2. 点击 **"New Query"**
3. 复制下面的 SQL 代码到编辑器中
4. 点击 **"Run"** 按钮
5. 等待执行完成 ✅

#### 方式 B：导入 SQL 文件

1. 点击 **"SQL Editor"** → **"New Query"**
2. 打开文件 `supabase/migrations/001_create_tables.sql`
3. 复制所有内容到编辑器
4. 点击 **"Run"**

---

## 📝 完整的 SQL 建表脚本

```sql
-- 创建 articles 表（核心表）
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT,
  type VARCHAR(100),
  brand VARCHAR(100),
  category VARCHAR(100),
  publish_date TIMESTAMP WITH TIME ZONE,
  source VARCHAR(255),
  source_url TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'draft',
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  author_id UUID
);

-- 创建索引
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_brand ON articles(brand);
CREATE INDEX idx_articles_type ON articles(type);
CREATE INDEX idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

-- 创建 tags 表
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 article_tags 表
CREATE TABLE IF NOT EXISTS article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(article_id, tag_id)
);

CREATE INDEX idx_article_tags_article ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);

-- 创建 categories 表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 brands 表
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 article_types 表
CREATE TABLE IF NOT EXISTS article_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 comments 表
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_status ON comments(status);

-- 创建 likes 表
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(article_id, user_id)
);

CREATE INDEX idx_likes_article ON likes(article_id);
CREATE INDEX idx_likes_user ON likes(user_id);

-- 创建 bookmarks 表
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(article_id, user_id)
);

CREATE INDEX idx_bookmarks_article ON bookmarks(article_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

-- 启用 RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
```

---

## ✅ 验证数据库创建

运行以下查询确认表已创建：

```sql
-- 查看所有表
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 查看 articles 表结构
\d articles

-- 验证索引
SELECT indexname FROM pg_indexes WHERE tablename = 'articles';
```

---

## 📥 插入示例数据

```sql
-- 插入分类
INSERT INTO categories (name, slug, description, color, icon, order_index) VALUES
  ('趋势分析', 'trends', '设计趋势分析', '#3B82F6', 'TrendingUp', 1),
  ('竞品追踪', 'competitors', '竞品分析', '#F59E0B', 'Target', 2),
  ('设计指南', 'guide', '最佳实践', '#10B981', 'BookOpen', 3),
  ('实战教程', 'tutorial', '实战教程', '#8B5CF6', 'Code', 4);

-- 插入文章类型
INSERT INTO article_types (name, description, color, icon) VALUES
  ('文章', '普通文章', '#3B82F6', 'FileText'),
  ('案例分析', '案例分析', '#F59E0B', 'Briefcase'),
  ('工具推荐', '工具推荐', '#10B981', 'Wrench');

-- 插入品牌
INSERT INTO brands (name, description, logo_url, website_url) VALUES
  ('Netflix', '流媒体平台', 'https://...', 'https://netflix.com'),
  ('Spotify', '音乐流媒体', 'https://...', 'https://spotify.com');

-- 插入标签
INSERT INTO tags (name, slug, description) VALUES
  ('AI设计', 'ai-design', 'AI相关的设计'),
  ('UI设计', 'ui-design', '用户界面设计'),
  ('UX设计', 'ux-design', '用户体验设计'),
  ('动效', 'animation', '动画效果');

-- 插入示例文章
INSERT INTO articles (title, summary, content, category, type, status, featured, publish_date)
VALUES (
  '2026年设计趋势预测',
  '深入分析即将改变设计行业的关键趋势',
  '<h2>设计行业的未来已经到来</h2><p>...</p>',
  '趋势分析',
  '文章',
  'published',
  true,
  now()
);
```

---

## 🔗 在前端代码中使用

### 基本查询

```typescript
import { getArticles, getArticleById } from '@/app/lib/database'

// 获取所有文章
const { data: articles } = await getArticles({
  status: 'published',
  limit: 10,
  sort: 'newest'
})

// 获取特定文章
const { data: article } = await getArticleById(articleId)
```

### 创建文章

```typescript
import { createArticle } from '@/app/lib/database'

const { data: newArticle, error } = await createArticle({
  title: '新文章',
  summary: '摘要',
  content: '内容',
  category: '趋势分析',
  status: 'draft'
})
```

### 查询特定分类

```typescript
const { data: trends } = await getArticles({
  category: '趋势分析',
  status: 'published'
})
```

---

## 🐛 常见问题

### Q: 无法连接到数据库？
A: 检查 `.env.local` 中的 API URL 和密钥是否正确。

### Q: 权限错误？
A: 检查 RLS 策略是否正确配置。对于开发环境，可以暂时禁用 RLS：
```sql
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
```

### Q: 表已存在错误？
A: 使用 `DROP TABLE IF EXISTS` 删除表后重新创建，或检查是否重复执行 SQL。

---

## 📊 完整的表说明

| 表 | 说明 | 记录数 |
|----|------|--------|
| articles | 文章内容 | 主表 |
| tags | 标签 | 参考表 |
| article_tags | 文章-标签关联 | 关联表 |
| categories | 文章分类 | 参考表 |
| brands | 品牌 | 参考表 |
| article_types | 文章类型 | 参考表 |
| users | 用户 | 用户表 |
| comments | 评论 | 交互表 |
| likes | 点赞 | 交互表 |
| bookmarks | 收藏 | 交互表 |

---

## 📚 下一步

- 查看 `DATABASE_SCHEMA.md` 了解详细的表结构
- 查看 `SUPABASE_SETUP.md` 了解高级配置
- 使用 `app/lib/database.ts` 中的函数来操作数据

准备就绪？现在可以开始开发了！ 🚀
