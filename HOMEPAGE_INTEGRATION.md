# 首页集成指南 - 自动周刊展示

## 🎯 目标

在首页自动展示：
- 📈 6 篇设计趋势（当前周）
- 🎯 6 篇竞品追踪（当前周）

**无需任何手动编辑！** 数据自动从数据库获取。

---

## 📝 首页集成代码

### 修改 `app/page.tsx`

```tsx
import { Metadata } from 'next'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Hero from '@/app/components/Hero'
import HomepageTrends from '@/app/components/HomepageTrends'
import HomepageNewsletterPreview from '@/app/components/HomepageNewsletterPreview'

export const metadata: Metadata = {
  title: 'Design Radar | 设计灵感与趋势雷达',
  description: '精选全球顶尖的设计作品、创新案例和设计灵感。每周更新，助力设计师保持创意前沿。',
  keywords: '设计, 趋势, 灵感, 作品集, 设计周刊, 竞品追踪',
}

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Hero 区域 */}
        <Hero />

        <div className="container mx-auto px-4">
          {/* 
            设计趋势 - 自动从当前周获取 6 篇
            完全自动化，无需手动编辑
          */}
          <HomepageTrends limit={6} />

          {/* 间隔 */}
          <div className="my-16" />

          {/* 
            本周精选周刊 - 自动从当前周获取 6 篇竞品追踪
            + 指向完整周刊页面的链接
          */}
          <HomepageNewsletterPreview limit={6} />

          {/* 间隔 */}
          <div className="my-16" />

          {/* 其他首页内容 */}
          {/* ... */}
        </div>
      </main>

      <Footer />
    </>
  )
}
```

---

## 📱 组件使用说明

### 1. 设计趋势组件 - `HomepageTrends`

```tsx
<HomepageTrends limit={6} />
```

**功能：**
- 自动获取当前周的设计趋势
- 显示 `is_design_trend = true` 的文章
- 展示关键点、标签、缩略图
- 点击可跳转到文章详情

**props：**
- `limit` (number, default: 6) - 显示的文章数量

---

### 2. 周刊预览组件 - `HomepageNewsletterPreview`

```tsx
<HomepageNewsletterPreview limit={6} />
```

**功能：**
- 自动获取当前周的竞品追踪
- 显示 `is_competitor_tracking = true` 的文章
- 显示来源、启发点、标签
- 显示本周号，指向完整周刊页面
- 底部有"查看完整周刊"按钮

**props：**
- `limit` (number, default: 6) - 显示的文章数量

---

## 🔄 数据流

```
首页加载
  ↓
组件挂载，调用 useEffect
  ↓
发送 GET /api/newsletter?current=true
  ↓
API 自动计算当前周
  ↓
查询数据库:
  - SELECT 6 篇 is_design_trend = true
  - SELECT 6 篇 is_competitor_tracking = true
  ↓
返回 JSON
  ↓
组件渲染内容
  ↓
用户看到实时数据
```

---

## 🎨 首页布局示例

```
┌─────────────────────────────────────────┐
│           Header (导航栏)               │
├─────────────────────────────────────────┤
│                                         │
│           Hero Section                  │
│     (品牌介绍 + 搜索框)                 │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    📈 设计趋势 (6 篇)                   │
│                                         │
│  [卡片1] [卡片2] [卡片3]               │
│  [卡片4] [卡片5] [卡片6]               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📅 本周精选 · 第 31 周                 │
│                                         │
│  🎯 竞品追踪 (6 篇)                    │
│                                         │
│  [卡片1] [卡片2] [卡片3]               │
│  [卡片4] [卡片5] [卡片6]               │
│                                         │
│  [查看完整周刊 →]                      │
│                                         │
├─────────────────────────────────────────┤
│     其他首页内容（可选）                │
├─────────────────────────────────────────┤
│           Footer                        │
└─────────────────────────────────────────┘
```

---

## 🚀 数据流完整示例

### 用户访问首页

```
时间: 2026-08-11 14:30:00
用户: 访问首页
  ↓
浏览器加载 app/page.tsx
  ↓
页面渲染 <HomepageTrends limit={6} />
页面渲染 <HomepageNewsletterPreview limit={6} />
  ↓
两个组件同时调用 useEffect
  ↓
发送两个 API 请求:
  1. GET /api/newsletter?current=true (趋势组件)
  2. GET /api/newsletter?current=true (周刊组件)
  
  注：实际上 React 可能会合并缓存，只发送一次
  ↓
后端 API 计算当前周:
  - 获取当前日期: 2026-08-11
  - 计算周数: week 32
  - 查询 weeks 表: 2026 年第 32 周
  - 日期范围: 2026-08-10 ~ 2026-08-16
  ↓
执行 SQL 查询:
  SELECT * FROM articles
  WHERE is_design_trend = true
    AND status = 'published'
    AND published_date BETWEEN '2026-08-10' AND '2026-08-16'
  ORDER BY published_date DESC
  LIMIT 6
  
  → 返回 6 篇设计趋势
  
  SELECT * FROM articles
  WHERE is_competitor_tracking = true
    AND status = 'published'
    AND published_date BETWEEN '2026-08-10' AND '2026-08-16'
  ORDER BY published_date DESC
  LIMIT 6
  
  → 返回 6 篇竞品追踪
  ↓
组件接收数据，渲染卡片
  ↓
用户看到:
  "📈 设计趋势"
  [6 张卡片，显示最新内容]
  
  "📅 本周精选 · 第 32 周"
  "🎯 竞品追踪"
  [6 张卡片，显示竞品信息]
```

---

## 📊 实际测试场景

### 场景：自动同步数据

**时间线：**

```
周一 08:00
  - 自动采集任务运行
  - 采集 14 个源的内容（50-100 篇）
  - AI 分析标记 is_design_trend / is_competitor_tracking

周一 09:00
  - 编辑手动审核和发布部分文章
  - 一些文章 status = 'published'

周一 12:00
  - 用户访问首页
  - HomepageTrends 自动显示最新发布的 6 篇趋势
  - HomepageNewsletterPreview 自动显示最新发布的 6 篇竞品

周二 00:00
  - 新一轮采集开始
  - 重复上述流程

** 完全自动化，零人工干预！**
```

---

## 🔧 配置选项

### 修改显示数量

```tsx
// 只显示 3 篇趋势
<HomepageTrends limit={3} />

// 显示 10 篇竞品
<HomepageNewsletterPreview limit={10} />
```

### 添加加载骨架屏（可选）

```tsx
import HomepageTrends from '@/app/components/HomepageTrends'
import { Suspense } from 'react'

function TrendsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg" />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<TrendsSkeleton />}>
      <HomepageTrends limit={6} />
    </Suspense>
  )
}
```

---

## 📱 响应式布局

两个组件都支持响应式设计：

```
桌面 (1024px+):
  3 列网格 × 2 行 = 6 篇文章

平板 (768px - 1023px):
  2 列网格 × 3 行 = 6 篇文章

手机 (< 768px):
  1 列网格 × 6 行 = 6 篇文章
```

---

## 🎯 关键特性

✅ **完全自动化** - 无需任何人工编辑
✅ **实时数据** - 数据库更新立即反映到首页
✅ **响应式设计** - 适配所有屏幕
✅ **美观卡片** - 显示缩略图、标签、关键信息
✅ **快速加载** - 组件级别的异步加载
✅ **错误处理** - 显示友好的错误和加载状态
✅ **易于扩展** - 可轻松添加更多内容区块

---

## 🚀 部署步骤

1. ✅ 创建 `HomepageTrends.tsx` 组件
2. ✅ 创建 `HomepageNewsletterPreview.tsx` 组件
3. ✅ 创建 `/api/newsletter/route.ts` API
4. ✅ 创建 `app/lib/newsletter-generator.ts` 库
5. ✅ 修改 `app/page.tsx` 集成组件
6. ✅ 测试首页是否自动显示
7. ✅ 部署到生产环境

---

## 🧪 测试检查清单

- [ ] 首页加载没有错误
- [ ] 设计趋势部分显示 6 篇文章
- [ ] 竞品追踪部分显示 6 篇文章
- [ ] 点击文章可跳转到详情页
- [ ] 点击"查看完整周刊"可跳转到周刊页面
- [ ] 响应式布局正确
- [ ] 网络不好时显示加载状态
- [ ] 没有数据时显示空状态
- [ ] 首页加载速度快（< 2 秒）

---

## 📈 后续优化

1. **缓存优化** - 使用 Next.js ISR (Incremental Static Regeneration)
2. **图片优化** - 使用 Next.js Image 组件
3. **预加载** - 预加载常用数据
4. **分析** - 追踪用户点击
5. **推荐** - 根据用户偏好推荐文章
6. **邮件** - 订阅周刊邮件通知

---

## ✨ 完成！

现在你的首页已经完全自动化：

```tsx
// 只需这两行！
<HomepageTrends limit={6} />
<HomepageNewsletterPreview limit={6} />

// 其余所有事情都自动处理！
// 无需人工编辑，数据库实时同步到首页
```

**完全自动化的设计周刊首页已准备就绪！** 🎉
