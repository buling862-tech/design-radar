'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import ArticleCard from '@/app/components/ArticleCard'

const categories = ['全部', 'AI设计', '用户体验', '视觉设计', 'Web3', '移动应用']

const trendArticles = [
  {
    id: 101,
    title: '2026 年设计趋势预测：从AI到Web3',
    description: '深入分析即将改变设计行业的关键趋势',
    category: '趋势分析',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-10',
    views: 1234,
    tags: ['AI设计', '2026趋势', 'Web3'],
  },
  {
    id: 102,
    title: 'AI 辅助设计工具大盘点',
    description: '2026年最值得关注的AI设计工具',
    category: '工具推荐',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-09',
    views: 856,
    tags: ['AI工具', '效率提升'],
  },
  {
    id: 103,
    title: '沉浸式体验设计指南',
    description: '如何设计令人印象深刻的沉浸式用户体验',
    category: '设计指南',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-08',
    views: 2341,
    tags: ['体验设计', '交互设计'],
  },
  {
    id: 104,
    title: '极简主义UI设计回归',
    description: '新一代设计师为何回归极简设计',
    category: '设计趋势',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-07',
    views: 1567,
    tags: ['极简', 'UI设计'],
  },
  {
    id: 105,
    title: '可持续设计：环保与美学的结合',
    description: '设计行业如何拥抱可持续发展',
    category: '可持续设计',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-06',
    views: 945,
    tags: ['环保', '可持续'],
  },
  {
    id: 106,
    title: '无障碍设计实践',
    description: '打造包容性的数字产品',
    category: '包容设计',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-05',
    views: 678,
    tags: ['无障碍', '包容性'],
  },
]

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部')

  const filteredArticles = selectedCategory === '全部'
    ? trendArticles
    : trendArticles.filter(article =>
      article.tags.some(tag => tag.includes(selectedCategory) || selectedCategory.includes(tag))
    )

  return (
    <div>
      {/* Header */}
      <section className="gradient-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              设计趋势
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
            追踪全球设计行业的最新动态和emerging trends。
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid-responsive">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">没有找到相关文章</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
