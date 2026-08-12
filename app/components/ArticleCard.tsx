'use client'

import Link from 'next/link'
import { Eye, Calendar, Bookmark } from 'lucide-react'

interface Article {
  id: number
  title: string
  description: string
  category: string
  image: string
  date: string
  views: number
  tags: string[]
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="card card-hover p-0 overflow-hidden h-full cursor-pointer transition-transform hover:scale-105">
        <div className="h-48 overflow-hidden bg-gray-200 dark:bg-slate-800">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="tag text-xs">{article.category}</span>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition"
            >
              <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition">
            {article.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {article.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                #{tag}
              </span>
            ))}
            {article.tags.length > 2 && (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                +{article.tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
