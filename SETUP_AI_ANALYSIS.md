# Design Radar AI 内容分析系统 - 快速上手指南

## ⚡ 5 分钟快速开始

### 第一步：配置环境变量

编辑 `.env.local`：

```env
# Claude AI 分析服务
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

**获取 API 密钥：**
- Anthropic: https://console.anthropic.com/
- Supabase: Supabase 项目设置 > API

---

### 第二步：数据库迁移

在 Supabase SQL Editor 中执行：

```sql
-- 复制 supabase/migrations/003_add_ai_analysis_fields.sql 的内容
-- 或直接在 SQL Editor 中运行以下命令
```

执行后查看结果：

```sql
-- 验证字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles'
ORDER BY ordinal_position;
```

---

### 第三步：安装依赖

```bash
pnpm add @anthropic-ai/sdk
```

---

### 第四步：测试 API

#### 测试 1：纯分析（不入库）

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Figma 推出了新的 AI 生成设计功能，设计师可以输入自然语言描述快速生成界面初稿。这项功能支持实时协作，预计提高设计效率 50%。"
  }'
```

**响应：**
```json
{
  "success": true,
  "data": {
    "title": "Figma 推出 AI 生成设计功能",
    "summary": "使用 AI 辅助快速生成界面设计初稿",
    "focus": ["AI 生成初稿", "效率提升 50%", "实时协作增强"],
    "inspiration": ["智能硬件 UI 自动生成", "AI 在设计领域的应用", "人机协作设计流程"],
    "tags": ["AI", "Figma", "生成设计", "效率工具"],
    "category": "design_trends"
  }
}
```

#### 测试 2：采集并入库

```bash
curl -X POST http://localhost:3000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Figma Blog",
    "title": "Introducing Figma AI",
    "url": "https://figma.com/blog/...",
    "content": "Figma 推出了新的 AI 生成设计功能...",
    "image": "https://example.com/image.png",
    "publishedAt": "2026-08-11T10:00:00Z"
  }'
```

**响应：**
```json
{
  "success": true,
  "message": "内容已成功采集并分析",
  "data": {
    "article": {
      "id": "550e8400-e29b-41d4-a716-...",
      "title": "Introducing Figma AI",
      "description": "使用 AI 辅助快速生成界面设计初稿",
      ...
    },
    "analyzedContent": { ... }
  }
}
```

---

## 📚 详细文档

- `AI_CONTENT_ANALYSIS.md` - 系统完整架构
- `DATABASE_EXTENSIONS.md` - 数据库字段和查询
- `app/lib/ai-analyzer.ts` - AI 分析器源代码
- `app/lib/content-collector.ts` - 采集器源代码

---

## 🎯 常用操作

### 操作 1：分析单条内容（预览）

**使用场景：** 用户粘贴内容，预览分析结果

```typescript
// 在组件中
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: userInput })
})

const result = await response.json()
// 显示预览结果，让用户确认后再入库
```

---

### 操作 2：采集外部资讯

**使用场景：** 从各个源自动采集，AI 分析后入库

```bash
# 采集 Figma Blog 最新文章并分析入库
curl -X POST http://localhost:3000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Figma Blog",
    "title": "...",
    "url": "https://figma.com/blog/...",
    "content": "...",
    "image": "..."
  }'
```

---

### 操作 3：批量处理

**使用场景：** 处理多条内容（例如：周收集）

```bash
curl -X PUT http://localhost:3000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      { "source": "Figma Blog", "title": "...", "url": "...", "content": "..." },
      { "source": "Google Design", "title": "...", "url": "...", "content": "..." },
      { "source": "Dezeen", "title": "...", "url": "...", "content": "..." }
    ]
  }'
```

---

### 操作 4：查询设计趋势

```sql
-- 查询已发布的设计趋势
SELECT 
  id,
  title,
  description,
  focus_points,
  inspiration_points,
  source,
  published_date
FROM articles
WHERE is_design_trend = true
  AND status = 'published'
ORDER BY published_date DESC
LIMIT 10;
```

---

### 操作 5：在前端使用

```typescript
// app/lib/queries.ts
import { supabase } from './supabase'

export async function getDesignTrends() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      description,
      image_url,
      focus_points,
      inspiration_points,
      source,
      published_date,
      article_tags (
        tags (name)
      )
    `)
    .eq('is_design_trend', true)
    .eq('status', 'published')
    .order('published_date', { ascending: false })
    .limit(10)

  return articles
}
```

---

## 🚀 自动化部署

### Vercel Cron Job（每天自动采集）

创建 `app/api/cron/collect/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { processBatch, RawContent } from '@/app/lib/content-collector'

export async function GET(request: NextRequest) {
  // 验证请求来自 Vercel Cron
  const authorization = request.headers.get('authorization')
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // TODO: 从各个源采集内容
    const contents: RawContent[] = [
      // 这里应该是从实际源采集的数据
    ]

    const results = await processBatch(contents)

    return NextResponse.json({
      success: true,
      message: `已处理 ${results.length} 条内容`,
      data: results
    })
  } catch (error) {
    console.error('Cron job 错误:', error)
    return NextResponse.json(
      { error: '处理失败' },
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
      "path": "/api/cron/collect",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## 🔍 调试

### 查看 API 响应日志

```bash
# 在 Next.js 开发服务器中查看日志
npm run dev
```

### 调试 Anthropic API

```typescript
// 在 ai-analyzer.ts 中添加日志
console.log('请求内容长度:', content.length)
console.log('AI 响应:', responseText)
console.log('解析后的 JSON:', analysisResult)
```

### 检查数据库

```sql
-- 查看最新入库的文章
SELECT id, title, source, focus_points, created_at
FROM articles
ORDER BY created_at DESC
LIMIT 5;

-- 统计按类别
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN is_design_trend THEN 1 ELSE 0 END) as trends,
  SUM(CASE WHEN is_competitor_tracking THEN 1 ELSE 0 END) as competitors
FROM articles;
```

---

## ⚠️ 常见问题

### Q: API 返回 401/403 错误

**A:** 检查环境变量是否正确配置
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx (不是 Bearer token)
```

---

### Q: JSON 解析失败

**A:** Claude 响应可能不是有效 JSON，检查日志中的实际响应

添加错误处理：
```typescript
try {
  const json = JSON.parse(jsonMatch[0])
} catch (e) {
  console.error('JSON 解析错误:', e)
  console.error('原始内容:', jsonMatch[0])
}
```

---

### Q: 标签未关联成功

**A:** 检查标签是否存在或正确创建

```sql
-- 检查标签
SELECT * FROM tags WHERE name = 'AI';

-- 检查关联
SELECT * FROM article_tags 
WHERE article_id = 'your-article-id';
```

---

### Q: 性能太慢

**A:** 
- 检查网络延迟
- 使用批量处理而不是逐条处理
- 添加超时处理

```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 30000)

try {
  const response = await fetch('/api/analyze', {
    signal: controller.signal
  })
} finally {
  clearTimeout(timeout)
}
```

---

## 📊 监控指标

建议监控：
- API 响应时间
- AI 分析成功率
- 每天采集数量
- 文章发布比例

---

## ✅ 检查清单

- [ ] Anthropic API Key 已配置
- [ ] Supabase 环境变量已设置
- [ ] 数据库迁移已执行
- [ ] 依赖已安装 (@anthropic-ai/sdk)
- [ ] /api/analyze 端点可访问
- [ ] /api/collect 端点可访问
- [ ] 测试数据已成功入库
- [ ] 前端可正确查询和显示
- [ ] 自动化任务已配置（可选）

---

## 🎯 后续步骤

1. ✅ 完成基础设置
2. 🔄 集成各个内容源爬虫
3. 🔄 添加编辑审核界面
4. 🔄 设置定时采集任务
5. 🔄 添加邮件通知
6. 🔄 部署到生产环境

---

**现在系统已完全就绪！开始采集和分析你的第一条内容吧！** 🚀
