'use client'

import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            发现最新的设计趋势
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            精选全球顶尖的设计作品、创新案例和设计灵感。每周更新，助力设计师保持创意前沿。
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
              浏览作品集
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
              订阅更新
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
