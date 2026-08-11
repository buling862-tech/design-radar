'use client'

import { X, Home, Star, Bookmark, Settings } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform lg:relative lg:top-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } z-20 lg:z-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="font-semibold">菜单</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavItem icon={<Home className="w-5 h-5" />} label="主页" />
            <NavItem icon={<Star className="w-5 h-5" />} label="精选" />
            <NavItem
              icon={<Bookmark className="w-5 h-5" />}
              label="收藏"
            />
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <Settings className="w-5 h-5" />
              设置
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
}

function NavItem({ icon, label }: NavItemProps) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
      {icon}
      <span>{label}</span>
    </button>
  )
}
