-- ==================== 插入示例分类 ====================
INSERT INTO categories (name, slug, description, color, icon, order_index) VALUES
  ('趋势分析', 'trends', '最新的设计趋势分析和预测', '#3B82F6', 'TrendingUp', 1),
  ('竞品追踪', 'competitors', '竞品设计分析和对标', '#F59E0B', 'Target', 2),
  ('设计指南', 'guide', '设计最佳实践和指南', '#10B981', 'BookOpen', 3),
  ('实战教程', 'tutorial', '实战项目和设计教程', '#8B5CF6', 'Code', 4)
ON CONFLICT DO NOTHING;

-- ==================== 插入示例文章类型 ====================
INSERT INTO article_types (name, description, color, icon) VALUES
  ('文章', '普通设计文章', '#3B82F6', 'FileText'),
  ('案例分析', '设计案例深度分析', '#F59E0B', 'Briefcase'),
  ('工具推荐', '设计工具推荐', '#10B981', 'Wrench'),
  ('周刊', '设计周刊总结', '#8B5CF6', 'Calendar')
ON CONFLICT DO NOTHING;

-- ==================== 插入示例品牌 ====================
INSERT INTO brands (name, description, logo_url, website_url) VALUES
  ('Netflix', '全球领先的流媒体平台', 'https://www.netflix.com/logo.png', 'https://netflix.com'),
  ('Spotify', '音乐流媒体和播客平台', 'https://www.spotify.com/logo.png', 'https://spotify.com'),
  ('Apple', '科技和消费电子产品公司', 'https://www.apple.com/logo.png', 'https://apple.com'),
  ('Google', '搜索引擎和科技公司', 'https://www.google.com/logo.png', 'https://google.com'),
  ('Meta', '社交媒体和元宇宙公司', 'https://www.meta.com/logo.png', 'https://meta.com'),
  ('Microsoft', '软件和云计算公司', 'https://www.microsoft.com/logo.png', 'https://microsoft.com')
ON CONFLICT DO NOTHING;

-- ==================== 插入示例标签 ====================
INSERT INTO tags (name, slug, description) VALUES
  ('AI设计', 'ai-design', '人工智能在设计中的应用和实践'),
  ('UI设计', 'ui-design', '用户界面设计和可视化'),
  ('UX设计', 'ux-design', '用户体验设计和研究'),
  ('动效设计', 'animation-design', '交互动画和过渡效果'),
  ('深色模式', 'dark-mode', '深色主题的设计实现'),
  ('响应式设计', 'responsive-design', '响应式布局和自适应设计'),
  ('可访问性', 'accessibility', '无障碍设计和包容性'),
  ('设计系统', 'design-system', '组件库和设计系统构建'),
  ('品牌设计', 'brand-design', '品牌识别和视觉系统'),
  ('Web3设计', 'web3-design', 'Web3和去中心化应用设计'),
  ('移动应用', 'mobile-app', '移动应用UI和UX设计'),
  ('平面设计', 'graphic-design', '平面设计和排版'),
  ('2026趋势', '2026-trends', '2026年的设计趋势预测'),
  ('流媒体', 'streaming', '流媒体平台设计'),
  ('最佳实践', 'best-practices', '设计最佳实践和规范'),
  ('交互设计', 'interaction-design', '交互设计和用户研究'),
  ('排版', 'typography', '字体和排版设计'),
  ('颜色理论', 'color-theory', '颜色和调色板设计')
ON CONFLICT DO NOTHING;

-- ==================== 插入示例文章 ====================
INSERT INTO articles (
  title, summary, content, category, type, brand, status, featured, publish_date, 
  source, source_url, image, views_count, likes_count
) VALUES
  (
    '2026 年设计趋势预测：从AI到Web3',
    '深入分析即将改变设计行业的关键趋势，包括AI辅助设计、沉浸式体验和可持续设计。',
    '<h2>设计行业的未来已经到来</h2><p>2026年将成为设计行业的转折点。从人工智能辅助设计工具的普及，到Web3带来的新型交互方式，再到沉浸式体验的兴起，设计师们需要做好迎接变化的准备。</p>',
    '趋势分析',
    '文章',
    'Netflix',
    'published',
    true,
    '2026-08-10T00:00:00Z',
    'Design Radar',
    'https://designradar.com/articles/1',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    1234,
    45
  ),
  (
    'Netflix UI 的进化史：竞品分析',
    '从早期设计到现在的完整演变，深入了解如何通过 UI 改进提升用户体验。',
    '<h2>Netflix 用户界面的创新之旅</h2><p>Netflix 的 UI 设计一直是流媒体行业的标杆...</p>',
    '竞品追踪',
    '案例分析',
    'Netflix',
    'published',
    true,
    '2026-08-09T00:00:00Z',
    'Design Radar',
    'https://designradar.com/articles/2',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    856,
    32
  ),
  (
    '深色模式设计完全指南',
    '从技术实现到用户体验，全面指南帮助设计师创建完美的深色主题。',
    '<h2>为什么深色模式如此重要</h2><p>深色模式不仅是美学选择，更是用户体验的必需品...</p>',
    '设计指南',
    '文章',
    'Apple',
    'published',
    false,
    '2026-08-08T00:00:00Z',
    'Design Radar',
    'https://designradar.com/articles/3',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    2341,
    78
  ),
  (
    'AI 辅助设计工具大盘点',
    '2026年最值得关注的AI设计工具综合评测。',
    '<h2>AI如何改变设计工作流程</h2><p>人工智能正在重新定义设计师的工作方式...</p>',
    '趋势分析',
    '工具推荐',
    'Google',
    'published',
    false,
    '2026-08-07T00:00:00Z',
    'Design Radar',
    'https://designradar.com/articles/4',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    1567,
    52
  ),
  (
    '设计系统实战：从零到一',
    '学习如何构建一个可扩展的设计系统，提高团队协作效率。',
    '<h2>设计系统的重要性</h2><p>一个良好的设计系统是现代设计团队的基础...</p>',
    '实战教程',
    '文章',
    'Meta',
    'published',
    false,
    '2026-08-06T00:00:00Z',
    'Design Radar',
    'https://designradar.com/articles/5',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    945,
    38
  ),
  (
    '动效设计最佳实践',
    '优秀的动效设计如何增强用户体验，包括具体案例和技术实现。',
    '<h2>动效的力量</h2><p>精妙的动效设计可以显著提升用户的感知质量...</p>',
    '设计指南',
    '文章',
    'Spotify',
    'published',
    false,
    '2026-08-05T00:00:00Z',
    'Design Radar',
    'https://designradar.com/articles/6',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    678,
    25
  )
ON CONFLICT DO NOTHING;

-- ==================== 关联文章和标签 ====================
-- 第一篇文章的标签
INSERT INTO article_tags (article_id, tag_id) 
SELECT a.id, t.id FROM articles a, tags t 
WHERE a.title = '2026 年设计趋势预测：从AI到Web3' 
AND t.slug IN ('ai-design', '2026趋势', 'web3-design')
ON CONFLICT DO NOTHING;

-- 第二篇文章的标签
INSERT INTO article_tags (article_id, tag_id) 
SELECT a.id, t.id FROM articles a, tags t 
WHERE a.title = 'Netflix UI 的进化史：竞品分析' 
AND t.slug IN ('ui-design', 'best-practices', '流媒体')
ON CONFLICT DO NOTHING;

-- 第三篇文章的标签
INSERT INTO article_tags (article_id, tag_id) 
SELECT a.id, t.id FROM articles a, tags t 
WHERE a.title = '深色模式设计完全指南' 
AND t.slug IN ('deep-dark-mode', 'ui-design', 'best-practices')
ON CONFLICT DO NOTHING;

-- 第四篇文章的标签
INSERT INTO article_tags (article_id, tag_id) 
SELECT a.id, t.id FROM articles a, tags t 
WHERE a.title = 'AI 辅助设计工具大盘点' 
AND t.slug IN ('ai-design', 'tool-review')
ON CONFLICT DO NOTHING;

-- 第五篇文章的标签
INSERT INTO article_tags (article_id, tag_id) 
SELECT a.id, t.id FROM articles a, tags t 
WHERE a.title = '设计系统实战：从零到一' 
AND t.slug IN ('design-system', 'best-practices')
ON CONFLICT DO NOTHING;

-- 第六篇文章的标签
INSERT INTO article_tags (article_id, tag_id) 
SELECT a.id, t.id FROM articles a, tags t 
WHERE a.title = '动效设计最佳实践' 
AND t.slug IN ('animation-design', 'ux-design', 'interaction-design')
ON CONFLICT DO NOTHING;

-- ==================== 插入 2026 年的周数据 ====================
INSERT INTO weeks (week, year, start_date, end_date) VALUES
  (1, 2026, '2026-01-05', '2026-01-11'),
  (2, 2026, '2026-01-12', '2026-01-18'),
  (3, 2026, '2026-01-19', '2026-01-25'),
  (4, 2026, '2026-01-26', '2026-02-01'),
  (5, 2026, '2026-02-02', '2026-02-08'),
  (6, 2026, '2026-02-09', '2026-02-15'),
  (7, 2026, '2026-02-16', '2026-02-22'),
  (8, 2026, '2026-02-23', '2026-03-01'),
  (9, 2026, '2026-03-02', '2026-03-08'),
  (10, 2026, '2026-03-09', '2026-03-15'),
  (11, 2026, '2026-03-16', '2026-03-22'),
  (12, 2026, '2026-03-23', '2026-03-29'),
  (13, 2026, '2026-03-30', '2026-04-05'),
  (14, 2026, '2026-04-06', '2026-04-12'),
  (15, 2026, '2026-04-13', '2026-04-19'),
  (16, 2026, '2026-04-20', '2026-04-26'),
  (17, 2026, '2026-04-27', '2026-05-03'),
  (18, 2026, '2026-05-04', '2026-05-10'),
  (19, 2026, '2026-05-11', '2026-05-17'),
  (20, 2026, '2026-05-18', '2026-05-24'),
  (21, 2026, '2026-05-25', '2026-05-31'),
  (22, 2026, '2026-06-01', '2026-06-07'),
  (23, 2026, '2026-06-08', '2026-06-14'),
  (24, 2026, '2026-06-15', '2026-06-21'),
  (25, 2026, '2026-06-22', '2026-06-28'),
  (26, 2026, '2026-06-29', '2026-07-05'),
  (27, 2026, '2026-07-06', '2026-07-12'),
  (28, 2026, '2026-07-13', '2026-07-19'),
  (29, 2026, '2026-07-20', '2026-07-26'),
  (30, 2026, '2026-07-27', '2026-08-02'),
  (31, 2026, '2026-08-03', '2026-08-09'),
  (32, 2026, '2026-08-10', '2026-08-16'),
  (33, 2026, '2026-08-17', '2026-08-23'),
  (34, 2026, '2026-08-24', '2026-08-30'),
  (35, 2026, '2026-08-31', '2026-09-06'),
  (36, 2026, '2026-09-07', '2026-09-13'),
  (37, 2026, '2026-09-14', '2026-09-20'),
  (38, 2026, '2026-09-21', '2026-09-27'),
  (39, 2026, '2026-09-28', '2026-10-04'),
  (40, 2026, '2026-10-05', '2026-10-11'),
  (41, 2026, '2026-10-12', '2026-10-18'),
  (42, 2026, '2026-10-19', '2026-10-25'),
  (43, 2026, '2026-10-26', '2026-11-01'),
  (44, 2026, '2026-11-02', '2026-11-08'),
  (45, 2026, '2026-11-09', '2026-11-15'),
  (46, 2026, '2026-11-16', '2026-11-22'),
  (47, 2026, '2026-11-23', '2026-11-29'),
  (48, 2026, '2026-11-30', '2026-12-06'),
  (49, 2026, '2026-12-07', '2026-12-13'),
  (50, 2026, '2026-12-14', '2026-12-20'),
  (51, 2026, '2026-12-21', '2026-12-27'),
  (52, 2026, '2026-12-28', '2027-01-03')
ON CONFLICT DO NOTHING;
