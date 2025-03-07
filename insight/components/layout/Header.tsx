"use client"
import Link from "next/link";
import { User, AlertCircle } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface HeaderProps {
    variant?: "minimal" | "full";
}

export function Header({ variant = "full" }: HeaderProps) {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* 品牌标识 - 在两种模式下都显示 */}
                    <Link href="/" className="flex items-center">
                        <div className="relative w-10 h-10 mr-3">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-80"></div>
                            <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">BT</span>
                            </div>
                        </div>
                        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            ByteToy Insight
                        </h1>
                    </Link>

                    {/* 用户控制区域 - 在两种模式下都显示 */}
                    <div className="flex items-center">
                        {/* 导航链接 - 仅在 full 模式下显示 */}
                        {variant === "full" && (
                            <nav className="hidden md:flex items-center space-x-6 mr-6">
                                <div className="relative group">
                                    <span className="text-gray-400 cursor-not-allowed group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors flex items-center">
                                        仪表盘
                                        <AlertCircle className="h-4 w-4 ml-1" />
                                    </span>
                                    <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 -bottom-8">
                                        即将上线
                                    </div>
                                </div>
                                <div className="relative group">
                                    <span className="text-gray-400 cursor-not-allowed group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors flex items-center">
                                        报告
                                        <AlertCircle className="h-4 w-4 ml-1" />
                                    </span>
                                    <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 -bottom-8">
                                        即将上线
                                    </div>
                                </div>
                                <Link href="/data-sources" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                                    数据源
                                </Link>
                            </nav>
                        )}
                        {isLoading ? (
                            // Loading state
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        ) : session?.user ? (
                            // Logged in state
                            <div className="relative">
                                <img
                                    src={session.user.image || '/default-avatar.png'}
                                    alt={session.user.name || 'User Avatar'}
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                />
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="py-2">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                退出登录
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Logged out state
                            <div className="relative group">
                                <button
                                    onClick={() => signIn('github')}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    <span className="text-gray-600 dark:text-gray-300">登录</span>
                                </button>
                                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 right-0 mt-2">
                                    使用 GitHub 账号登录
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}