"use client"

import { Home, Target, Users, Calendar } from "lucide-react"

interface BottomNavigationProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
}

export default function BottomNavigation({ currentTab, setCurrentTab }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "홈", icon: Home },
    { id: "goals", label: "목표", icon: Target },
    { id: "groups", label: "그룹", icon: Users },
    { id: "verification", label: "검증", icon: Calendar },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-600"}`} />
              <span className={`text-xs font-medium ${isActive ? "text-indigo-600" : "text-gray-600"}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
