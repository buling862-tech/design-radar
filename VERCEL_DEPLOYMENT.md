# Vercel 部署指南

## 🎯 部署目标

将 Design Radar 设计周刊网站部署到 Vercel，实现全球访问和 CI/CD 自动部署。

---

## ⚡ 快速部署 (5 分钟)

### Step 1: 连接 GitHub (1 分钟)

1. 打开 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 授权 GitHub 账户
5. 选择 `design-radar` 仓库

### Step 2: 配置项目 (1 分钟)

- **Project Name**: `design-radar` (自动填充)
- **Framework**: `Next.js`
- **Root Directory**: `./` (default)

点击 "Continue"

### Step 3: 环境变量 (2 分钟)

添加环境变量：

```
NEXT_PUBLIC_SUPABASE_URL
  值: https://your-project.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
  值: your-anon-key

SUPABASE_SERVICE_KEY (可选)
  值: your-service-key
```

### Step 4: 部署 (1 分钟)

点击 "Deploy" 按钮

等待部署完成（通常 2-3 分钟）

---

## ✅ 部署成功标志

- ✅ Vercel 显示 "Deployment successful"
- ✅ 获得生产 URL (https://design-radar.vercel.app)
- ✅ 网站可正常访问
- ✅ 首页显示周刊内容

---

## 🔄 自动部署设置

### 推送代码自动部署

```bash
# 本地提交并推送
git add .
git commit -m "feat: deploy to Vercel"
git push origin main

# Vercel 会自动:
# 1. 检测到推送
# 2. 自动构建
# 3. 自动部署
```

### GitHub Actions + Vercel

在 `.github/workflows/weekly.yml` 中已配置：

```yaml
- name: Deploy to Vercel
  run: pnpm run deploy
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
```

每周自动部署！

---

## 🔑 获取必要的 Tokens 和 IDs

### 1. VERCEL_TOKEN

1. Vercel Dashboard → Settings → Tokens
2. 点击 "Create Token"
3. 输入 token 名称
4. 设置过期时间
5. 复制 token

### 2. VERCEL_PROJECT_ID

1. Vercel Dashboard → 选择项目
2. 打开 Settings → General
3. 查找 "Project ID"
4. 复制项目 ID

### 3. VERCEL_ORG_ID

1. Vercel Dashboard → Settings → Teams
2. 查看 Team ID (如果有组织)
3. 复制 ID

---

## 📋 部署前检查清单

- [ ] Next.js 项目能本地构建 (`npm run build`)
- [ ] 所有环境变量已配置
- [ ] Supabase 数据库已创建
- [ ] GitHub 仓库已推送到 main 分支
- [ ] package.json 中有正确的构建脚本

---

## 🚀 部署选项

### 选项 1: Vercel Web UI (推荐新手)

最简单的方式，直接在网页上操作。

### 选项 2: Vercel CLI (推荐开发者)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署 (开发环境)
vercel

# 部署到生产环境
vercel --prod
```

### 选项 3: GitHub Actions (推荐生产)

完全自动化，每周自动部署。

已在 `.github/workflows/weekly.yml` 中配置。

---

## 📊 部署架构

```
本地代码
     ↓
git push origin main
     ↓
GitHub 仓库
     ↓
Vercel 自动检测
     ↓
自动构建:
  - pnpm install
  - next build
  - next export (if needed)
     ↓
自动部署:
  - 上传到 Vercel CDN
  - 生成 URL
  - 设置域名
     ↓
全球访问！
```

---

## 🌐 自定义域名 (可选)

### 添加自定义域名

1. Vercel Dashboard → 项目 → Settings → Domains
2. 点击 "Add Domain"
3. 输入域名 (例: designradar.com)
4. 按照说明配置 DNS 记录
5. 等待验证 (通常 24 小时内)

### DNS 配置示例

```
记录类型: CNAME
名称: www
值: cname.vercel.app
```

或

```
记录类型: A
名称: @
值: 76.76.19.132
```

---

## 🔍 构建和部署日志

### 查看构建日志

1. Vercel Dashboard → 项目 → Deployments
2. 点击部署记录
3. 查看 "Build Logs"

### 常见构建错误

**错误: "Cannot find module"**
- 解决: `pnpm install` 依赖可能缺失

**错误: "NEXT_PUBLIC_* 未定义"**
- 解决: 检查环境变量是否正确配置

**错误: "Build failed"**
- 解决: 查看详细日志，通常是代码错误

---

## ⚙️ Vercel 高级配置

### vercel.json (项目根目录)

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install --frozen-lockfile",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

### 自定义构建脚本

在 `package.json` 中：

```json
{
  "scripts": {
    "build": "next build",
    "deploy": "vercel deploy --prod"
  }
}
```

---

## 🔐 环境变量管理

### 开发环境 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 生产环境 (Vercel)

1. Vercel Dashboard → Settings → Environment Variables
2. 添加:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
3. 点击 "Save and Redeploy"

---

## 📈 性能优化

### Next.js 优化

```json
// next.config.js
{
  "images": {
    "formats": ["image/avif", "image/webp"],
    "sizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  },
  "compress": true,
  "poweredByHeader": false
}
```

### Vercel 优化

- 自动 CDN 加速
- 自动 gzip 压缩
- 自动 Image Optimization
- 自动 Edge Caching

---

## 🎯 部署后检查

### 1. 访问网站

```
https://design-radar.vercel.app
```

### 2. 验证功能

- [ ] 首页加载正常
- [ ] 设计趋势显示
- [ ] 竞品追踪显示
- [ ] API 端点可访问
- [ ] 数据库连接正常

### 3. 检查性能

```bash
# 使用 Lighthouse
# Chrome DevTools → Lighthouse

# 或使用 vercel analytics
vercel analytics
```

---

## 🚨 常见问题

### Q: 部署失败怎么办？

A: 
1. 查看 Vercel 构建日志
2. 检查环境变量
3. 本地测试 `npm run build`
4. 查看 package.json 脚本

### Q: 网站访问很慢？

A:
1. 检查图片优化
2. 启用 Vercel Analytics
3. 检查 API 响应时间
4. 考虑使用 Edge Functions

### Q: 如何回滚到上一个版本？

A:
1. Vercel Dashboard → Deployments
2. 找到之前的部署
3. 点击 "Promote to Production"

### Q: 如何设置自定义域名？

A: 见上面"自定义域名"部分

---

## 📊 部署对比

| 方式 | 难度 | 速度 | 成本 | 推荐 |
|-----|------|------|------|------|
| Vercel Web UI | ⭐ 简单 | ⭐⭐⭐⭐⭐ 快 | 💰 免费 | ✅ 新手 |
| Vercel CLI | ⭐⭐ 中等 | ⭐⭐⭐⭐ 很快 | 💰 免费 | ✅ 开发者 |
| GitHub Actions | ⭐⭐⭐ 复杂 | ⭐⭐⭐ 中等 | 💰 免费 | ✅ 生产 |
| Docker | ⭐⭐⭐⭐ 很复杂 | ⭐⭐ 慢 | 💰💰 付费 | ❌ 不推荐 |

---

## ✅ 完整部署清单

### 前期准备
- [ ] GitHub 仓库已创建
- [ ] Supabase 项目已创建
- [ ] Supabase 数据库已迁移
- [ ] 环境变量已配置

### Vercel 部署
- [ ] Vercel 账户已创建
- [ ] 项目已连接到 GitHub
- [ ] 环境变量已添加
- [ ] 初次部署成功

### GitHub Actions 配置
- [ ] secrets 已配置
  - VERCEL_TOKEN
  - VERCEL_PROJECT_ID
  - VERCEL_ORG_ID
- [ ] 工作流已配置
- [ ] 手动测试成功

### 上线验证
- [ ] 网站可正常访问
- [ ] 首页显示周刊
- [ ] API 端点可用
- [ ] 性能测试通过

---

## 🎊 部署完成！

现在你的网站已部署到全球 CDN，可以在任何地方访问！

```
https://design-radar.vercel.app
```

**每周一，GitHub Actions 会自动：**
1. 采集最新内容
2. AI 分析
3. 保存数据库
4. 自动部署

**完全自动化！** 🚀

---

下一步建议：
1. ✅ 配置自定义域名
2. ✅ 设置 Vercel Analytics
3. ✅ 配置备份策略
4. ✅ 监控运行状态

**项目已准备好投入生产！** 🎉
