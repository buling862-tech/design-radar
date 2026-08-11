# 内容收集系统

## 📁 目录结构

```
app/lib/collect/
├── collect.ts              # 主收集脚本
├── parsers/                # 各源的解析器
│   ├── figma.ts           # Figma Blog
│   ├── google.ts          # Google Design
│   ├── apple.ts           # Apple Developer
│   ├── dezeen.ts          # Dezeen
│   ├── wallpaper.ts       # Wallpaper*
│   ├── ux-collective.ts   # UX Collective
│   ├── nngroup.ts         # NNGroup
│   ├── openai.ts          # OpenAI
│   ├── anthropic.ts       # Anthropic
│   ├── perplexity.ts      # Perplexity
│   ├── adobe.ts           # Adobe
│   ├── behance.ts         # Behance
│   └── dribbble.ts        # Dribbble
└── README.md              # 本文件
```

## 🔄 处理流程

### 步骤 1: 读取 RSS/抓取
- 使用 `rss-parser` 读取 RSS 源
- 或使用 `cheerio` 网页爬虫抓取
- 获取文章列表

### 步骤 2: 抓正文
- 访问原文 URL
- 解析完整的文章内容
- 提取真实的文章正文

### 步骤 3: 提取标题
- 从 RSS 或页面 H1/H2 标签获取
- 清理和规范化标题
- 限制长度 ≤ 200 字符

### 步骤 4: 提取图片
- 查找文章中的首张图片
- 验证图片 URL
- 保存为完整 URL

### 步骤 5: 生成 Markdown
- 格式化为标准 Markdown
- 包含标题、图片、内容、链接
- 便于存储和显示

### 步骤 6: 存入数据库
- 去重检查（按 URL）
- 计算质量分
- 预测标签
- 插入 `raw_articles` 表

## 🚀 运行方式

### 一次性运行
```bash
npx ts-node app/lib/collect/collect.ts
```

### 定时运行（每小时）
```bash
# 使用 node-cron
npm run collect:schedule

# 或使用系统 cron
0 * * * * cd /path/to/project && npx ts-node app/lib/collect/collect.ts
```

### 指定源运行
```typescript
import { Figma } from './parsers/figma'

const articles = await Figma.fetch()
```

## 📝 Parser 模板

每个 Parser 需要实现：

```typescript
interface Article {
  title: string
  url: string
  content: string
  image?: string
  published_date: Date
}

export async function fetch(): Promise<Article[]> {
  // 实现采集逻辑
}
```

## 🔐 环保和依赖

### 依赖包
```json
{
  "rss-parser": "^3.12.0",
  "cheerio": "^1.0.0-rc.12",
  "@supabase/supabase-js": "^2.43.4"
}
```

### 环境变量
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📊 输出示例

```json
{
  "source_id": 1,
  "source_name": "Figma Blog",
  "title": "Design systems at scale",
  "url": "https://figma.com/blog/...",
  "content": "When building a design system...",
  "image": "https://...",
  "markdown": "# Design systems at scale\n\n![](https://...)...",
  "quality_score": 0.92,
  "tag_predictions": ["设计系统", "UI设计"],
  "status": "pending"
}
```

## 🛠️ 添加新源

1. 创建新文件 `parsers/source-name.ts`
2. 实现 `fetch()` 函数
3. 在 `collect.ts` 中导入并添加到 SOURCES
4. 运行测试

示例：
```typescript
// parsers/my-source.ts
export async function fetch(): Promise<Article[]> {
  // 实现
}

// collect.ts
import * as MySource from './parsers/my-source'

const SOURCES: Source[] = [
  { id: 15, name: 'My Source', parser: MySource, priority: 3, enabled: true }
]
```

## 📈 统计和监控

运行后会输出：
```
📊 采集统计:
   总计: 50
   成功: 48
   重复: 2
   保存: 48
   失败: 0
```

## ⚠️ 最佳实践

1. **遵守 robots.txt** - 检查源的爬虫规则
2. **设置 User-Agent** - 声明自己的爬虫身份
3. **限制并发** - 避免对源造成压力
4. **错误处理** - 单个源失败不应中断整个流程
5. **缓存** - 避免重复抓取相同文章

## 🔍 调试

启用调试模式：
```typescript
process.env.DEBUG = 'collect:*'
```

查看详细日志：
```bash
DEBUG=collect:* npx ts-node app/lib/collect/collect.ts
```

---

现在所有 14 个源的 Parser 都准备好了！ 🎉
