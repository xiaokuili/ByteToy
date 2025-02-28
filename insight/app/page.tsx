"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { SourceToggle } from "@/components/ui/source-toggle"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;

    // 使用 URLSearchParams 构建查询参数
    const params = new URLSearchParams({
      q: query,
      source: isOnline ? 'online' : 'local'
    });

    // 添加页面切换动画类
    document.body.classList.add('page-transition');

    // 延迟导航以显示动画
    setTimeout(() => {
      router.push(`/search?${params.toString()}`);
    }, 200);
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#E6F0FD] to-[#F9F9F9]">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full bg-blue-100/50 -top-20 -left-20" />
        <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full bg-purple-100/50 -bottom-20 -right-20" />
      </div>

      {/* 主要内容 */}
      <div className="container max-w-4xl mx-auto px-4 h-screen flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-10 h-10 text-indigo-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>WriteFinder</span>
        </div>

        {/* 标语 */}
        <p className="text-lg text-gray-600 text-center">发现灵感，创造精彩</p>

        {/* 搜索框容器 */}
        <div className="w-full max-w-2xl backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg p-6 space-y-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="输入关键词开始搜索..."
              className="flex-1 h-12 text-lg border-0 bg-transparent focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSearch}
            >
              搜索
            </Button>
          </div>

          {/* 本地/网络切换 */}
          <SourceToggle
            isOnline={isOnline}
            onToggle={setIsOnline}
            className="justify-center"
          />
        </div>

        {/* 底部提示 */}
        <p className="text-sm text-gray-500">
          按下回车键开始搜索，或使用高级搜索选项
        </p>
      </div>
    </main>
  )
}
