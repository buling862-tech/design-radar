import Link from 'next/link'
import { Mail, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-100 py-12 border-t border-gray-800 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DR</span>
              </div>
              <span className="text-lg font-bold">Design Radar</span>
            </div>
            <p className="text-gray-400 text-sm">
              发现最新的设计趋势，追踪竞品动态，获取设计灵感。
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">导航</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">首页</Link></li>
              <li><Link href="/trends" className="text-gray-400 hover:text-white transition">设计趋势</Link></li>
              <li><Link href="/competitors" className="text-gray-400 hover:text-white transition">竞品追踪</Link></li>
              <li><Link href="/archives" className="text-gray-400 hover:text-white transition">历史周刊</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">资源</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search" className="text-gray-400 hover:text-white transition">搜索</Link></li>
              <li><Link href="/tags" className="text-gray-400 hover:text-white transition">标签</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-white transition">后台CMS</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@designradar.com" className="text-gray-400 hover:text-white transition text-sm">
                  contact@designradar.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 Design Radar. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition">隐私政策</Link>
              <Link href="#" className="hover:text-white transition">服务条款</Link>
              <Link href="#" className="hover:text-white transition">联系我们</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
