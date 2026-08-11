# Design Radar 设置指南

## 项目初始化（在网络环境下执行）

### 方案 1：使用 create-next-app（推荐）

```bash
# 创建新项目
npx create-next-app@latest design-radar --typescript --tailwind --app --eslint

# 进入项目目录
cd design-radar

# 安装额外依赖
npm install @supabase/supabase-js lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot class-variance-authority tailwind-merge
```

### 方案 2：手动设置（已在项目中进行）

当前项目已包含所有必要的配置文件：

1. **package.json** - 项目依赖定义
2. **tsconfig.json** - TypeScript 配置
3. **next.config.js** - Next.js 配置
4. **tailwind.config.ts** - Tailwind CSS 配置
5. **postcss.config.js** - PostCSS 配置
6. **app/** - Next.js 应用目录结构

## 本地开发环境配置

### 1. 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
# 或使用 pnpm
pnpm install
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```bash
cp .env.local .env.local
```

编辑 `.env.local`，填入 Supabase 凭证：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 3. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## Supabase 数据库配置

### 1. 创建 Supabase 项目

访问 [supabase.com](https://supabase.com) 创建新项目。

### 2. 初始化数据库表

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 创建 design_projects 表
CREATE TABLE IF NOT EXISTS design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0
);

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 comments 表
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES design_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 likes 表
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES design_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_projects_author ON design_projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON design_projects(category);
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_project ON likes(project_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
```

### 3. 设置行级安全性 (RLS)

```sql
-- 启用 RLS
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- design_projects 表的 RLS 策略
CREATE POLICY "Everyone can read projects"
  ON design_projects FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own projects"
  ON design_projects FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own projects"
  ON design_projects FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own projects"
  ON design_projects FOR DELETE
  USING (auth.uid() = author_id);

-- comments 表的 RLS 策略
CREATE POLICY "Everyone can read comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- likes 表的 RLS 策略
CREATE POLICY "Everyone can read likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 项目结构说明

```
design-radar/
├── app/
│   ├── components/          # React 组件
│   │   ├── Header.tsx       # 顶部导航栏
│   │   ├── Hero.tsx         # 英雄区域
│   │   ├── DesignCards.tsx  # 设计卡片组件
│   │   └── Sidebar.tsx      # 侧边栏
│   ├── lib/
│   │   └── supabase.ts      # Supabase 客户端配置
│   ├── styles/
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页
│   └── globals.css          # 全局样式
├── public/                  # 静态资源
├── .env.local               # 环境变量（不提交到版本控制）
├── .gitignore               # Git 忽略规则
├── .eslintrc.json           # ESLint 配置
├── tailwind.config.ts       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
├── next.config.js           # Next.js 配置
├── postcss.config.js        # PostCSS 配置
├── package.json             # 项目依赖
└── README.md                # 项目说明

```

## 构建和部署

### 生产构建

```bash
npm run build
npm start
```

### 部署到 Vercel

1. 连接 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署

### 部署到其他平台

本项目可以部署到任何支持 Node.js 的平台：
- Netlify
- AWS Amplify
- Google Cloud Run
- Azure App Service
- 自托管服务器

## 常见问题

### Q: 为什么网络请求失败？
A: 检查 Supabase 配置和网络连接。确保 `.env.local` 中的 API URL 和 API Key 正确。

### Q: 如何添加新的 UI 组件？
A: 项目已集成 shadcn/ui，可以运行 `npx shadcn-ui@latest add <component>` 添加更多组件。

### Q: 如何自定义样式？
A: 修改 `tailwind.config.ts` 来定制设计系统。所有组件使用 Tailwind Classes。

## 下一步开发

- [ ] 用户认证系统（注册/登录/登出）
- [ ] 用户个人资料页面
- [ ] 上传设计作品功能
- [ ] 高级搜索和筛选
- [ ] 用户关注系统
- [ ] 消息和通知系统
- [ ] 暗色主题支持
- [ ] PWA 支持
- [ ] 单元测试和 E2E 测试
- [ ] 性能优化

## 支持

如有问题，请通过以下方式联系：
- 提交 Issue
- 查看文档
- 联系开发者
