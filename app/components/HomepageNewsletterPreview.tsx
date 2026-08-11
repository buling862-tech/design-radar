'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Calendar, FileText } from 'lucide-react'

interface CompetitorArticle {
  id: string
  title: string
  description: string
  image_url: string
  inspiration_points: string[]
  source: string
  tags: string[]
}

interface HomepageNewsletterPreviewProps {
  limit?: number
}

/**
 * 首页周刊预览（竞品追踪部分）
 * 自动从当前周获取 6 篇竞品文章
 */
export default function HomepageNewsletterPreview({
  limit = 6,
}: HomepageNewsletterPreviewProps) {
  const [competitors, setCompetitors] = useState<CompetitorArticle[]>([])
  const [weekInfo, setWeekInfo] = useState<{
    week: number
    year: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCompetitorArticles()
  }, [limit])

  const fetchCompetitorArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取当前周的周刊
      const response = await fetch('/api/newsletter?current=true')
      if (!response.ok) {
        throw new Error('无法获取竞品数据')
      }

      const { data } = await response.json()

      // 只取前 limit 篇竞品文章
      setCompetitors(data.competitorArticles.slice(0, limit))
      setWeekInfo({ week: data.week, year: data.year })
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取失败')
      setCompetitors([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">加载中...</div>
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

  if (competitors.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600 text-sm">暂无竞品追踪内容</p>
      </div>
    )
  }

  return (
    <section className="py-12">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar size={28} className="text-orange-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              本周精选 · 第 {weekInfo?.week} 周
            </h2>
            <p className="text-gray-600 text-sm">竞品追踪和行业动态</p>
          </div>
        </div>
        {weekInfo && (
          <Link
            href={`/week/${weekInfo.year}-${weekInfo.week}`}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            查看完整周刊 <ChevronRight size={20} />
          </Link>
        )}
      </div>

      {/* 竞品文章网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitors.map((article) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* 来源标签浮在图片上 */}
                <div className="absolute top-3 right-3">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    {article.source}
                  </span>
                </div>
              </div>
            )}

            {/* 内容 */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                {article.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {article.description}
              </p>

              {/* 设计启发 - 高亮展示 */}
              {article.inspiration_points.length > 0 && (
                <div className="mb-3 pb-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-orange-600 mb-2 flex items-center gap-1">
                    <span>💡</span> 关键启发
                  </p>
                  <ul className="space-y-1">
                    {article.inspiration_points.slice(0, 2).map((point, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-600 line-clamp-1"
                      >
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
                      className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded"
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

      {/* CTA 按钮 */}
      {weekInfo && (
        <div className="mt-8 text-center">
          <Link
            href={`/week/${weekInfo.year}-${weekInfo.week}`}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FileText size={20} />
            查看本周完整周刊
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
    </section>
  )
}
