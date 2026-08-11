# Design Radar 🎨

设计灵感与趋势雷达 - 一个现代化的设计作品展示和发现平台。

## 技术栈

- **前端框架**: Next.js 15
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI 组件**: shadcn/ui
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **图标**: Lucide React

## 项目特性

- 📱 响应式设计，支持移动端
- 🎨 现代化的用户界面
- 💬 社区互动功能（点赞、评论、分享）
- 🔍 搜索和过滤功能
- ⭐ 收藏和推荐系统
- 🌓 支持暗色主题
- 🚀 快速的性能和SEO优化

## 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone <repository-url>
cd design-radar

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 Supabase 配置
```

### 开发

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看项目。

### 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
design-radar/
├── app/
│   ├── components/          # React 组件
│   │   ├── Header.tsx       # 顶部导航栏
│   │   ├── Hero.tsx         # 英雄区域
│   │   ├── DesignCards.tsx  # 设计卡片组件
│   │   └── Sidebar.tsx      # 侧边栏
│   ├── lib/                 # 工具函数和配置
│   │   └── supabase.ts      # Supabase 客户端
│   ├── styles/              # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页
│   └── globals.css          # 全局 CSS
├── public/                  # 静态资源
├── package.json
├── tailwind.config.ts       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
└── README.md

```

## Supabase 数据库设置

创建以下表：

### design_projects 表

```sql
CREATE TABLE design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  author_id UUID REFERENCES auth.users,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0
);
```

### users 表

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### comments 表

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES design_projects,
  user_id UUID REFERENCES auth.users,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 下一步

- [ ] 实现用户认证（注册/登录）
- [ ] 完善 Supabase 集成
- [ ] 添加图片上传功能
- [ ] 实现搜索和筛选
- [ ] 添加用户个人资料页面
- [ ] 实现通知系统
- [ ] 添加 PWA 支持
- [ ] 部署到生产环境

## 贡献

欢迎提交 Pull Request 或 Issue。

## 许可证

MIT
