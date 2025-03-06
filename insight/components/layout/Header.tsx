import Link from "next/link";
import { User, AlertCircle } from "lucide-react";

interface HeaderProps {
    variant?: "minimal" | "full";
}

export function Header({ variant = "full" }: HeaderProps) {
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
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                            <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}