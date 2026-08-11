# GitHub Actions 工作流

## weekly.yml

每周一 08:00 UTC 自动执行的设计周刊生成工作流。

### 工作流程
1. 检出代码并安装依赖
2. 从 14 个设计资讯源采集内容
3. 通过 Claude AI 分析内容
4. 保存到 Supabase 数据库
5. 构建 Next.js 项目
6. 自动部署到 Vercel

### 环境变量
- ANTHROPIC_API_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY
- VERCEL_TOKEN
- VERCEL_PROJECT_ID
- VERCEL_ORG_ID

### 输出
- logs/collected-content.json
- logs/analyzed-content.json
- logs/save-results.json

详见: GITHUB_ACTIONS_GUIDE.md
