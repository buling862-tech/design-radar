'use client'

import { useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import ArticleCard from '@/app/components/ArticleCard'

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
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof allArticles>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = allArticles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
    setSearchResults(results)
  }

  return (
    <div>
      <section className="gradient-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">搜索设计文章</h1>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章、标签或关键词..."
                className="w-full px-6 py-4 rounded-lg bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setSearchResults([]); setHasSearched(false) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2">
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hasSearched ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">输入关键词开始搜索</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                找到 <span className="font-bold text-gray-900 dark:text-white">{searchResults.length}</span> 篇相关文章
              </p>
              <div className="grid-responsive">
                {searchResults.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">未找到相关文章</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
