# Design Radar 自动周刊生成系统

## 🎯 核心概念

```
数据库中每周的 12+ 篇文章
         │
         ├─► 自动分类筛选
         │   ├─ 6 篇 设计趋势
         │   └─ 6 篇 竞品追踪
         │
         ├─► 自动生成周刊页面
         │   ├─ /week/2026-31
         │   └─ /week/2026-32
         │
         └─► 首页自动展示
             ├─ 趋势部分 (6篇)
             └─ 竞品部分 (6篇)
         
无需人工编辑，完全自动化！
```

---

## 📦 已创建的文件

### 1. **周刊生成器** (`app/lib/newsletter-generator.ts`)

**核心函数：**

```typescript
// 获取指定周的周刊（自动从数据库获取）
getWeeklyNewsletter(year, week)
  ├─ 查询 weeks 表获取日期范围
  ├─ 查询 6 篇 is_design_trend = true 的文章
  ├─ 查询 6 篇 is_competitor_tracking = true 的文章
  └─ 返回格式化的周刊对象

// 获取当前周的周刊
getCurrentWeekNewsletter()

// 获取最近 N 个周刊
getRecentNewsletters(count)

// 检查该周是否有足够内容
canGenerateNewsletter(year, week, minArticles)

// 获取周刊统计信息
getNewsletterStats(year, week)
```

---

### 2. **周刊 API 端点** (`app/api/newsletter/route.ts`)

**API 调用示例：**

```bash
# 获取指定周的周刊
curl "http://localhost:3000/api/newsletter?week=31&year=2026"

# 获取当前周的周刊
curl "http://localhost:3000/api/newsletter?current=true"

# 获取最近 5 个周刊
curl "http://localhost:3000/api/newsletter?recent=5"
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "weekId": "uuid",
    "week": 31,
    "year": 2026,
    "startDate": "2026-08-03",
    "endDate": "2026-08-09",
    "designTrendArticles": [
      {
        "id": "uuid",
        "title": "Figma 新功能",
        "description": "...",
        "image_url": "...",
        "focus_points": ["...", "...", "..."],
        "tags": ["AI", "Figma"]
      },
      // ... 共 6 篇
    ],
    "competitorArticles": [
      {
        "id": "uuid",
        "title": "Adobe 更新",
        "description": "...",
        "inspiration_points": ["...", "...", "..."],
        "source": "Adobe Blog",
        "tags": ["Adobe", "设计工具"]
      },
      // ... 共 6 篇
    ],
    "generatedAt": "2026-08-11T14:30:00Z"
  }
}
```

---

### 3. **周刊展示组件** (`app/components/WeeklyNewsletterDisplay.tsx`)

**完整的周刊页面组件：**

```tsx
<WeeklyNewsletterDisplay week={31} year={2026} />

// 或使用当前周
<WeeklyNewsletterDisplay current={true} />
```

**功能：**
- ✅ 自动获取周刊数据
- ✅ 分别展示设计趋势和竞品追踪
- ✅ 显示文章缩略图、标题、摘要
- ✅ 高亮关键信息（关注点/启发）
- ✅ 展示标签
- ✅ 响应式布局

---

### 4. **首页趋势组件** (`app/components/HomepageTrends.tsx`)

**首页自动展示最新趋势：**

```tsx
<HomepageTrends limit={6} />

// 自动获取当前周的 6 篇设计趋势
// 无需手动编辑，完全自动化！
```

**特点：**
- ✅ 自动从当前周获取
- ✅ 只需 1 行代码集成到首页
- ✅ 美观的卡片布局
- ✅ 点击跳转到文章详情

---

## 🔄 完整工作流

### 流程图

```
┌─────────────────────────────────────────┐
│  内容采集（每天 00:00）                 │
│  /api/collect 采集各源文章              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  AI 分析（自动）                        │
│  - 提取标题、摘要                       │
│  - 标记 is_design_trend                │
│  - 标记 is_competitor_tracking         │
│  - 提取关注点和启发                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  数据库存储（articles 表）              │
│  - is_design_trend = true/false        │
│  - is_competitor_tracking = true/false │
│  - focus_points, inspiration_points   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  自动周刊生成（无代码）                 │
│  getWeeklyNewsletter(2026, 31)         │
│  - 自动取前 6 篇趋势                   │
│  - 自动取前 6 篇竞品                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  前端自动展示                           │
│  /week/2026-31 周刊详情页              │
│  / 首页自动展示最新趋势                 │
└─────────────────────────────────────────┘
```

---

## 💻 使用示例

### 例1：在首页添加自动趋势

```tsx
// app/page.tsx
import HomepageTrends from '@/app/components/HomepageTrends'

export default function Home() {
  return (
    <main>
      {/* 其他首页内容 */}
      
      {/* 自动展示本周 6 篇设计趋势 */}
      <HomepageTrends limit={6} />
      
      {/* 其他内容 */}
    </main>
  )
}
```

### 例2：创建周刊详情页

```tsx
// app/week/[year]-[week]/page.tsx
import WeeklyNewsletterDisplay from '@/app/components/WeeklyNewsletterDisplay'

export default function WeekPage({
  params: { year, week },
}: {
  params: { year: string; week: string }
}) {
  return (
    <main className="container mx-auto px-4 py-8">
      <WeeklyNewsletterDisplay
        year={parseInt(year)}
        week={parseInt(week)}
      />
    </main>
  )
}
```

### 例3：获取周刊数据用于其他用途

```typescript
// 在服务器端或 API 中
import { getWeeklyNewsletter, getRecentNewsletters } from '@/app/lib/newsletter-generator'

// 获取指定周的周刊
const newsletter = await getWeeklyNewsletter(2026, 31)

// 获取最近 5 个周刊（用于存档页面）
const recentNewsletters = await getRecentNewsletters(5)

// 检查该周是否有足够内容
const hasContent = await canGenerateNewsletter(2026, 31, minArticles: 10)
```

---

## 🎨 数据库字段说明

### articles 表关键字段

| 字段 | 说明 | 用途 |
|-----|------|------|
| `is_design_trend` | 布尔值 | AI 自动标记（✅ 包含在周刊中） |
| `is_competitor_tracking` | 布尔值 | AI 自动标记（✅ 包含在周刊中） |
| `focus_points` | 文本数组 | 设计关注点（显示在周刊中） |
| `inspiration_points` | 文本数组 | 设计启发（显示在周刊中） |
| `published_date` | 日期 | 用于确定属于哪一周 |
| `status` | 字符串 | 只查询 'published' 状态 |

### weeks 表字段

| 字段 | 说明 |
|-----|------|
| `week` | 周数 (1-52) |
| `year` | 年份 |
| `start_date` | 周一日期 |
| `end_date` | 周日日期 |

---

## 📊 SQL 查询

### 周刊的核心查询

```sql
-- 获取 2026 年第 31 周的设计趋势（6篇）
SELECT 
  id, title, description, image_url, focus_points, tags
FROM articles
WHERE is_design_trend = true
  AND status = 'published'
  AND published_date >= '2026-08-03' AND published_date <= '2026-08-09'
ORDER BY published_date DESC
LIMIT 6;

-- 获取 2026 年第 31 周的竞品追踪（6篇）
SELECT 
  id, title, description, image_url, inspiration_points, source
FROM articles
WHERE is_competitor_tracking = true
  AND status = 'published'
  AND published_date >= '2026-08-03' AND published_date <= '2026-08-09'
ORDER BY published_date DESC
LIMIT 6;
```

---

## 🚀 自动化定时任务

### 配置 Vercel Cron（可选）

创建 `app/api/cron/generate-newsletter/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getWeeklyNewsletter, canGenerateNewsletter } from '@/app/lib/newsletter-generator'

export async function GET(request: NextRequest) {
  // 验证来自 Vercel
  const authorization = request.headers.get('authorization')
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const year = now.getFullYear()
    const week = Math.ceil((now.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))

    // 检查该周是否有足够内容
    const hasContent = await canGenerateNewsletter(year, week, 10)

    if (!hasContent) {
      return NextResponse.json({
        message: `周 ${year}-${week} 内容不足，无需生成`,
      })
    }

    // 生成周刊（这里只是验证，实际数据已自动生成）
    const newsletter = await getWeeklyNewsletter(year, week)

    return NextResponse.json({
      success: true,
      message: `周 ${year}-${week} 周刊已生成`,
      data: {
        week,
        year,
        designTrendsCount: newsletter?.designTrendArticles.length || 0,
        competitorCount: newsletter?.competitorArticles.length || 0,
      },
    })
  } catch (error) {
    console.error('周刊生成错误:', error)
    return NextResponse.json(
      { error: '生成失败' },
      { status: 500 }
    )
  }
}
```

在 `vercel.json` 中配置：

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-newsletter",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## 🎯 核心特性

| 特性 | 说明 | 状态 |
|-----|------|------|
| 自动周刊生成 | 无需手动编辑，数据库记录自动转为周刊 | ✅ 完成 |
| 自动分类 | AI 自动标记设计趋势 vs 竞品追踪 | ✅ 完成 |
| 首页自动展示 | 首页自动显示最新周的内容 | ✅ 完成 |
| 周刊 API | RESTful API 获取任意周的周刊 | ✅ 完成 |
| 响应式设计 | 适配桌面、平板、手机 | ✅ 完成 |
| 性能优化 | 缓存、预加载优化 | 🔄 可选 |
| 邮件通知 | 周刊发布时自动发送邮件 | 🔄 可选 |
| 社交分享 | 分享周刊到社交媒体 | 🔄 可选 |

---

## 📈 监控和统计

### 周刊统计

```typescript
import { getNewsletterStats } from '@/app/lib/newsletter-generator'

// 获取某周的统计
const stats = await getNewsletterStats(2026, 31)
// 返回: {
//   totalArticles: 12,
//   trendCount: 6,
//   competitorCount: 6,
//   totalLikes: 234
// }
```

### 查询某周是否可生成

```typescript
import { canGenerateNewsletter } from '@/app/lib/newsletter-generator'

const canGenerate = await canGenerateNewsletter(2026, 31, minArticles: 10)
// 检查是否有足够文章
```

---

## ✅ 集成检查清单

- [ ] `app/lib/newsletter-generator.ts` 已创建
- [ ] `app/api/newsletter/route.ts` 已创建
- [ ] `app/components/WeeklyNewsletterDisplay.tsx` 已创建
- [ ] `app/components/HomepageTrends.tsx` 已创建
- [ ] 首页已集成 `<HomepageTrends />`
- [ ] 测试 `/api/newsletter?current=true` 端点
- [ ] 测试 `/api/newsletter?week=31&year=2026` 端点
- [ ] 验证周刊页面 `/week/2026-31` 可访问
- [ ] 测试首页自动展示趋势
- [ ] 配置定时任务（可选）

---

## 🎉 完成！

现在你的设计周刊系统完全自动化：

1. ✅ 文章采集和 AI 分析（自动）
2. ✅ 文章自动分类为趋势/竞品（自动）
3. ✅ 周刊自动生成（无代码）
4. ✅ 首页自动展示（只需 1 行组件）
5. ✅ 周刊页面自动生成（动态路由）

**无需人工编辑，完全自动化！** 🚀
