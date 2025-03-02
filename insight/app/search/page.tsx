'use client';

import { useState } from 'react';
import SearchResult from '@/components/search/SearchResult';
import SearchInput from '@/components/search/SearchInput';

export default function Page() {
    const [searchResults, setSearchResults] = useState<Array<{
        id: string;
        query: string;
        isLoading: boolean;
        content?: React.ReactNode;
    }>>([
        {
            id: '1',
            query: '什么是向量数据库？',
            isLoading: true,
        },
        {
            id: '2',
            query: '如何使用React Hooks实现状态管理？',
            isLoading: false,
            content: (
                <>
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
                </>
            )
        }
    ]);

    const handleSearch = (query: string) => {
        if (!query.trim()) return;

        // Add a new search result in loading state
        const newResult = {
            id: Date.now().toString(),
            query,
            isLoading: true,
        };

        setSearchResults(prev => [newResult, ...prev]);

        // Simulate loading (in a real app, this would be an API call)
        setTimeout(() => {
            setSearchResults(prev =>
                prev.map(result =>
                    result.id === newResult.id
                        ? {
                            ...result,
                            isLoading: false,
                            content: (
                                <p>这是对 "{query}" 的模拟回答。在实际应用中，这里会显示从API获取的真实回答内容。</p>
                            )
                        }
                        : result
                )
            );
        }, 3000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 relative overflow-hidden">
            {/* 背景装饰元素 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* 浮动输入框 */}
            <SearchInput onSearch={handleSearch} />

            {/* 搜索历史和结果区域 */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-24 overflow-y-auto relative z-10">
                <div className="space-y-8">
                    {searchResults.map(result => (
                        <SearchResult
                            key={result.id}
                            query={result.query}
                            isLoading={result.isLoading}
                        >
                            {result.content}
                        </SearchResult>
                    ))}
                </div>
            </div>
        </div>
    );
}

