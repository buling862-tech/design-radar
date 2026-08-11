'use client'

import { Heart, Share2, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface DesignCard {
  id: number
  title: string
  description: string
  category: string
  image: string
  likes: number
  comments: number
  author: string
}

const mockCards: DesignCard[] = [
  {
    id: 1,
    title: '现代极简主义 UI 套件',
    description: '这是一个深思熟虑的 UI 设计系统，结合了现代美学和功能性。',
    category: 'UI 设计',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    likes: 342,
    comments: 24,
    author: '设计师 A',
  },
  {
    id: 2,
    title: '品牌识别系统',
    description: '完整的品牌指南包含颜色系统、排版和图标库。',
    category: '品牌设计',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    likes: 289,
    comments: 18,
    author: '设计师 B',
  },
  {
    id: 3,
    title: '交互动画设计',
    description: '创意十足的交互动画效果，提升用户体验。',
    category: '动画设计',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    likes: 456,
    comments: 32,
    author: '设计师 C',
  },
  {
    id: 4,
    title: '电商平台重设计',
    description: '以用户为中心的电商界面重新设计方案。',
    category: '产品设计',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    likes: 523,
    comments: 45,
    author: '设计师 D',
  },
]

export default function DesignCards() {
  const [likedCards, setLikedCards] = useState<Set<number>>(new Set())

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedCards)
    if (newLiked.has(id)) {
      newLiked.delete(id)
    } else {
      newLiked.add(id)
    }
    setLikedCards(newLiked)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">设计作品</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {card.category}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4">{card.description}</p>
              <p className="text-xs text-gray-500 mb-4">作者: {card.author}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button
                    onClick={() => toggleLike(card.id)}
                    className="flex items-center gap-1 hover:text-red-500 transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedCards.has(card.id)
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }`}
                    />
                    {card.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition">
                    <MessageCircle className="w-4 h-4" />
                    {card.comments}
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-900 transition">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
