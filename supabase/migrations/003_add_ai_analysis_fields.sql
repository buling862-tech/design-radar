-- Design Radar AI 分析字段迁移脚本
-- 为 articles 表添加 AI 分析相关字段

-- 添加 AI 分析字段
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS focus_points TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS inspiration_points TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS is_design_trend BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS is_competitor_tracking BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS source VARCHAR(100);
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS source_url TEXT;

-- 创建索引用于快速查询
CREATE INDEX IF NOT EXISTS idx_articles_is_design_trend ON articles(is_design_trend);
CREATE INDEX IF NOT EXISTS idx_articles_is_competitor_tracking ON articles(is_competitor_tracking);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_source_url ON articles(source_url);

-- 添加注释说明
COMMENT ON COLUMN articles.focus_points IS 'AI 分析的设计关注点数组';
COMMENT ON COLUMN articles.inspiration_points IS 'AI 分析的设计启发数组';
COMMENT ON COLUMN articles.is_design_trend IS 'AI 标记：是否属于设计趋势';
COMMENT ON COLUMN articles.is_competitor_tracking IS 'AI 标记：是否属于竞品追踪';
COMMENT ON COLUMN articles.source IS '内容源（Figma Blog, Dezeen 等）';
COMMENT ON COLUMN articles.source_url IS '原始内容链接';

-- 创建视图：设计趋势
CREATE OR REPLACE VIEW articles_design_trends AS
SELECT 
  id,
  title,
  description,
  image_url,
  focus_points,
  inspiration_points,
  source,
  source_url,
  published_date,
  created_at
FROM articles
WHERE is_design_trend = true
  AND status = 'published'
ORDER BY published_date DESC;

-- 创建视图：竞品追踪
CREATE OR REPLACE VIEW articles_competitor_tracking AS
SELECT 
  id,
  title,
  description,
  image_url,
  focus_points,
  inspiration_points,
  source,
  source_url,
  published_date,
  created_at
FROM articles
WHERE is_competitor_tracking = true
  AND status = 'published'
ORDER BY published_date DESC;

-- 创建视图：按源分类
CREATE OR REPLACE VIEW articles_by_source AS
SELECT 
  source,
  COUNT(*) as total_articles,
  SUM(CASE WHEN is_design_trend THEN 1 ELSE 0 END) as trend_articles,
  SUM(CASE WHEN is_competitor_tracking THEN 1 ELSE 0 END) as competitor_articles,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_articles
FROM articles
WHERE source IS NOT NULL
GROUP BY source
ORDER BY total_articles DESC;

-- 创建函数：获取文章完整信息（包括标签）
CREATE OR REPLACE FUNCTION get_article_with_tags(article_id UUID)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  content TEXT,
  image_url TEXT,
  focus_points TEXT[],
  inspiration_points TEXT[],
  is_design_trend BOOLEAN,
  is_competitor_tracking BOOLEAN,
  source VARCHAR,
  source_url TEXT,
  tags TEXT[]
) AS $$
SELECT 
  a.id,
  a.title,
  a.description,
  a.content,
  a.image_url,
  a.focus_points,
  a.inspiration_points,
  a.is_design_trend,
  a.is_competitor_tracking,
  a.source,
  a.source_url,
  COALESCE(ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') as tags
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.id = article_id
GROUP BY a.id, a.title, a.description, a.content, 
         a.image_url, a.focus_points, a.inspiration_points, 
         a.is_design_trend, a.is_competitor_tracking, 
         a.source, a.source_url;
$$ LANGUAGE SQL;

-- 创建函数：获取设计趋势列表
CREATE OR REPLACE FUNCTION get_design_trends(limit_count INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  image_url TEXT,
  focus_points TEXT[],
  source VARCHAR,
  published_date TIMESTAMP
) AS $$
SELECT 
  id,
  title,
  description,
  image_url,
  focus_points,
  source,
  published_date
FROM articles
WHERE is_design_trend = true
  AND status = 'published'
ORDER BY published_date DESC
LIMIT limit_count;
$$ LANGUAGE SQL;

-- 创建函数：获取竞品追踪列表
CREATE OR REPLACE FUNCTION get_competitor_tracking(limit_count INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  image_url TEXT,
  inspiration_points TEXT[],
  source VARCHAR,
  published_date TIMESTAMP
) AS $$
SELECT 
  id,
  title,
  description,
  image_url,
  inspiration_points,
  source,
  published_date
FROM articles
WHERE is_competitor_tracking = true
  AND status = 'published'
ORDER BY published_date DESC
LIMIT limit_count;
$$ LANGUAGE SQL;

-- 为新字段启用 RLS（行级安全）
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 更新现有 RLS 策略以支持新字段
-- 已发布文章所有人可读
DROP POLICY IF EXISTS "Publicly readable published articles" ON articles;
CREATE POLICY "Publicly readable published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- 草稿和已发布文章创建者可编辑
DROP POLICY IF EXISTS "Articles can be updated by owner" ON articles;
CREATE POLICY "Articles can be updated by owner"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id);

-- 插入权限
DROP POLICY IF EXISTS "Articles can be inserted by authenticated users" ON articles;
CREATE POLICY "Articles can be inserted by authenticated users"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- 添加初始数据示例
-- 注意：如果表中已有数据，这个 UPDATE 可能会执行
-- 如果是新安装，这些记录应该通过采集器创建

-- 完成迁移
SELECT 'AI Analysis Fields Migration Complete'::TEXT as status;
