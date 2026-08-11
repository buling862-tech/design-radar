'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react'

const articles = [
  { id: 1, title: '2026 年设计趋势预测', date: '2026-08-10', status: 'published', views: 1234 },
  { id: 2, title: 'Netflix UI 竞品分析', date: '2026-08-09', status: 'published', views: 856 },
  { id: 3, title: '新文章草稿', date: '2026-08-11', status: 'draft', views: 0 },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('articles')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">后台CMS</h1>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              新建文章
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {['articles', 'categories', 'tags', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'articles' && '文章管理'}
                {tab === 'categories' && '分类管理'}
                {tab === 'tags' && '标签管理'}
                {tab === 'settings' && '设置'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'articles' && (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">标题</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">状态</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">发布日期</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">浏览量</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      <td className="px-6 py-3 text-sm text-gray-900 dark:text-white font-medium">{article.title}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{article.date}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{article.views}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition">
                            <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition">
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition">
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="card p-6">
            <div className="space-y-4">
              {['趋势分析', '竞品追踪', '设计指南', '实战教程'].map(cat => (
                <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-gray-900 dark:text-white font-medium">{cat}</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">网站设置</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">网站标题</label>
                <input type="text" defaultValue="Design Radar" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">网站描述</label>
                <textarea defaultValue="设计灵感与趋势雷达" className="input h-24" />
              </div>
              <button className="btn btn-primary">保存设置</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
