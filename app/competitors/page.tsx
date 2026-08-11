'use client'

import { useState } from 'react'
import { Target, TrendingUp, TrendingDown } from 'lucide-react'

const competitors = [
  {
    id: 1,
    name: 'Netflix',
    updates: [
      {
        id: 1,
        title: '新推荐算法改善内容发现',
        date: '2026-08-10',
        trend: 'up',
        description: '推出基于用户行为的个性化推荐系统',
      },
      {
        id: 2,
        title: 'UI深色模式优化',
        date: '2026-08-08',
        trend: 'stable',
        description: '改进深色模式下的文字对比度',
      },
    ],
  },
  {
    id: 2,
    name: 'Spotify',
    updates: [
      {
        id: 1,
        title: '新播放列表UI设计',
        date: '2026-08-09',
        trend: 'up',
        description: '重新设计播放列表卡片和交互',
      },
    ],
  },
  {
    id: 3,
    name: 'Apple Music',
    updates: [
      {
        id: 1,
        title: '空间音频界面升级',
        date: '2026-08-07',
        trend: 'up',
        description: '优化空间音频功能的用户引导',
      },
    ],
  },
  {
    id: 4,
    name: 'YouTube',
    updates: [
      {
        id: 1,
        title: '推荐算法改进',
        date: '2026-08-06',
        trend: 'up',
        description: '改善视频推荐的相关性',
      },
    ],
  },
]

export default function CompetitorsPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState(competitors[0].id)

  const current = competitors.find(c => c.id === selectedCompetitor)

  return (
    <div>
      {/* Header */}
      <section className="gradient-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              竞品追踪
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
            实时追踪行业竞品的设计更新和产品动态。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="space-y-2">
                {competitors.map((competitor) => (
                  <button
                    key={competitor.id}
                    onClick={() => setSelectedCompetitor(competitor.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedCompetitor === competitor.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{competitor.name}</div>
                    <div className={`text-sm ${
                      selectedCompetitor === competitor.id
                        ? 'text-blue-100'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {competitor.updates.length} 个更新
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {current && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    {current.name}
                  </h2>

                  <div className="space-y-6">
                    {current.updates.map((update) => (
                      <div key={update.id} className="card p-6 card-hover">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {update.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {update.date}
                            </p>
                          </div>
                          {update.trend === 'up' && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-sm font-medium">上升</span>
                            </div>
                          )}
                          {update.trend === 'down' && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                              <TrendingDown className="w-4 h-4" />
                              <span className="text-sm font-medium">下降</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {update.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
