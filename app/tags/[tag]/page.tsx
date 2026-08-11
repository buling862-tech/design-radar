import { Tag } from 'lucide-react'
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
]

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const filteredArticles = allArticles.filter(article =>
    article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )

  return (
    <div>
      <section className="gradient-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              标签：{tag}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length > 0 ? (
            <div className="grid-responsive">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">该标签下没有文章</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
