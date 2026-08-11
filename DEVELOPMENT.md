# Design Radar - 开发指南

## 快速开始

### 环境要求
- Node.js 18.17+
- npm 9+ 或 pnpm 8+

### 本地开发

#### 1. 安装依赖
```bash
npm install
```

#### 2. 启动开发服务器
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

#### 3. 生产构建
```bash
npm run build
npm start
```

### 代码规范

#### TypeScript 严格模式
- 所有文件使用 `.tsx` 或 `.ts` 扩展名
- 组件必须有完整的类型定义
- 避免使用 `any` 类型

#### 组件编写规范
```tsx
interface Props {
  // 使用接口定义 props
  title: string
  onClick?: () => void
}

export default function MyComponent({ title, onClick }: Props) {
  return (
    <div onClick={onClick}>
      {title}
    </div>
  )
}
```

#### 样式编写
- 优先使用 Tailwind CSS 类
- 全局样式在 `globals.css` 中定义
- 使用 CSS Variables 支持深色模式

### 开发工作流

#### 添加新页面
1. 在 `app/` 下创建新目录
2. 创建 `page.tsx` 文件
3. 实现页面组件
4. 在 Header 中添加导航链接

#### 添加新组件
1. 在 `app/components/` 中创建文件
2. 使用 TypeScript 定义 Props
3. 添加适当的事件处理
4. 使用 Tailwind 样式

#### 更新 SEO
编辑 `app/layout.tsx` 中的 metadata，或在特定页面中使用 `generateMetadata`：

```tsx
export const metadata: Metadata = {
  title: '页面标题',
  description: '页面描述',
}
```

### 深色模式开发

使用 `useTheme` hook 获取当前主题：

```tsx
'use client'

import { useTheme } from '@/app/providers'

export default function MyComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      当前主题: {theme}
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  )
}
```

### 数据库集成

#### Supabase 配置
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 复制 API URL 和 Anon Key
4. 填入 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

#### 使用 Supabase
```tsx
import { supabase } from '@/app/lib/supabase'

// 获取数据
const { data, error } = await supabase
  .from('design_projects')
  .select('*')

// 插入数据
const { data, error } = await supabase
  .from('design_projects')
  .insert([{ title: '新项目' }])
```

### 部署

#### 部署到 Vercel（推荐）
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署

```bash
npm run build
```

#### 环境变量配置
在 Vercel 环境变量设置中添加：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

### 性能优化

#### 图片优化
使用 Next.js Image 组件：
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="描述"
  width={1200}
  height={600}
/>
```

#### 代码分割
动态导入组件：
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

#### 缓存策略
- 静态页面自动缓存
- 使用 `revalidate` 控制缓存时间

```tsx
export const revalidate = 3600 // 1小时重新验证
```

### 调试

#### 浏览器调试
```bash
npm run dev
# 在浏览器中打开 DevTools (F12)
```

#### Next.js 调试
在 VS Code 中创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    }
  ]
}
```

### 常见问题

#### Q: 深色模式不工作？
A: 确保在 `html` 标签上添加 `class="dark"`，且在 Tailwind 配置中启用了 `darkMode: 'class'`。

#### Q: Supabase 连接失败？
A: 检查环境变量是否正确配置，确保网络连接正常。

#### Q: 页面加载缓慢？
A: 检查图片大小、运行 `npm run build` 检查构建大小、使用浏览器 DevTools 的 Network 标签。

### 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Supabase 文档](https://supabase.com/docs)

### 提交代码

使用 Git Flow 工作流：
```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交更改
git commit -m "feat: 添加新功能"

# 推送分支
git push origin feature/new-feature

# 创建 Pull Request
```

### CI/CD 流程

自动化检查：
- ESLint 检查
- TypeScript 编译检查
- 单元测试
- 构建验证

运行本地检查：
```bash
npm run lint
npm run build
```
