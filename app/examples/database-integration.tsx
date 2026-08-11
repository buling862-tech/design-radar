'use client'

import { useEffect, useState } from 'react'
import { getArticles, getCategories } from '@/app/lib/database'

/**
 * 数据库集成示例
 * 演示如何在前端使用数据库操作函数
 */

export function DatabaseIntegrationExample() {
  const [articles, setArticles] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取已发布的文章
        const { data: articlesData } = await getArticles({
          status: 'published',
          limit: 5,
          sort: 'newest'
        })
        setArticles(articlesData || [])

        // 获取分类
        const { data: categoriesData } = await getCategories()
        setCategories(categoriesData || [])

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-4">加载中...</div>
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat: any) => (
            <div key={cat.id} className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">最新文章</h2>
        <div className="space-y-4">
          {articles.map((article: any) => (
            <div key={article.id} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{article.summary}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>类型: {article.type}</span>
                <span>分类: {article.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
