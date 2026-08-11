'use client'

import { useState } from 'react'
import { Archive, Calendar } from 'lucide-react'
import ArticleCard from '@/app/components/ArticleCard'

const archives = [
  { year: 2026, month: '08', issues: 33 },
  { year: 2026, month: '07', issues: 32 },
  { year: 2026, month: '06', issues: 31 },
  { year: 2026, month: '05', issues: 30 },
  { year: 2025, month: '12', issues: 29 },
  { year: 2025, month: '11', issues: 28 },
]

const allArticles = [
  {
    id: 1,
    title: '2026 年设计趋势预测',
    description: '深入分析即将改变设计行业的关键趋势',
    category: '趋势分析',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-10',
    views: 1234,
    tags: ['AI设计', '2026趋势'],
  },
  {
    id: 2,
    title: 'Netflix UI 竞品分析',
    description: '从早期设计到现在的完整演变',
    category: '竞品追踪',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-09',
    views: 856,
    tags: ['竞品分析', 'UI设计'],
  },
  {
    id: 3,
    title: '深色模式设计指南',
    description: '从技术实现到用户体验',
    category: '设计指南',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-08',
    views: 2341,
    tags: ['深色模式', '最佳实践'],
  },
  {
    id: 4,
    title: '设计系统实战：从零到一',
    description: '学习如何构建一个可扩展的设计系统',
    category: '实战教程',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-07',
    views: 1567,
    tags: ['设计系统', 'Figma'],
  },
  {
    id: 5,
    title: '动效设计最佳实践',
    description: '优秀的动效设计如何增强用户体验',
    category: '设计理论',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-06',
    views: 945,
    tags: ['动效', '交互设计'],
  },
  {
    id: 6,
    title: '排版在 Web 设计中的重要性',
    description: '深入探讨排版在创建易读、美观网站中的核心作用',
    category: '设计基础',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-08-05',
    views: 678,
    tags: ['排版', '网页设计'],
  },
]

export default function ArchivesPage() {
  const [selectedArchive, setSelectedArchive] = useState<string | null>(null)

  return (
    <div>
      {/* Header */}
      <section className="gradient-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Archive className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              历史周刊
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
            浏览过往的设计周刊和精选内容。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar - Archive List */}
            <div className="md:col-span-1">
              <div className="sticky top-20 card p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  按日期
                </h3>
                <div className="space-y-2">
                  {archives.map((archive) => {
                    const key = `${archive.year}-${archive.month}`
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedArchive(selectedArchive === key ? null : key)}
                        className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          selectedArchive === key
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="font-medium">{archive.year} 年 {archive.month} 月</div>
                        <div className={`text-xs ${
                          selectedArchive === key
                            ? 'text-blue-100'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {archive.issues} 期
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {selectedArchive ? `${selectedArchive} 月刊` : '所有文章'}
                </h2>
                <div className="grid-responsive">
                  {allArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
