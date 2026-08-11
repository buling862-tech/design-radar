import { ArrowRight, TrendingUp, Eye, Tag } from 'lucide-react'
import Link from 'next/link'
import ArticleCard from './components/ArticleCard'

const featuredArticles = [
  {
    id: 1,
    title: '2026 年设计趋势预测：从AI到Web3',
    description: '深入分析即将改变设计行业的关键趋势，包括AI辅助设计、沉浸式体验和可持续设计。',
    category: '趋势分析',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-10',
    views: 1234,
    tags: ['AI设计', '2026趋势', 'Web3'],
    featured: true,
  },
  {
    id: 2,
    title: '竞品分析：Netflix UI 的进化史',
    description: '从早期设计到现在的完整演变，深入了解如何通过 UI 改进提升用户体验。',
    category: '竞品追踪',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-09',
    views: 856,
    tags: ['竞品分析', '流媒体', 'UI设计'],
  },
  {
    id: 3,
    title: '深色模式设计指南',
    description: '从技术实现到用户体验，全面指南帮助设计师创建完美的深色主题。',
    category: '设计指南',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-08',
    views: 2341,
    tags: ['深色模式', '最佳实践', 'UI设计'],
  },
  {
    id: 4,
    title: '设计系统实战：从零到一',
    description: '学习如何构建一个可扩展的设计系统，提高团队协作效率。',
    category: '实战教程',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-07',
    views: 1567,
    tags: ['设计系统', '团队协作', 'Figma'],
  },
  {
    id: 5,
    title: '动效设计最佳实践',
    description: '优秀的动效设计如何增强用户体验，包括具体案例和技术实现。',
    category: '设计理论',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-06',
    views: 945,
    tags: ['动效', '用户体验', '交互设计'],
  },
  {
    id: 6,
    title: '排版在 Web 设计中的重要性',
    description: '深入探讨排版在创建易读、美观网站中的核心作用。',
    category: '设计基础',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-05',
    views: 678,
    tags: ['排版', '网页设计', '可读性'],
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              发现最新的设计趋势
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              精选全球顶尖的设计作品、创新案例和设计灵感。每周更新，助力设计师保持创意前沿。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/trends"
                className="btn btn-primary flex items-center gap-2"
              >
                浏览趋势
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="btn btn-outline"
              >
                开始搜索
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                5,234
              </div>
              <p className="text-gray-600 dark:text-gray-400">设计作品</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                156
              </div>
              <p className="text-gray-600 dark:text-gray-400">周刊期数</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                28k+
              </div>
              <p className="text-gray-600 dark:text-gray-400">社区成员</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticles[0] && (
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              本周精选
            </h2>
            <div className="grid md:grid-cols-2 gap-8 card p-6 md:p-8">
              <div className="flex flex-col justify-center">
                <span className="tag inline-block mb-4 w-fit">
                  {featuredArticles[0].category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {featuredArticles[0].title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {featuredArticles[0].description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <span>📅 {featuredArticles[0].date}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {featuredArticles[0].views.toLocaleString()}
                  </span>
                </div>
                <Link
                  href={`/articles/${featuredArticles[0].id}`}
                  className="btn btn-primary w-fit"
                >
                  阅读全文 →
                </Link>
              </div>
              <div className="h-64 md:h-auto rounded-lg overflow-hidden">
                <img
                  src={featuredArticles[0].image}
                  alt={featuredArticles[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              最新文章
            </h2>
            <Link
              href="/archives"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              查看所有 →
            </Link>
          </div>

          <div className="grid-responsive">
            {featuredArticles.slice(1).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            订阅每周设计周刊
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            获取最新的设计趋势、竞品动态和灵感案例，直接送到你的邮箱。
          </p>
          <form className="flex gap-4 max-w-md mx-auto flex-col sm:flex-row">
            <input
              type="email"
              placeholder="输入你的邮箱"
              className="input flex-1"
              required
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              订阅
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
