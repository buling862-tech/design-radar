# Design Radar 自动内容收集系统

## 🎯 核心概念

建立一个**多源自动收集系统**，从 14 个高质量设计资讯源自动采集内容，定期发布设计周刊。

---

## 📡 14 个内容源

| # | 源名称 | 类型 | 更新频率 | 优先级 | 说明 |
|---|--------|------|---------|--------|------|
| 1 | Figma Blog | 官方 | 周 2-3 | ⭐⭐⭐⭐⭐ | 设计工具官方博客 |
| 2 | Google Design | 官方 | 周 1-2 | ⭐⭐⭐⭐⭐ | Google 设计指南与案例 |
| 3 | Apple Developer | 官方 | 周 1-2 | ⭐⭐⭐⭐⭐ | Apple 开发者指南 |
| 4 | Material Design | 官方 | 月 1-2 | ⭐⭐⭐⭐ | Material 设计系统 |
| 5 | Wallpaper* | 媒体 | 日 3-5 | ⭐⭐⭐ | 设计与建筑杂志 |
| 6 | Dezeen | 媒体 | 日 5-10 | ⭐⭐⭐⭐ | 全球设计资讯 |
| 7 | UX Collective | 社区 | 日 5-10 | ⭐⭐⭐⭐ | UX 文章合集 |
| 8 | NNGroup | 咨询 | 周 2-3 | ⭐⭐⭐⭐ | 用户体验研究 |
| 9 | OpenAI | 官方 | 月 1-3 | ⭐⭐⭐⭐⭐ | AI 相关更新 |
| 10 | Anthropic | 官方 | 月 1-2 | ⭐⭐⭐⭐ | AI 安全研究 |
| 11 | Perplexity | 官方 | 月 1-2 | ⭐⭐⭐ | AI 搜索平台 |
| 12 | Adobe | 官方 | 周 2-3 | ⭐⭐⭐⭐ | 创意工具博客 |
| 13 | Behance | 社区 | 日 10-20 | ⭐⭐⭐ | 设计作品展示 |
| 14 | Dribbble | 社区 | 日 10-20 | ⭐⭐⭐ | 设计灵感库 |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────┐
│      14 Content Sources                 │
│                                         │
│  Figma  Google  Apple  Material ...     │
│   ↓      ↓      ↓       ↓              │
├─────────────────────────────────────────┤
│    Content Fetcher (爬虫/API)           │
│  - RSS 订阅                             │
│  - Web 爬虫                             │
│  - 官方 API                             │
├─────────────────────────────────────────┤
│    Content Parser (解析器)              │
│  - 提取标题、链接、图片                  │
│  - 分类标签                             │
│  - 自动摘要（AI）                       │
├─────────────────────────────────────────┤
│    Content Validator (验证)             │
│  - 去重                                 │
│  - 质量评分                             │
│  - 相关性检查                           │
├─────────────────────────────────────────┤
│    Database (Supabase)                  │
│  - raw_articles 表 (原始文章)           │
│  - articles 表 (发布文章)               │
├─────────────────────────────────────────┤
│    Curation (编辑策略)                  │
│  - AI 推荐                              │
│  - 人工审核                             │
│  - 周刊编辑                             │
├─────────────────────────────────────────┤
│    Publishing (发布)                    │
│  - 网站发布                             │
│  - 邮件通知                             │
│  - 社交媒体                             │
└─────────────────────────────────────────┘
```

---

## 💾 数据库表设计

### 1. raw_articles 表（原始文章）

```sql
CREATE TABLE raw_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id INTEGER NOT NULL,           -- 源 ID (1-14)
  source_name VARCHAR(100),              -- 源名称
  title VARCHAR(500) NOT NULL,
  url TEXT NOT NULL UNIQUE,              -- 原文链接
  content TEXT,                          -- 完整内容或摘要
  image TEXT,                            -- 缩略图
  published_date TIMESTAMP,              -- 原发布日期
  fetched_date TIMESTAMP DEFAULT now(),  -- 抓取日期
  description TEXT,                      -- 自动摘要
  
  -- 分析字段
  quality_score DECIMAL(3,2),            -- 质量分 0-1
  relevance_score DECIMAL(3,2),          -- 相关性 0-1
  tag_predictions TEXT[],                -- AI 推荐标签
  
  -- 状态
  status VARCHAR(50),                    -- pending|approved|rejected|published
  featured BOOLEAN DEFAULT false,
  
  -- 审核
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 2. content_sources 表（内容源配置）

```sql
CREATE TABLE content_sources (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  type VARCHAR(50),                      -- official|media|community
  
  -- 抓取配置
  fetch_method VARCHAR(50),              -- rss|api|web_scraper
  rss_url TEXT,                          -- RSS 源
  api_endpoint TEXT,                     -- API 端点
  api_key VARCHAR(255),                  -- API 密钥（加密）
  
  -- 更新频率
  update_frequency VARCHAR(50),          -- hourly|daily|weekly|monthly
  last_fetched TIMESTAMP,
  fetch_interval_minutes INTEGER,
  
  -- 优先级和状态
  priority INTEGER,                      -- 1-5，越高越优先
  enabled BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  
  -- 统计
  total_articles INTEGER DEFAULT 0,
  this_week_articles INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT now()
);
```

### 3. 关联表修改

在 **articles** 表中添加字段：

```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_id INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS raw_article_id UUID REFERENCES raw_articles(id);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS quality_score DECIMAL(3,2);
```

---

## 🔄 工作流程

### 流程 1: 内容采集（每小时运行）

```
1. 遍历所有启用的源
2. 根据源的 fetch_method：
   a) RSS: 使用 RSS 解析器
   b) API: 调用官方 API
   c) Web: 使用网络爬虫
3. 提取文章信息
4. 存入 raw_articles 表
5. 更新源的 last_fetched 时间
```

**伪代码：**
```typescript
async function fetchContentFromAllSources() {
  const sources = await getSources({ enabled: true })
  
  for (const source of sources) {
    try {
      const articles = await fetchContent(source)
      
      for (const article of articles) {
        await insertRawArticle({
          source_id: source.id,
          source_name: source.name,
          title: article.title,
          url: article.url,
          content: article.content,
          image: article.image,
          published_date: article.date,
          description: await generateSummary(article.content)
        })
      }
      
      await updateSourceLastFetch(source.id)
    } catch (error) {
      console.error(`Failed to fetch from ${source.name}:`, error)
    }
  }
}
```

### 流程 2: 内容验证（每小时运行）

```
1. 获取 24 小时内新增的原始文章
2. 去重检查（按 URL 和标题相似度）
3. 计算质量分和相关性分
4. 标记为 pending
5. 等待人工审核或自动批准
```

### 流程 3: 内容审核（人工或 AI）

```
工作流程：
1. 编辑查看待审文章列表
2. 预览文章信息
3. 选择：批准 / 拒绝 / 修改
4. 批准后文章进入发布队列
```

### 流程 4: 周刊编辑（每周五）

```
1. 收集本周所有已批准的文章
2. 按分类分组
3. 选择本周精选
4. 安排版面
5. 生成周刊 HTML
6. 发送邮件和发布网站
```

### 流程 5: 发布（周一）

```
1. 发布周刊到网站
2. 通知订阅用户
3. 在社交媒体分享
4. 更新首页显示
```

---

## 🤖 关键技术组件

### 1. 内容获取器 (Fetchers)

**RSS 获取器**
```typescript
import Parser from 'rss-parser'

async function fetchRSS(rssUrl: string) {
  const parser = new Parser()
  const feed = await parser.parseURL(rssUrl)
  
  return feed.items.map(item => ({
    title: item.title,
    url: item.link,
    content: item.content || item.description,
    image: item.image?.url || extractImage(item.description),
    date: new Date(item.pubDate),
    author: item.creator
  }))
}
```

**API 获取器（以 OpenAI Blog 为例）**
```typescript
async function fetchOpenAIBlog() {
  const response = await fetch('https://openai.com/api/blog/posts', {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  })
  
  const data = await response.json()
  return data.items.map(item => ({
    title: item.title,
    url: item.url,
    content: item.excerpt,
    image: item.coverImage,
    date: new Date(item.publishedAt)
  }))
}
```

**Web 爬虫（Behance/Dribbble）**
```typescript
import cheerio from 'cheerio'

async function scrapeDribbble(category: string) {
  const response = await fetch(`https://dribbble.com/search?q=${category}`)
  const html = await response.text()
  const $ = cheerio.load(html)
  
  return $('.shot-card').map((_, elem) => ({
    title: $(elem).find('.title').text(),
    url: $(elem).find('a').attr('href'),
    image: $(elem).find('img').attr('src'),
    date: new Date()
  })).get()
}
```

### 2. 内容解析器 (Parser)

```typescript
async function parseArticle(rawArticle: RawArticle) {
  // 提取图片
  const image = await extractBestImage(rawArticle)
  
  // 生成摘要
  const summary = await generateSummary(rawArticle.content)
  
  // 提取标签（使用 NLP）
  const tags = await predictTags(rawArticle.title, rawArticle.content)
  
  // 计算分数
  const qualityScore = calculateQuality(rawArticle)
  const relevanceScore = calculateRelevance(rawArticle, tags)
  
  return {
    ...rawArticle,
    image,
    summary,
    tags,
    qualityScore,
    relevanceScore
  }
}
```

### 3. 去重检查 (Deduplication)

```typescript
async function checkDuplicates(article: Article) {
  // 精确 URL 匹配
  const exactMatch = await db
    .from('raw_articles')
    .select('id')
    .eq('url', article.url)
  
  if (exactMatch.length > 0) return true
  
  // 相似标题检查
  const similarTitle = await db
    .from('raw_articles')
    .select('id')
    .textSearch('title', article.title)
  
  for (const similar of similarTitle) {
    const similarity = stringSimilarity(
      article.title,
      similar.title
    )
    if (similarity > 0.8) return true
  }
  
  return false
}
```

### 4. 质量评分 (Quality Scoring)

```typescript
function calculateQualityScore(article: RawArticle): number {
  let score = 0
  
  // 标题质量 (0-0.2)
  score += article.title.length > 20 ? 0.2 : 0.1
  
  // 内容质量 (0-0.3)
  const contentLength = article.content?.length || 0
  if (contentLength > 1000) score += 0.3
  else if (contentLength > 500) score += 0.2
  else if (contentLength > 100) score += 0.1
  
  // 图片质量 (0-0.2)
  if (article.image) {
    score += article.image.endsWith('.gif') ? 0.1 : 0.2
  }
  
  // 来源权重 (0-0.3)
  const sourceWeights: Record<string, number> = {
    'Figma Blog': 0.3,
    'Google Design': 0.3,
    'Apple Developer': 0.3,
    'Dezeen': 0.25,
    'UX Collective': 0.2
  }
  score += sourceWeights[article.source_name] || 0.1
  
  return Math.min(score, 1)
}
```

---

## 📊 内容源详细配置

### Source 1: Figma Blog
```yaml
name: Figma Blog
url: https://www.figma.com/blog
fetch_method: rss
rss_url: https://www.figma.com/blog/rss
priority: 5
update_frequency: weekly
```

### Source 2: Google Design
```yaml
name: Google Design
url: https://design.google
fetch_method: rss
rss_url: https://design.google/feed/
priority: 5
update_frequency: weekly
```

### Source 6: Dezeen
```yaml
name: Dezeen
url: https://www.dezeen.com
fetch_method: rss
rss_url: https://www.dezeen.com/feed
priority: 4
update_frequency: daily
```

### Source 9: OpenAI
```yaml
name: OpenAI
url: https://openai.com/blog
fetch_method: web_scraper
priority: 5
update_frequency: monthly
categories: ['AI', 'Research']
```

### Source 13: Behance
```yaml
name: Behance
url: https://www.behance.net
fetch_method: web_scraper
priority: 3
update_frequency: daily
categories: ['design', 'branding', 'ui']
```

---

## 🔔 自动化计划

**每天：**
- 00:00 - 采集所有源内容
- 01:00 - 内容验证和去重
- 02:00 - 计算分数和标签

**每周（周五）:**
- 15:00 - 编辑审核本周内容
- 17:00 - 编辑周刊
- 18:00 - 生成周刊 HTML

**每周（周一）:**
- 09:00 - 发布周刊
- 09:30 - 发送邮件
- 10:00 - 社交媒体分享

---

## 📈 统计和分析

```typescript
interface SourceStats {
  // 本周
  thisWeekArticles: number
  thisWeekFeatured: number
  thisWeekTotalViews: number
  thisWeekTotalLikes: number
  
  // 本月
  thisMonthArticles: number
  avgQualityScore: number
  
  // 排名
  rank: number
  percentile: number
}
```

---

## 🔐 API 密钥管理

所有 API 密钥都应该：
- 存储在 `.env` 文件中（不提交到 Git）
- 在 Supabase 中加密存储
- 定期轮换
- 限制访问权限

```env
OPENAI_API_KEY=sk-...
ADOBE_API_KEY=...
BEHANCE_API_KEY=...
```

---

## ✅ 实施清单

- [ ] 创建 raw_articles 表
- [ ] 创建 content_sources 表
- [ ] 实现 RSS 爬虫
- [ ] 实现 Web 爬虫
- [ ] 实现内容解析
- [ ] 实现去重检查
- [ ] 实现质量评分
- [ ] 设置定时任务（Cron）
- [ ] 创建审核 UI
- [ ] 测试各个源
- [ ] 监控和报警

---

## 🎯 目标

- ✅ 每天自动采集 50-100 篇优质设计资讯
- ✅ 每周发布 1 期精选周刊（10-15 篇）
- ✅ 维持高质量内容（平均质量分 > 0.7）
- ✅ 减少人工审核时间（从 2 小时到 30 分钟）
- ✅ 提高内容多样性（覆盖 14 个不同源）

---

这个系统可以让 Design Radar 成为一个 **真正自动化、内容丰富的设计周刊平台**！ 🚀
