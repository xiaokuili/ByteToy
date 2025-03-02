import { useState } from 'react';
import { Search, X, Send, ChevronDown, Sparkles } from 'lucide-react';

export default function Page() {
    // 阅读globals的式样，理解目前的样式， 帮我进行实现，尽量现代化， 类似perplexity 风格

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 relative overflow-hidden">
            {/* 背景装饰元素 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* 浮动输入框 */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-30">
                <div className="relative flex items-center backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                    {/* LLM 选择器 */}
                    <div className="absolute left-3 flex items-center">
                        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 font-medium">GPT-4</span>
                            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                        </button>
                    </div>

                    {/* 输入框 */}
                    <input
                        type="text"
                        placeholder="输入您的问题..."
                        className="w-full py-3 px-24 bg-transparent rounded-full focus:outline-none"
                    />

                    {/* 发送按钮 */}
                    <div className="absolute right-2">
                        <button className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-full hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 搜索历史和结果区域 */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-24 overflow-y-auto relative z-10">
                <div className="space-y-8">
                    {/* 示例搜索项 */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 p-4 flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 rounded-full shadow-md">
                                <Search className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    如何使用React Hooks实现状态管理？
                                    <span className="inline-block animate-pulse">
                                        <Sparkles className="h-4 w-4 text-amber-400" />
                                    </span>
                                </h3>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5 bg-white/90 dark:bg-gray-850/90 border-t border-gray-200 dark:border-gray-700">
                            <div className="prose dark:prose-invert max-w-none">
                                <p>React Hooks 是 React 16.8 引入的特性，允许在函数组件中使用状态和其他 React 特性。以下是使用 React Hooks 进行状态管理的基本方法：</p>

                                <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">1. useState Hook</h4>
                                <p>useState 是最基本的状态管理 Hook，用于在函数组件中添加本地状态：</p>
                                <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-inner"><code>{`
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', email: '' });
                                `}</code></pre>

                                <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">2. useReducer Hook</h4>
                                <p>对于更复杂的状态逻辑，可以使用 useReducer：</p>
                                <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-inner"><code>{`
const [state, dispatch] = useReducer(reducer, initialState);
                                `}</code></pre>

                                <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">3. useContext Hook</h4>
                                <p>结合 Context API 可以实现跨组件的状态共享：</p>
                                <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-inner"><code>{`
const value = useContext(MyContext);
                                `}</code></pre>
                            </div>
                        </div>
                    </div>

                    {/* 示例搜索项 2 */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-pink-950 p-4 flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-500 dark:to-pink-600 rounded-full shadow-md">
                                <Search className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    Next.js 13 的主要特性有哪些？
                                    <span className="inline-block animate-pulse">
                                        <Sparkles className="h-4 w-4 text-amber-400" />
                                    </span>
                                </h3>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5 bg-white/90 dark:bg-gray-850/90 border-t border-gray-200 dark:border-gray-700">
                            <div className="prose dark:prose-invert max-w-none">
                                <p>Next.js 13 引入了许多重要的新特性和改进：</p>

                                <ul className="space-y-2">
                                    <li className="transition-all duration-200 hover:translate-x-1"><strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">App Router</strong>：基于 React Server Components 的新路由系统</li>
                                    <li className="transition-all duration-200 hover:translate-x-1"><strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">Turbopack</strong>：Rust 编写的新一代打包工具，比 Webpack 快 700 倍</li>
                                    <li className="transition-all duration-200 hover:translate-x-1"><strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">Server Components</strong>：默认支持 React Server Components</li>
                                    <li className="transition-all duration-200 hover:translate-x-1"><strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">Streaming</strong>：支持 UI 流式渲染</li>
                                    <li className="transition-all duration-200 hover:translate-x-1"><strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">新的 Image 组件</strong>：改进的图片优化</li>
                                    <li className="transition-all duration-200 hover:translate-x-1"><strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">新的字体系统</strong>：自动字体优化和加载</li>
                                    <li className="transition-all duration-200 hover:translate-x-1"><strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">布局和嵌套布局</strong>：简化页面布局管理</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

