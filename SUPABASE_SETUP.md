# Supabase 数据库设置指南

## 快速开始

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "New Project"
3. 选择组织和项目名称（建议：design-radar）
4. 设置数据库密码（保管好！）
5. 选择区域（建议选择离你最近的区域）
6. 等待项目创建完成

### 2. 获取 API 密钥

创建完成后，进入项目：
1. 点击 "Settings"（左侧菜单）
2. 选择 "API"
3. 复制下面的值：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_KEY`（服务端使用）

### 3. 更新环境变量

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## 创建数据库表

### 方式一：使用 SQL Editor（推荐）

1. 在 Supabase 控制面板中，点击 "SQL Editor"
2. 点击 "New Query"
3. 将 `supabase/migrations/001_create_tables.sql` 中的 SQL 复制到编辑器
4. 点击 "Run"
5. 等待执行完成

### 方式二：使用 Supabase CLI

如果已安装 Supabase CLI：

```bash
supabase start
supabase db push
```

## 数据库架构

### 核心表

#### articles（文章表）
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY,           -- 唯一 ID
  title VARCHAR(255) NOT NULL,   -- 文章标题
  summary TEXT,                   -- 文章摘要
  content TEXT,                   -- 文章内容
  type VARCHAR(100),              -- 文章类型
  brand VARCHAR(100),             -- 品牌
  category VARCHAR(100),          -- 分类
  publish_date TIMESTAMP,         -- 发布日期
  source VARCHAR(255),            -- 信息源
  source_url TEXT,                -- 信息源链接
  image TEXT,                     -- 封面图片 URL
  created_at TIMESTAMP,           -- 创建时间
  updated_at TIMESTAMP,           -- 更新时间
  featured BOOLEAN,               -- 是否精选
  status VARCHAR(50),             -- 状态（draft, published, archived）
  views_count INTEGER,            -- 浏览次数
  likes_count INTEGER,            -- 点赞次数
  author_id UUID                  -- 作者 ID
);
```

#### tags（标签表）
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,  -- 标签名
  slug VARCHAR(100) UNIQUE NOT NULL,  -- URL 友好的标签
  description TEXT,                    -- 标签描述
  created_at TIMESTAMP
);
```

#### article_tags（文章-标签关联表）
```sql
CREATE TABLE article_tags (
  id UUID PRIMARY KEY,
  article_id UUID,         -- 文章 ID
  tag_id UUID,             -- 标签 ID
  created_at TIMESTAMP,
  UNIQUE(article_id, tag_id)
);
```

#### categories（分类表）
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7),        -- 十六进制颜色
  icon VARCHAR(50),        -- 图标类名
  order_index INTEGER,     -- 排序
  created_at TIMESTAMP
);
```

#### brands（品牌表）
```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP
);
```

#### article_types（文章类型表）
```sql
CREATE TABLE article_types (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMP
);
```

#### users（用户表）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### comments（评论表）
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  article_id UUID,         -- 关联文章
  user_id UUID,            -- 评论用户
  content TEXT NOT NULL,   -- 评论内容
  status VARCHAR(50),      -- 状态（pending, approved, rejected）
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### likes（点赞表）
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY,
  article_id UUID,         -- 被点赞的文章
  user_id UUID,            -- 点赞用户
  created_at TIMESTAMP
);
```

#### bookmarks（收藏表）
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  article_id UUID,
  user_id UUID,
  created_at TIMESTAMP
);
```

## 行级安全性 (RLS)

数据库已启用 RLS 进行安全性保护：

- **Articles**: 已发布的文章所有人可读，登录用户可创建，作者可编辑
- **Tags**: 所有人可读
- **Comments**: 已批准的评论所有人可读，用户只能创建自己的评论
- **Likes**: 所有人可读，用户可管理自己的点赞
- **Bookmarks**: 用户只能访问和管理自己的收藏

## 初始化数据

创建示例数据来测试系统：

```sql
-- 插入分类
INSERT INTO categories (name, slug, description, color, icon, order_index)
VALUES
  ('趋势分析', 'trends', '设计趋势分析', '#3B82F6', 'TrendingUp', 1),
  ('竞品追踪', 'competitors', '竞品设计分析', '#F59E0B', 'Target', 2),
  ('设计指南', 'guide', '设计最佳实践', '#10B981', 'BookOpen', 3),
  ('实战教程', 'tutorial', '实战设计教程', '#8B5CF6', 'Code', 4);

-- 插入文章类型
INSERT INTO article_types (name, description, color, icon)
VALUES
  ('文章', '普通文章', '#3B82F6', 'FileText'),
  ('案例分析', '设计案例分析', '#F59E0B', 'Briefcase'),
  ('工具推荐', '设计工具推荐', '#10B981', 'Wrench');

-- 插入品牌
INSERT INTO brands (name, description, logo_url, website_url)
VALUES
  ('Netflix', '流媒体平台', 'https://...', 'https://netflix.com'),
  ('Spotify', '音乐流媒体', 'https://...', 'https://spotify.com'),
  ('Apple', '科技公司', 'https://...', 'https://apple.com');

-- 插入标签
INSERT INTO tags (name, slug, description)
VALUES
  ('AI设计', 'ai-design', '与人工智能相关的设计'),
  ('UI设计', 'ui-design', '用户界面设计'),
  ('UX设计', 'ux-design', '用户体验设计'),
  ('动效', 'animation', '动画效果');
```

## 常见操作

### 查询已发布的文章
```sql
SELECT * FROM articles
WHERE status = 'published'
ORDER BY publish_date DESC
LIMIT 10;
```

### 获取文章及其标签
```sql
SELECT 
  a.*,
  ARRAY_AGG(t.name) as tags
FROM articles a
LEFT JOIN article_tags art ON a.id = art.article_id
LEFT JOIN tags t ON art.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id
ORDER BY a.publish_date DESC;
```

### 统计文章浏览量
```sql
SELECT 
  category,
  COUNT(*) as total,
  SUM(views_count) as total_views
FROM articles
WHERE status = 'published'
GROUP BY category;
```

## 连接字符串

### 直接连接（开发环境）
```
postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```

### 使用环境变量连接（应用）
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

## 备份和恢复

### 自动备份
Supabase 会自动备份你的数据库。在 Supabase 控制面板中：
1. 进入 "Settings"
2. 选择 "Backups"
3. 查看备份历史

### 手动备份
```bash
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

## 性能优化

### 创建的索引
- articles 表有 7 个索引
- comments、likes、bookmarks 表有相关索引
- 确保常见查询的高效性

### 查询优化建议
1. 使用 `SELECT` 时明确指定需要的列
2. 使用适当的 WHERE 条件
3. 合理使用 LIMIT 和 OFFSET
4. 考虑使用 `EXPLAIN ANALYZE` 优化复杂查询

## 故障排除

### Q: 无法连接到数据库？
A: 检查 API 密钥是否正确，确保网络连接正常，查看 Supabase 控制面板的状态。

### Q: RLS 策略导致查询失败？
A: 检查当前用户是否有权限访问数据，查看 RLS 策略是否配置正确。

### Q: 性能下降？
A: 检查数据库大小，考虑添加更多索引或分区大表。

## 进阶功能

### 实时订阅
```javascript
const subscription = supabase
  .from('articles')
  .on('*', payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### 数据库函数
可以创建 PostgreSQL 函数来执行复杂操作：
```sql
CREATE OR REPLACE FUNCTION get_trending_articles()
RETURNS TABLE (id UUID, title VARCHAR, likes_count INTEGER) AS $$
SELECT id, title, likes_count
FROM articles
WHERE status = 'published'
ORDER BY likes_count DESC
LIMIT 10;
$$ LANGUAGE SQL;
```

### 触发器
自动更新 `updated_at` 字段：
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 相关链接

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [行级安全性详解](https://supabase.com/docs/guides/auth/row-level-security)
