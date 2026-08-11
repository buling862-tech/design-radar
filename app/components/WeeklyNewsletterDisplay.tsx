'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, TrendingUp, Target } from 'lucide-react'

export interface WeeklyNewsletter {
  weekId: string
  week: number
  year: number
  startDate: string
  endDate: string
  designTrendArticles: Array<{
    id: string
    title: string
    description: string
    image_url: string
    focus_points: string[]
    tags: string[]
  }>
  competitorArticles: Array<{
    id: string
    title: string
    description: string
    image_url: string
    inspiration_points: string[]
    source: string
    tags: string[]
  }>
  generatedAt: string
}

interface WeeklyNewsletterDisplayProps {
  week?: number
  year?: number
  current?: boolean
}

export default function WeeklyNewsletterDisplay({
  week,
  year,
  current = false,
}: WeeklyNewsletterDisplayProps) {
  const [newsletter, setNewsletter] = useState<WeeklyNewsletter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNewsletter()
  }, [week, year, current])

  const fetchNewsletter = async () => {
    try {
      setLoading(true)
      setError(null)

      let url = '/api/newsletter'
      if (current) {
        url += '?current=true'
      } else if (week && year) {
        url += `?week=${week}&year=${year}`
      } else {
        url += '?current=true'
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('无法获取周刊数据')
      }

      const { data } = await response.json()
      setNewsletter(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取周刊失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!newsletter) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600">暂无周刊数据</p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="w-full">
      {/* 周刊头部 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              第 {newsletter.week} 周
            </h2>
            <p className="text-gray-600 mt-2">
              {formatDate(newsletter.startDate)} - {formatDate(newsletter.endDate)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {newsletter.designTrendArticles.length + newsletter.competitorArticles.length} 篇精选内容
            </p>
          </div>
          <Link
            href={`/week/${newsletter.year}-${newsletter.week}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            查看完整周刊 <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* 设计趋势部分 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={24} className="text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">设计趋势</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {newsletter.designTrendArticles.length} 篇
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletter.designTrendArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 文章图片 */}
              {article.image_url && (
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* 文章内容 */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600">
                  {article.title}
                </h4>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {article.description}
                </p>

                {/* 设计关注点 */}
                {article.focus_points.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      🎨 关注点
                    </p>
                    <div className="space-y-1">
                      {article.focus_points.slice(0, 2).map((point, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          • {point}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* 标签 */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
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

        {newsletter.designTrendArticles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            本周暂无设计趋势内容
          </div>
        )}
      </div>

      {/* 竞品追踪部分 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Target size={24} className="text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-900">竞品追踪</h3>
          <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {newsletter.competitorArticles.length} 篇
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletter.competitorArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 文章图片 */}
              {article.image_url && (
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* 文章内容 */}
              <div className="p-4">
                {/* 来源标签 */}
                <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded mb-2">
                  {article.source}
                </span>

                <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-purple-600">
                  {article.title}
                </h4>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {article.description}
                </p>

                {/* 设计启发 */}
                {article.inspiration_points.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      💡 启发
                    </p>
                    <div className="space-y-1">
                      {article.inspiration_points.slice(0, 2).map((point, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          • {point}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* 标签 */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded"
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

        {newsletter.competitorArticles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            本周暂无竞品追踪内容
          </div>
        )}
      </div>
    </div>
  )
}
