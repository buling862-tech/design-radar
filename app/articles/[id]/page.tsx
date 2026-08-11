'use client'

import { useState } from 'react'
import { Calendar, Eye, Share2, Bookmark, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const articleContent: Record<string, any> = {
  '1': {
    title: '2026 年设计趋势预测：从AI到Web3',
    author: '设计师 A',
    date: '2026-08-10',
    views: 1234,
    category: '趋势分析',
    tags: ['AI设计', '2026趋势', 'Web3'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    content: `
      <h2>设计行业的未来已经到来</h2>
      <p>2026年将成为设计行业的转折点。从人工智能辅助设计工具的普及，到Web3带来的新型交互方式。</p>
      <h3>1. AI辅助设计的全面普及</h3>
      <p>人工智能不再是未来的概念，而是当下的现实。越来越多的设计工具集成了AI能力。</p>
    `,
  }
}

export default function ArticlePage() {
  const params = useParams()
  const id = params?.id as string
  const [isBookmarked, setIsBookmarked] = useState(false)

  const article = articleContent[id]

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">文章未找到</h1>
          <Link href="/archives" className="btn btn-primary">返回文章列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/archives" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Link>
        </div>
      </div>

      <article className="bg-white dark:bg-slate-900 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 rounded-lg overflow-hidden h-96 md:h-96">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="tag">{article.category}</span>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {article.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Eye className="w-4 h-4" />
              {article.views.toLocaleString()}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 pb-8 border-b border-gray-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{article.author}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">设计师</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button onClick={() => setIsBookmarked(!isBookmarked)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                <Bookmark className={isBookmarked ? 'fill-yellow-500 text-yellow-500 w-5 h-5' : 'w-5 h-5 text-gray-600 dark:text-gray-400'} />
              </button>
            </div>
          </div>

          <div className="prose dark:prose-invert mt-8 max-w-full" dangerouslySetInnerHTML={{ __html: article.content }} />

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">标签</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Link key={tag} href={`/tags/${tag}`} className="px-3 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
