# GitHub Actions 自动化工作流程指南

## 🎯 核心概念

真正的自动化不在本地运行脚本，而是让 **GitHub 自动每周执行**！

```
每周一 08:00 UTC (北京时间周一 16:00)
         ↓
GitHub Actions 自动触发
         ↓
pnpm install (安装依赖)
         ↓
pnpm run collect (采集内容)
         ↓
pnpm run analyze (AI 分析)
         ↓
pnpm run save (保存数据库)
         ↓
pnpm run build (构建项目)
         ↓
vercel deploy --prod (部署到生产)
         ↓
完全自动化！无需人工干预！
```

---

## 📁 文件结构

```
.github/
├── workflows/
│   └── weekly.yml              # 工作流配置（每周自动执行）

scripts/
├── collect.ts                  # 采集脚本
├── analyze.ts                  # 分析脚本
└── save.ts                     # 保存脚本

package.json                    # NPM 脚本定义
```

---

## 🔧 工作流文件详解

### `.github/workflows/weekly.yml`

```yaml
name: Weekly Newsletter Generation

on:
  # 触发条件
  schedule:
    # 每周一 08:00 UTC (北京时间周一 16:00)
    - cron: '0 8 * * 1'
  
  # 允许手动触发
  workflow_dispatch:
```

**Cron 表达式说明：**
```
0 8 * * 1
│ │ │ │ └── 周一 (0=周日, 1=周一)
│ │ │ └──── 任意月份 (*)
│ │ └────── 任意日期 (*)
│ └──────── 08:00 UTC
└────────── 0 分钟
```

**时区对应：**
- 08:00 UTC = 北京时间 16:00 (周一下午 4 点)
- 00:00 UTC = 北京时间 08:00 (周一早上 8 点)

---

## 🚀 12 个工作步骤

### Step 1: 检出代码
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```
克隆最新的代码到运行环境

### Step 2: 设置 Node.js
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18.17'
```
安装指定版本的 Node.js

### Step 3: 安装 pnpm
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8
```
使用 pnpm 而不是 npm（更快、更稳定）

### Step 4: 安装依赖
```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```
安装 package.json 中的所有依赖

### Step 5: 采集内容 ⭐
```yaml
- name: Collect content from sources
  run: pnpm run collect
```
执行 `scripts/collect.ts`，从 14 个源采集资讯

### Step 6: AI 分析 ⭐
```yaml
- name: Analyze content with AI
  run: pnpm run analyze
```
执行 `scripts/analyze.ts`，通过 Claude AI 分析

### Step 7: 保存到数据库 ⭐
```yaml
- name: Save to database
  run: pnpm run save
```
执行 `scripts/save.ts`，将数据入库

### Step 8: 构建项目
```yaml
- name: Build project
  run: pnpm run build
```
Next.js 构建，生成生产版本

### Step 9: 部署到 Vercel
```yaml
- name: Deploy to Vercel
  run: pnpm run deploy
```
自动部署到 Vercel（生产环境）

### Step 10-12: 通知和日志
```yaml
- name: Send success notification
  # 成功时发送通知

- name: Send failure notification
  # 失败时发送通知

- name: Upload logs
  # 上传日志供查看
```

---

## 🔑 环境变量配置

GitHub Actions 需要以下密钥。在 Repository Settings 中配置：

### 1. Anthropic API
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### 2. Supabase
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 3. Vercel (部署)
```
VERCEL_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id
VERCEL_ORG_ID=your-org-id
```

### 配置步骤
1. 打开 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 输入名称和值
5. 点击 "Add secret"

---

## 📝 NPM 脚本

在 `package.json` 中定义：

```json
{
  "scripts": {
    "collect": "tsx scripts/collect.ts",
    "analyze": "tsx scripts/analyze.ts",
    "save": "tsx scripts/save.ts",
    "weekly": "pnpm run collect && pnpm run analyze && pnpm run save",
    "deploy": "vercel deploy --prod"
  }
}
```

**本地测试：**
```bash
pnpm run collect   # 只采集
pnpm run analyze   # 只分析
pnpm run save      # 只保存
pnpm run weekly    # 完整流程
```

---

## 📊 采集脚本 - `collect.ts`

```typescript
// 从 14 个源采集内容
const SOURCES = [
  { name: 'Figma Blog', url: '...' },
  { name: 'Google Design', url: '...' },
  // ... 12 个其他源
]

// 输出: logs/collected-content.json
```

**输出格式：**
```json
[
  {
    "source": "Figma Blog",
    "title": "新功能介绍",
    "url": "https://figma.com/...",
    "content": "完整内容",
    "image": "缩略图 URL",
    "publishedAt": "2026-08-11T10:00:00Z"
  }
]
```

---

## 🤖 分析脚本 - `analyze.ts`

```typescript
// 通过 Claude AI 分析每条采集的内容
// 输入: logs/collected-content.json
// 输出: logs/analyzed-content.json

// 分析内容：
// - 提取标题、摘要
// - 提取 focus_points (3 条)
// - 提取 inspiration_points (3 条)
// - 自动标签提取 (3-5 个)
// - 分类判断 (趋势/竞品/通用)
```

**输出格式：**
```json
[
  {
    "source": "Figma Blog",
    "title": "新功能介绍",
    "summary": "一句话摘要",
    "focus": ["关注点1", "关注点2", "关注点3"],
    "inspiration": ["启发1", "启发2", "启发3"],
    "tags": ["AI", "Figma", "协作"],
    "category": "design_trends",
    "isDesignTrend": true,
    "isCompetitorTracking": true,
    "url": "https://...",
    "image": "...",
    "publishedAt": "2026-08-11T10:00:00Z"
  }
]
```

---

## 💾 保存脚本 - `save.ts`

```typescript
// 将分析后的内容保存到 Supabase 数据库
// 输入: logs/analyzed-content.json
// 输出: logs/save-results.json

// 处理流程：
// 1. 为每篇文章创建 articles 记录
// 2. 自动创建标签 (tags 表)
// 3. 关联标签到文章 (article_tags 表)
// 4. 保存到 Supabase
```

**写入数据库字段：**
```
- title
- description (摘要)
- content
- image_url
- source_url
- source
- category_id
- status (已发布)
- published_date
- focus_points (数组)
- inspiration_points (数组)
- is_design_trend (布尔值)
- is_competitor_tracking (布尔值)
```

---

## ⏰ Cron 表达式速查

```
# 每周一 08:00 UTC
0 8 * * 1

# 每周一 00:00 UTC (早上 8 点 北京时间)
0 0 * * 1

# 每天 08:00 UTC
0 8 * * *

# 每天 00:00 UTC
0 0 * * *

# 每月 1 日 08:00 UTC
0 8 1 * *

# 工作日每天 08:00 UTC
0 8 * * 1-5
```

---

## 🔍 工作流监控

### 查看运行历史
1. 打开 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Weekly Newsletter Generation"
4. 查看运行历史

### 查看运行日志
1. 点击具体的运行
2. 点击 "Collect content from sources" 等步骤
3. 查看详细的执行日志

### 下载日志
1. 运行完成后，点击 "Artifacts"
2. 下载 "workflow-logs" 文件
3. 查看 `logs/collected-content.json` 等文件

---

## 🚨 常见问题

### Q: 如何手动触发工作流？
A: 
1. 点击 Actions → Weekly Newsletter Generation
2. 点击 "Run workflow"
3. 选择分支 (main)
4. 点击 "Run workflow"

### Q: 如何修改执行时间？
A: 编辑 `.github/workflows/weekly.yml`，修改 `cron` 表达式

### Q: 如何跳过部署？
A: 在提交信息中添加 `[skip ci]` 或 `[skip deploy]`

### Q: 如何查看错误？
A: Actions 标签 → 选择失败的运行 → 查看日志

### Q: 如何禁用工作流？
A: 在 weekly.yml 中将 `schedule` 注释掉或删除

---

## ✅ 检查清单

- [ ] 创建 `.github/workflows/weekly.yml`
- [ ] 创建 `scripts/collect.ts`
- [ ] 创建 `scripts/analyze.ts`
- [ ] 创建 `scripts/save.ts`
- [ ] 更新 `package.json` 添加脚本
- [ ] 在 GitHub 配置 secrets (ANTHROPIC_API_KEY 等)
- [ ] 测试手动触发工作流
- [ ] 验证日志输出
- [ ] 检查数据是否入库
- [ ] 验证部署是否成功

---

## 🎯 工作流完整时间线

```
周一 08:00 UTC (周一 16:00 北京时间)
     ↓
[1 分钟] 检出代码、安装依赖
     ↓
[3 分钟] 采集 50-100 篇资讯
     ↓
[5 分钟] AI 分析 (Claude)
     ↓
[2 分钟] 保存到数据库
     ↓
[3 分钟] 构建项目
     ↓
[2 分钟] 部署到 Vercel
     ↓
总耗时: 约 16 分钟

结果:
- 📰 50-100 篇新资讯已采集
- 🤖 全部 AI 分析完成
- 💾 全部入库到 Supabase
- 🚀 网站已自动部署

完全自动化！零人工干预！
```

---

## 🔗 相关文档

- `COMPLETE_AUTOMATION_GUIDE.md` - 整体自动化指南
- `SETUP_AI_ANALYSIS.md` - AI 系统配置
- `AUTOMATED_NEWSLETTER_SYSTEM.md` - 周刊系统

---

## 🎉 完成！

现在你拥有一个**完全自动化的内容系统**：

1. ✅ 每周自动采集
2. ✅ 每周自动分析
3. ✅ 每周自动入库
4. ✅ 每周自动部署

**无需任何人工干预！** 🚀

---

**建议：**
- 配置好 secrets 后，立即提交代码到 GitHub
- 手动触发一次工作流进行测试
- 监控首次运行日志
- 验证数据是否正确入库
- 检查网站是否正确部署

**然后就可以完全放心，让 GitHub 每周自动为你生成周刊！** 🎊
