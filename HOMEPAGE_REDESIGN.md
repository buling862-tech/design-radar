# Design Radar 首页重新设计 - Magazine 风格

## 📰 首页概念

首页采用 **Magazine（杂志）风格**，强调视觉冲击力和内容编辑，而非数据展示。

---

## 🎨 首页完整布局

```
┌──────────────────────────────────────────┐
│         Header + Navigation              │
│  Logo | 搜索 | 主题 | 后台                 │
├──────────────────────────────────────────┤
│                                          │
│        HERO SECTION (全宽)                │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │    Featured Article (本周精选)      │  │
│  │                                    │  │
│  │    [ 大图 ]                        │  │
│  │    标题                            │  │
│  │    摘要                            │  │
│  │    作者 | 日期 | 浏览量              │  │
│  │    [阅读全文 →]                    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     SECTION 1: 本周更新 (Latest)         │
│                                          │
│  [大卡片1]  [卡片2]  [卡片3]             │
│  (左侧大)   (右侧小 2x2)                 │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  SECTION 2: 设计趋势 (Trends)            │
│  ───────────────────────────────────────│
│  更多 →                                  │
│                                          │
│  [卡片] [卡片] [卡片]                    │
│  [卡片] [卡片] [卡片]                    │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  SECTION 3: 竞品追踪 (Competitors)       │
│  ───────────────────────────────────────│
│  更多 →                                  │
│                                          │
│  Netflix | Spotify | Apple | Google      │
│  更新 ↑  | 更新 ↑   | 稳定 → | 更新 ↑    │
│  2条新闻 | 1条新闻  | 无    | 3条新闻    │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  SECTION 4: 热门标签 (Popular Tags)      │
│  ───────────────────────────────────────│
│  #AI设计(28) #UI设计(24) #动效(19)      │
│  #深色模式(15) #响应式(14) #可访问(12)  │
│  #Web3(11) #设计系统(10) ...            │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  SECTION 5: 最近更新 (Recent Updates)    │
│  ───────────────────────────────────────│
│                                          │
│  📄 文章标题 1 ...                      │
│     作者 • 2 天前 • 45 赞 • 234 浏览    │
│                                          │
│  📄 文章标题 2 ...                      │
│     作者 • 3 天前 • 32 赞 • 156 浏览    │
│                                          │
│  📄 文章标题 3 ...                      │
│     作者 • 5 天前 • 28 赞 • 98 浏览     │
│                                          │
│  [查看更多 →]                           │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  SECTION 6: 历史周刊 (Weekly Archives)   │
│  ───────────────────────────────────────│
│                                          │
│  第 31 周 • 2026-08-03 ~ 08-09         │
│  12 篇文章 • 234 赞                     │
│  [查看详情 →]                          │
│                                          │
│  第 30 周 • 2026-07-27 ~ 08-02         │
│  10 篇文章 • 189 赞                     │
│  [查看详情 →]                          │
│                                          │
│  第 29 周 • 2026-07-20 ~ 07-26         │
│  8 篇文章 • 156 赞                      │
│  [查看详情 →]                          │
│                                          │
│  [浏览更多周刊 →]                       │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  CTA SECTION                            │
│  订阅每周设计周刊                        │
│  获取最新设计趋势、竞品动态和灵感        │
│                                          │
│  [Email 输入框] [订阅]                  │
│                                          │
├──────────────────────────────────────────┤
│        Footer                           │
└──────────────────────────────────────────┘
```

---

## 📑 六个主要内容区块

### 1. 🔝 Hero Section（全宽）

**设计特点：**
- 全宽展示本周精选文章
- 大图 + 文案叠加
- 完整的文章信息
- 强烈的视觉冲击

**数据需求：**
```typescript
{
  featuredArticle: Article & {
    category: Category,
    author: User,
    image: string
  }
}
```

**组件：**
```typescript
<FeaturedArticleHero article={featuredArticle} />
```

---

### 2. 📰 本周更新 (Latest This Week)

**设计特点：**
- 左侧一个大卡片（1:1 或 4:3）
- 右侧两行两列小卡片
- 展示本周最新的 5 篇文章
- 优先显示精选文章

**布局代码：**
```
┌─────────────────┬────────┬────────┐
│                 │ [卡2]  │ [卡3]  │
│  [大卡片 1]     ├────────┼────────┤
│                 │ [卡4]  │ [卡5]  │
└─────────────────┴────────┴────────┘
```

**数据需求：**
```typescript
{
  weeklyArticles: Article[] // 长度 5
}
```

---

### 3. 📈 设计趋势 (Design Trends)

**设计特点：**
- 分类横幅
- 6 篇文章网格（2x3）
- "更多 →" 链接指向 `/trends`
- 卡片式排列

**数据需求：**
```typescript
{
  trendArticles: Article[] // 长度 6
}
```

---

### 4. 🎯 竞品追踪 (Competitor Tracking)

**设计特点：**
- 竞品品牌卡片展示
- 显示品牌 Logo 或名称
- 显示趋势指标（↑/→/↓）
- 显示最近更新数量
- "更多 →" 链接指向 `/competitors`

**品牌列表：**
```
• Netflix    ↑ 2 条新闻
• Spotify    ↑ 1 条新闻
• Apple      → 无更新
• Google     ↑ 3 条新闻
• Meta       ↑ 1 条新闻
• Microsoft  → 无更新
```

**数据需求：**
```typescript
{
  brands: Brand[] with {
    recentUpdates: CompetitorUpdate[],
    trend: 'up' | 'down' | 'stable'
  }
}
```

---

### 5. 🏷️ 热门标签 (Popular Tags)

**设计特点：**
- 标签云或列表式排列
- 显示标签名 + 文章计数
- 按热度排序
- 点击进入标签页面

**示例：**
```
#AI设计(28)        #UI设计(24)       #动效设计(19)
#深色模式(15)      #响应式设计(14)   #可访问性(12)
#Web3设计(11)      #设计系统(10)     #品牌设计(9)
...
```

**数据需求：**
```typescript
{
  popularTags: (Tag & { articleCount: number })[]
}
```

---

### 6. 🕐 最近更新 (Recent Updates)

**设计特点：**
- 列表式布局
- 显示文章标题 + 作者 + 时间 + 统计
- 时间相对化（"2 天前"）
- "查看更多 →" 指向搜索或最新文章页

**格式：**
```
📄 文章标题
   作者名 • 时间 • 赞数 • 浏览数

📄 文章标题 2
   作者名 • 时间 • 赞数 • 浏览数
```

**数据需求：**
```typescript
{
  recentArticles: (Article & {
    author: User,
    viewCount: number,
    likeCount: number
  })[]
}
```

---

### 7. 📅 历史周刊 (Weekly Archives)

**设计特点：**
- 最近 3-5 周的周刊卡片
- 显示周编号 + 日期范围
- 显示文章数量和赞数
- "查看详情 →" 指向周刊详情页
- "浏览更多周刊 →" 指向 `/archives`

**格式：**
```
第 31 周 • 2026-08-03 ~ 08-09
12 篇文章 • 234 赞
[查看详情 →]
```

**数据需求：**
```typescript
{
  recentWeeks: (Week & {
    articleCount: number,
    totalLikes: number
  })[]
}
```

---

## 🎯 订阅号召 (CTA)

**设计特点：**
- 清晰的标题 + 描述
- Email 输入框 + 订阅按钮
- 简洁的设计
- 高转化率

---

## 📱 响应式适配

### 桌面版 (1200px+)
```
本周更新: 1大 + 4小 (Masonry)
设计趋势: 3 列网格 (6 篇)
竞品追踪: 6 个品牌卡片
```

### 平板版 (768px - 1199px)
```
本周更新: 堆叠布局 (2列)
设计趋势: 2 列网格 (4-6 篇)
竞品追踪: 4 个品牌卡片
```

### 手机版 (< 768px)
```
本周更新: 单列堆叠
设计趋势: 单列卡片
竞品追踪: 水平滚动或单列
热门标签: 自动换行
```

---

## 🎨 视觉设计特点

### 排版
- H1: 品牌介绍标题
- H2: 每个区块的标题
- Body: 卡片文案、描述

### 颜色
- 主色：#3B82F6（蓝色）
- 背景：#f9fafb (浅灰)
- 深色模式：适配

### 间距
- 区块间距：40px - 60px
- 卡片间距：24px
- 内边距：16px - 24px

### 卡片样式
- 圆角：8px - 12px
- 阴影：轻微阴影
- Hover 效果：放大 + 阴影增强

---

## 💻 组件结构

```
HomePage
├── HeroSection
│   └── FeaturedArticle
├── LatestThisWeek
│   ├── LargeArticleCard
│   └── SmallArticleCard (x4)
├── DesignTrends
│   ├── SectionHeader
│   └── ArticleGrid (3 cols, 6 items)
├── CompetitorTracking
│   ├── SectionHeader
│   └── BrandCard (x6)
├── PopularTags
│   ├── SectionHeader
│   └── TagCloud
├── RecentUpdates
│   ├── SectionHeader
│   └── ArticleListItem (x5+)
├── WeeklyArchives
│   ├── SectionHeader
│   └── WeekCard (x3-5)
├── SubscribeCTA
│   └── EmailForm
└── Footer
```

---

## 📊 数据查询

首页需要以下数据：

```typescript
interface HomePageData {
  // 精选文章
  featuredArticle: Article & {
    category: Category,
    author: User,
    week: Week
  }
  
  // 本周 5 篇
  weeklyArticles: Article[]
  
  // 趋势 6 篇
  trendArticles: Article[]
  
  // 竞品品牌
  brands: (Brand & {
    recentUpdates: CompetitorUpdate[]
  })[]
  
  // 热门标签
  popularTags: (Tag & {
    articleCount: number
  })[]
  
  // 最近更新 5+
  recentArticles: (Article & {
    author: User,
    stats: { views: number, likes: number }
  })[]
  
  // 最近周刊 3-5
  recentWeeks: (Week & {
    articleCount: number,
    totalLikes: number
  })[]
  
  // 统计数据
  stats?: {
    totalArticles: number
    totalWeeks: number
    totalMembers: number
  }
}
```

---

## 🔄 数据流

```
/api/homepage
├── GET featured article
├── GET this week's articles
├── GET trending articles
├── GET brands with recent updates
├── GET popular tags
├── GET recent articles
└── GET recent weeks

返回 HomePageData JSON
```

---

## 🎯 用户旅程

```
用户访问首页
  ↓
看到 Hero (精选)
  ↓
浏览本周更新
  ↓
选择：
  ├─ 浏览趋势 (→ /trends)
  ├─ 查看竞品 (→ /competitors)
  ├─ 点击标签 (→ /tag/[slug])
  ├─ 阅读最近 (→ /article/[id])
  ├─ 查看周刊 (→ /week/2026-31)
  └─ 订阅
```

---

## ✨ 特色功能

- ✅ Magazine 风格的专业外观
- ✅ 多个内容入口（趋势、竞品、标签等）
- ✅ 视觉层级清晰
- ✅ 易于导航
- ✅ 内容充实
- ✅ 转化优化（订阅 CTA）
- ✅ 响应式设计
- ✅ 深色模式支持

---

## 📝 SEO 优化

```html
<meta name="description" content="精选全球顶尖的设计作品、创新案例和设计灵感。发现最新的设计趋势，追踪竞品动态。">

<meta property="og:title" content="Design Radar | 设计灵感与趋势雷达">
<meta property="og:description" content="每周精选最佳设计内容，追踪行业动态">
<meta property="og:image" content="[featured article image]">

<schema type="Organization">
  - name: Design Radar
  - description: 设计周刊
  - url: https://designradar.com
</schema>
```

---

现在首页已完全重新设计为 **Magazine 杂志风格**，更加专业、富有视觉冲击力，并且提供多个内容入口！ 🎉
