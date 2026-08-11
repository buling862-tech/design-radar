'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, ChevronRight } from 'lucide-react'

interface Article {
  id: string
  title: string
  description: string
  image_url: string
  focus_points: string[]
  tags: string[]
}

interface HomepageTrendsProps {
  limit?: number
}

export default function HomepageTrends({ limit = 6 }: HomepageTrendsProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrends()
  }, [limit])

  const fetchTrends = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取当前周的周刊
      const response = await fetch('/api/newsletter?current=true')
      if (!response.ok) {
        throw new Error('无法获取趋势数据')
      }

      const { data } = await response.json()

      // 只取前 limit 篇设计趋势
      setArticles(data.designTrendArticles.slice(0, limit))
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取失败')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">加载设计趋势中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600 text-sm">暂无设计趋势内容</p>
      </div>
    )
  }

  return (
    <section className="py-12">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp size={28} className="text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">设计趋势</h2>
            <p className="text-gray-600 text-sm">发现本周最新的设计创新</p>
          </div>
        </div>
        <Link
          href="/trends"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          查看全部 <ChevronRight size={20} />
        </Link>
      </div>

      {/* 文章网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* 图片 */}
            {article.image_url && (
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            {/* 内容 */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {article.description}
              </p>

              {/* 关注点 */}
              {article.focus_points.length > 0 && (
                <div className="mb-3 pb-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    🎨 关键点
                  </p>
                  <ul className="space-y-1">
                    {article.focus_points.slice(0, 2).map((point, idx) => (
                      <li key={idx} className="text-xs text-gray-600 line-clamp-1">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 标签 */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
