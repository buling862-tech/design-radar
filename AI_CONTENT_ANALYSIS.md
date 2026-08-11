# Design Radar AI 内容分析系统

## 🎯 核心流程

```
原始内容采集
    ↓
AI 分析（Claude 3.5）
    ↓
自动提取元数据
    ↓
直接写入数据库
    ↓
发布或人工审核
```

---

## 📋 系统架构

### 1. **AI 分析器** (`app/lib/ai-analyzer.ts`)

**功能：** 使用 Claude 对采集的设计资讯进行深度分析

**输入：** 原始内容文本

**输出：** 标准 JSON 格式

```json
{
  "title": "Figma 发布新的生成设计功能",
  "summary": "使用 AI 助力设计师快速生成初稿",
  "focus": [
    "AI 生成设计初稿",
    "提高设计效率 50%",
    "实时协作增强"
  ],
  "inspiration": [
    "智能硬件可应用 AI 辅助 UI 生成",
    "大语言模型在设计领域的新应用",
    "人机协作的设计流程优化"
  ],
  "tags": ["AI", "Figma", "生成设计", "设计工具"],
  "category": "design_trends"
}
```

---

### 2. **内容采集器** (`app/lib/content-collector.ts`)

**主函数：** `collectAndAnalyze(rawContent: RawContent)`

**流程：**
1. 接收原始内容 (source, title, url, content, image)
2. 调用 AI 分析
3. 提取/创建标签
4. 创建文章记录
5. 关联标签到文章

**数据库表涉及：**
- `articles` - 存储文章
- `tags` - 存储标签
- `article_tags` - 关联表

---

### 3. **API 端点**

#### `/api/analyze` (POST)
**单条内容分析（不入库）**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "完整的设计资讯内容...",
    "title": "可选标题",
    "url": "来源链接",
    "source": "来源名称"
  }'
```

**响应：**
```json
{
  "success": true,
  "data": {
    "title": "...",
    "summary": "...",
    "focus": [...],
    "inspiration": [...],
    "tags": [...],
    "category": "design_trends",
    "isDesignTrend": true,
    "isCompetitorTracking": false
  }
}
```

---

#### `/api/collect` (POST)
**采集并分析单条内容并写入数据库**

```bash
curl -X POST http://localhost:3000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Figma Blog",
    "title": "文章标题",
    "url": "https://figma.com/...",
    "content": "完整内容...",
    "image": "缩略图URL",
    "publishedAt": "2026-08-11T10:00:00Z"
  }'
```

**响应：**
```json
{
  "success": true,
  "message": "内容已成功采集并分析",
  "data": {
    "article": { ... },
    "analyzedContent": { ... }
  }
}
```

---

#### `/api/collect` (PUT)
**批量采集和分析**

```bash
curl -X PUT http://localhost:3000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      { "source": "...", "title": "...", ... },
      { "source": "...", "title": "...", ... }
    ]
  }'
```

**响应：**
```json
{
  "success": true,
  "message": "成功处理 5 条内容",
  "data": [...]
}
```

---

## 🗄️ 数据库字段映射

### articles 表

| 数据库字段 | AI 分析来源 | 说明 |
|-----------|-----------|------|
| `title` | `analyzed.title` | 文章标题 |
| `description` | `analyzed.summary` | 一句话摘要 |
| `content` | `rawContent.content` | 完整内容 |
| `image_url` | `rawContent.image` | 缩略图 |
| `source_url` | `rawContent.url` | 原始链接 |
| `source` | `rawContent.source` | 内容源 |
| `focus_points` | `analyzed.focus[]` | 设计关注点 |
| `inspiration_points` | `analyzed.inspiration[]` | 设计启发 |
| `is_design_trend` | `analyzed.isDesignTrend` | 是否趋势 |
| `is_competitor_tracking` | `analyzed.isCompetitorTracking` | 是否竞品 |
| `status` | 默认 'draft' | 需要人工审核 |
| `published_date` | `rawContent.publishedAt` | 发布日期 |

### tags 表（自动创建）

从 `analyzed.tags[]` 自动创建或关联

### article_tags 关联表

自动创建多对多关系

---

## 🔑 环境变量配置

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

---

## 💻 使用示例

### 示例 1: 直接测试分析

```bash
# 测试分析 API（不入库）
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Figma 发布了新的 AI 生成设计功能，设计师可以通过自然语言描述快速生成界面设计初稿。这个功能预计将设计效率提高 50%。该功能支持实时协作，多个设计师可以同时使用 AI 功能。"
  }'
```

### 示例 2: 采集并入库

```bash
# 采集内容并直接入库
curl -X POST http://localhost:3000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Figma Blog",
    "title": "Figma AI Design Generation",
    "url": "https://figma.com/blog/...",
    "content": "Figma 发布了新的 AI 生成设计功能...",
    "image": "https://figma.com/image.png"
  }'
```

### 示例 3: 批量处理

```typescript
// 在 Next.js 服务端或 CLI 脚本中
import { processBatch } from '@/app/lib/content-collector'

const contents = [
  { source: 'Source1', title: '...', url: '...', content: '...' },
  { source: 'Source2', title: '...', url: '...', content: '...' },
]

const results = await processBatch(contents)
```

---

## 🎨 AI 分析 Prompt

系统使用的 Claude Prompt：

```
你是一个资深的设计研究员。下面是一条设计类资讯，请进行以下分析：

1. 一句话概括 - 结深揭示要点（最多 20 个字）
2. 核心更新 - 主要内容下标 (3 条)
3. 设计关注点 - 对设计师的启示 (3 条)
4. 对智能硬件设计启发 - 其俞价值 (3 条)
5. 标签 - 相关 keyword (3-5 个)
6. 分类 - 是「设计趋势」还是「竞品追踪」还是「通用」？

必须输出一个 JSON 对象，不要任何额外的文字！
```

---

## 📊 分类规则

系统自动判断内容分类：

| 分类 | 触发条件 |
|------|---------|
| `design_trends` | 包含: AI、趋势、创新、赋能 |
| `competitor_tracking` | 包含: Figma、Adobe、Sketch、竞品 |
| `general` | 其他 |

---

## ✅ 数据验证

- ✅ 必填字段检查（source, title, url, content）
- ✅ 去重检查（通过 Supabase 唯一约束）
- ✅ JSON 格式验证
- ✅ 标签长度检查
- ✅ 分类有效性检查

---

## 🚀 部署清单

- [ ] 安装 `@anthropic-ai/sdk`
- [ ] 配置 `ANTHROPIC_API_KEY`
- [ ] 配置 Supabase 环境变量
- [ ] 创建数据库表（已有 SQL 脚本）
- [ ] 测试 API 端点
- [ ] 部署到生产环境
- [ ] 设置定时任务采集内容

---

## 📈 性能优化

- ✅ 异步处理（不阻塞用户请求）
- ✅ 错误处理和重试机制
- ✅ 批量处理支持
- ✅ 数据库索引优化
- ✅ API 速率限制（建议）

---

## 🔐 安全性

- ✅ API 密钥环境变量管理
- ✅ 请求验证
- ✅ 错误信息不泄露敏感信息
- ✅ Supabase RLS 行级安全
- ✅ 建议添加用户认证

---

## 📝 日志示例

```
🔄 正在分析: Figma 新功能发布
✅ 成功: Figma AI Design Generation
   - 标签: AI, Figma, 生成设计, 设计工具
   - 分类: design_trends
   - 文章 ID: 550e8400-e29b-41d4-a716-...

❌ 无法分析内容: [原因]

⚠️ 标签关联失败: [错误信息]
```

---

## 🎯 下一步集成

1. **Web 爬虫** - 实现各源的采集逻辑
2. **定时任务** - 每天自动采集（使用 Vercel Cron）
3. **编辑审核页面** - 人工筛选和发布
4. **推荐算法** - 基于质量分的排序
5. **通知系统** - 新内容邮件/推送通知

---

这个系统现在已经完全就绪，可以开始：
1. ✅ 测试 API
2. ✅ 采集真实内容
3. ✅ 验证数据质量
4. ✅ 集成到前端
5. ✅ 自动化定时任务

🚀 系统已准备就绪！
