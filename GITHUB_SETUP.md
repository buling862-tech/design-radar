# GitHub Actions 快速设置 (10 分钟)

## ⚡ 5 步快速配置

### Step 1: 配置 Secrets (3 分钟)

打开 GitHub 仓库 → Settings → Secrets and variables → Actions

添加以下 secrets:

```
ANTHROPIC_API_KEY
  值: sk-ant-xxxxxxxxxxxxx
  来源: https://console.anthropic.com/

SUPABASE_URL
  值: https://your-project.supabase.co
  来源: Supabase 项目设置

SUPABASE_ANON_KEY
  值: your-anon-key
  来源: Supabase 项目设置 → API

SUPABASE_SERVICE_KEY
  值: your-service-key
  来源: Supabase 项目设置 → API

VERCEL_TOKEN
  值: your-vercel-token
  来源: Vercel 设置 → Tokens

VERCEL_PROJECT_ID
  值: your-project-id
  来源: Vercel 项目设置

VERCEL_ORG_ID
  值: your-org-id
  来源: Vercel 组织设置
```

### Step 2: 提交代码 (1 分钟)

```bash
cd /Users/bulling/Documents/设计周刊网站
git add .
git commit -m "feat: add GitHub Actions automation"
git push origin main
```

### Step 3: 验证工作流 (1 分钟)

1. 打开 GitHub 仓库
2. 点击 "Actions" 标签
3. 应该看到 "Weekly Newsletter Generation" 工作流

### Step 4: 手动测试 (5 分钟)

1. 点击 "Weekly Newsletter Generation"
2. 点击 "Run workflow" 按钮
3. 选择 "main" 分支
4. 点击 "Run workflow"
5. 等待运行完成（约 5 分钟）

### Step 5: 检查结果

1. 点击运行记录
2. 查看各步骤日志
3. 下载 artifacts (logs)
4. 验证数据是否正确

---

## 🔍 如何查看运行日志

### 实时查看
1. Actions → 选择工作流 → 点击正在运行的任务
2. 在 "Build output" 中查看实时日志

### 查看步骤日志
- 点击各个步骤（Collect content, Analyze content, 等）
- 展开查看详细日志

### 下载完整日志
1. 运行完成后，点击 "Artifacts" 部分
2. 下载 "workflow-logs.zip"
3. 解压后查看 logs/ 目录中的 JSON 文件

---

## ⏰ 执行时间

第一次运行大约需要：
- 安装依赖: 1-2 分钟
- 采集: 2-3 分钟
- 分析: 3-5 分钟
- 保存: 1-2 分钟
- 构建: 2-3 分钟
- 部署: 2-3 分钟

**总计: 11-18 分钟**

---

## 📊 工作流状态

- ✅ **成功** (绿色) - 一切正常
- ❌ **失败** (红色) - 查看日志找出原因
- ⏳ **运行中** (黄色) - 耐心等待

---

## 🚨 常见错误

### 错误 1: "ANTHROPIC_API_KEY not found"
**解决:** 检查 Secrets 中是否添加了 ANTHROPIC_API_KEY

### 错误 2: "Supabase connection failed"
**解决:** 
- 检查 SUPABASE_URL 是否正确
- 检查 SERVICE_KEY 权限是否足够

### 错误 3: "Vercel deployment failed"
**解决:**
- 检查 VERCEL_TOKEN 是否有效
- 检查 PROJECT_ID 是否正确

### 错误 4: "Network timeout"
**解决:**
- 稍后重新运行
- 检查网络连接

---

## 📈 监控工作流

### 添加状态徽章

在 README.md 中添加:
```markdown
![Weekly Newsletter](https://github.com/YOUR_USERNAME/design-radar/actions/workflows/weekly.yml/badge.svg)
```

### 设置通知

1. GitHub Settings → Notifications
2. 选择 "Actions" 通知方式
3. 失败时自动通知

---

## 🎯 定时执行说明

工作流配置为：
```
每周一 08:00 UTC (北京时间周一 16:00)
```

如需修改时间，编辑 `.github/workflows/weekly.yml`:

```yaml
schedule:
  - cron: '0 8 * * 1'  # 改为你想要的时间
```

Cron 时间参考:
```
08:00 UTC = 北京时间 16:00 (周一下午)
00:00 UTC = 北京时间 08:00 (周一早上)
12:00 UTC = 北京时间 20:00 (周一晚上)
```

---

## ✅ 成功标志

工作流完成后，你应该看到:

1. ✅ 所有步骤都通过 (绿色)
2. ✅ logs 目录中有 3 个 JSON 文件
   - collected-content.json
   - analyzed-content.json
   - save-results.json
3. ✅ Supabase 中有新的 articles 记录
4. ✅ Vercel 上的网站已自动部署
5. ✅ 首页显示最新的周刊

---

## 🎊 完成！

现在你的系统已完全自动化：

```
GitHub Actions
     ↓
每周一自动运行
     ↓
采集 → 分析 → 保存 → 部署
     ↓
完成！网站自动更新！
```

**从现在开始，你不需要做任何事情，一切都自动进行！** 🚀

---

下一次周刊将在下周一自动生成。祝贺你完成了一个完全自动化的系统！🎉
