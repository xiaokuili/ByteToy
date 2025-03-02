'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchResult, { ContentFormat } from '@/components/search/SearchResult';
import SearchInput from '@/components/search/SearchInput';
import { ChartConfig } from '@/components/search/charts/ChartTypes';
import { Metadata } from 'next';

// 客户端组件不能直接使用 generateMetadata，但可以通过 useEffect 更新文档标题
export default function Page() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const model = searchParams.get('model') || 'DEEPSEEK';
    const format = searchParams.get('format') || '列表';
    const source = searchParams.get('source') || '';

    // 使用 useEffect 更新文档标题
    useEffect(() => {
        document.title = query
            ? `${query} - ByteToy Insight 搜索结果`
            : '搜索 - ByteToy Insight';
    }, [query]);

    const [searchResults, setSearchResults] = useState<Array<{
        id: string;
        query: string;
        isLoading: boolean;
        format: ContentFormat;
        contentProps: any;
    }>>([
        {
            id: '1',
            query: '什么是向量数据库？',
            isLoading: true,
            format: 'text',
            contentProps: {}
        },
        {
            id: '2',
            query: '如何使用React Hooks实现状态管理？',
            isLoading: false,
            format: 'text',
            contentProps: {
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
        },
        {
            id: '3',
            query: 'JavaScript中的闭包是什么？',
            isLoading: false,
            format: 'code',
            contentProps: {
                language: 'javascript',
                code: `// 闭包示例
function createCounter() {
  let count = 0;
  
  return function() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 闭包允许内部函数访问外部函数的变量，
// 即使外部函数已经执行完毕`
            }
        },
        {
            id: '4',
            query: '2023年全球前五大科技公司市值',
            isLoading: false,
            format: 'table',
            contentProps: {
                headers: ['排名', '公司', '市值 (十亿美元)', '同比增长'],
                rows: [
                    ['1', 'Apple', '3,000', '+15%'],
                    ['2', 'Microsoft', '2,800', '+20%'],
                    ['3', 'Alphabet (Google)', '1,900', '+10%'],
                    ['4', 'Amazon', '1,700', '+5%'],
                    ['5', 'NVIDIA', '1,200', '+150%']
                ]
            }
        },
        {
            id: '5',
            query: '常见的设计模式有哪些？',
            isLoading: false,
            format: 'list',
            contentProps: {
                items: [
                    <div key="1">
                        <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">创建型模式</strong>：工厂方法、抽象工厂、单例、建造者、原型
                    </div>,
                    <div key="2">
                        <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">结构型模式</strong>：适配器、桥接、组合、装饰、外观、享元、代理
                    </div>,
                    <div key="3">
                        <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">行为型模式</strong>：责任链、命令、解释器、迭代器、中介者、备忘录、观察者、状态、策略、模板方法、访问者
                    </div>
                ],
                ordered: true
            }
        },
        {
            id: '6',
            query: '2023年全球主要科技公司市值走势',
            isLoading: false,
            format: 'chart',
            contentProps: {
                chartConfig: {
                    chartData: {
                        type: 'line',
                        data: {
                            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                            datasets: [
                                {
                                    label: 'Apple',
                                    data: [2800, 2900, 2950, 3000],
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)'
                                },
                                {
                                    label: 'Microsoft',
                                    data: [2500, 2600, 2700, 2800],
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)'
                                },
                                {
                                    label: 'Google',
                                    data: [1700, 1800, 1850, 1900],
                                    borderColor: 'rgba(255, 206, 86, 1)',
                                    backgroundColor: 'rgba(255, 206, 86, 0.2)'
                                }
                            ],
                            showArea: true
                        }
                    },
                    options: {
                        title: '2023年全球主要科技公司市值走势',
                        subtitle: '单位：十亿美元',
                        xAxisLabel: '季度',
                        yAxisLabel: '市值'
                    }
                }
            }
        },
        {
            id: '7',
            query: '2023年全球科技公司市值分布',
            isLoading: false,
            format: 'chart',
            contentProps: {
                chartConfig: {
                    chartData: {
                        type: 'pie',
                        data: {
                            labels: ['Apple', 'Microsoft', 'Google', 'Amazon', 'NVIDIA', '其他'],
                            datasets: [{
                                data: [3000, 2800, 1900, 1700, 1200, 3400],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.7)',
                                    'rgba(54, 162, 235, 0.7)',
                                    'rgba(255, 206, 86, 0.7)',
                                    'rgba(75, 192, 192, 0.7)',
                                    'rgba(153, 102, 255, 0.7)',
                                    'rgba(201, 203, 207, 0.7)'
                                ],
                                borderColor: 'white',
                                borderWidth: 1
                            }],
                            isDonut: true
                        }
                    },
                    options: {
                        title: '2023年全球科技公司市值分布',
                        subtitle: '单位：十亿美元',
                        legendPosition: 'right'
                    }
                }
            }
        },
        {
            id: '8',
            query: '2023年各季度科技公司营收对比',
            isLoading: false,
            format: 'chart',
            contentProps: {
                chartConfig: {
                    chartData: {
                        type: 'bar',
                        data: {
                            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                            datasets: [
                                {
                                    label: 'Apple',
                                    data: [94.8, 81.8, 89.5, 119.6],
                                    backgroundColor: 'rgba(255, 99, 132, 0.7)'
                                },
                                {
                                    label: 'Microsoft',
                                    data: [52.7, 56.2, 56.5, 62.0],
                                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                                },
                                {
                                    label: 'Google',
                                    data: [69.8, 74.6, 76.7, 86.3],
                                    backgroundColor: 'rgba(255, 206, 86, 0.7)'
                                },
                                {
                                    label: 'Amazon',
                                    data: [127.4, 134.4, 143.1, 169.9],
                                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                                }
                            ]
                        }
                    },
                    options: {
                        title: '2023年各季度科技公司营收对比',
                        subtitle: '单位：十亿美元',
                        xAxisLabel: '季度',
                        yAxisLabel: '营收'
                    }
                }
            }
        }
    ]);

    // 当 URL 参数变化时执行搜索
    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query, model, format, source]);

    const handleSearch = (query: string) => {
        if (!query.trim()) return;

        // 随机选择一种内容格式进行演示
        const formats: ContentFormat[] = ['text', 'code', 'table', 'list', 'file', 'chart'];
        const randomFormat = formats[Math.floor(Math.random() * formats.length)];

        // 创建新的搜索结果
        const newResult = {
            id: Date.now().toString(),
            query,
            isLoading: true,
            format: randomFormat,
            contentProps: {}
        };

        setSearchResults(prev => [newResult, ...prev]);

        // 模拟加载
        setTimeout(() => {
            setSearchResults(prev =>
                prev.map(result => {
                    if (result.id !== newResult.id) return result;

                    // 根据不同的格式生成不同的内容
                    let contentProps = {};

                    switch (randomFormat) {
                        case 'text':
                            contentProps = {
                                content: `这是对 "${query}" 的文本回答。在实际应用中，这里会显示从API获取的真实回答内容。`
                            };
                            break;
                        case 'code':
                            contentProps = {
                                language: 'javascript',
                                code: `// 这是对 "${query}" 的代码示例\nfunction example() {\n  console.log("Hello, world!");\n}\n\nexample();`
                            };
                            break;
                        case 'table':
                            contentProps = {
                                headers: ['项目', '描述', '值'],
                                rows: [
                                    ['示例1', `关于 "${query}" 的数据1`, '100'],
                                    ['示例2', `关于 "${query}" 的数据2`, '200'],
                                    ['示例3', `关于 "${query}" 的数据3`, '300']
                                ]
                            };
                            break;
                        case 'chart':
                            // 随机选择一种图表类型
                            const chartTypes = ['bar', 'line', 'pie'] as const;
                            const randomChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

                            let chartConfig: ChartConfig;

                            if (randomChartType === 'bar') {
                                chartConfig = {
                                    chartData: {
                                        type: 'bar',
                                        data: {
                                            labels: ['类别A', '类别B', '类别C', '类别D'],
                                            datasets: [{
                                                label: `${query} 数据`,
                                                data: [
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100)
                                                ],
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.7)',
                                                    'rgba(54, 162, 235, 0.7)',
                                                    'rgba(255, 206, 86, 0.7)',
                                                    'rgba(75, 192, 192, 0.7)'
                                                ]
                                            }]
                                        }
                                    },
                                    options: {
                                        title: `关于 "${query}" 的柱状图`,
                                        subtitle: '随机生成的示例数据'
                                    }
                                };
                            } else if (randomChartType === 'line') {
                                chartConfig = {
                                    chartData: {
                                        type: 'line',
                                        data: {
                                            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                                            datasets: [{
                                                label: `${query} 趋势`,
                                                data: [
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100)
                                                ],
                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                backgroundColor: 'rgba(54, 162, 235, 0.2)'
                                            }],
                                            showArea: true
                                        }
                                    },
                                    options: {
                                        title: `关于 "${query}" 的趋势图`,
                                        subtitle: '随机生成的示例数据'
                                    }
                                };
                            } else {
                                chartConfig = {
                                    chartData: {
                                        type: 'pie',
                                        data: {
                                            labels: ['部分A', '部分B', '部分C', '部分D', '部分E'],
                                            datasets: [{
                                                data: [
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100),
                                                    Math.floor(Math.random() * 100)
                                                ],
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.7)',
                                                    'rgba(54, 162, 235, 0.7)',
                                                    'rgba(255, 206, 86, 0.7)',
                                                    'rgba(75, 192, 192, 0.7)',
                                                    'rgba(153, 102, 255, 0.7)'
                                                ],
                                                borderColor: ['white', 'white', 'white', 'white', 'white'],
                                                borderWidth: 1
                                            }],
                                            isDonut: Math.random() > 0.5
                                        }
                                    },
                                    options: {
                                        title: `关于 "${query}" 的分布图`,
                                        subtitle: '随机生成的示例数据'
                                    }
                                };
                            }

                            contentProps = { chartConfig };
                            break;
                        case 'list':
                            contentProps = {
                                items: [
                                    `关于 "${query}" 的第一点`,
                                    `关于 "${query}" 的第二点`,
                                    `关于 "${query}" 的第三点`
                                ],
                                ordered: Math.random() > 0.5
                            };
                            break;
                        case 'file':
                            contentProps = {
                                fileName: `${query.substring(0, 10)}.txt`,
                                fileType: 'text/plain',
                                fileContent: `这是关于 "${query}" 的文件内容示例。\n在实际应用中，这里会包含真实的文件内容。`
                            };
                            break;
                    }

                    return {
                        ...result,
                        isLoading: false,
                        contentProps
                    };
                })
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

            {/* 头部导航 */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
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
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            使用模型: {model}
                        </div>
                    </div>
                </div>
            </header>

            {/* 搜索信息 */}
            <div className="w-full max-w-4xl mx-auto px-4 pt-6">
                {query ? (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">搜索: {query}</h2>
                        <div className="flex flex-wrap gap-2">
                            {source && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    数据源: {source}
                                </span>
                            )}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                展示格式: {format}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-4">请输入搜索内容</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            使用上方的搜索框输入您的问题，开始智能搜索
                        </p>
                    </div>
                )}
            </div>

            {/* 浮动输入框 */}
            <SearchInput
                onSearch={handleSearch}
                defaultModel={model}
                placeholder="输入您的问题..."
            />

            {/* 搜索历史和结果区域 */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-24 overflow-y-auto relative z-10">
                <div className="space-y-8">
                    {searchResults.map(result => {
                        const props = {
                            query: result.query,
                            isLoading: result.isLoading,
                            format: result.format,
                            ...result.contentProps
                        };
                        const id = result.id;

                        return <SearchResult key={id} {...props} />;
                    })}
                </div>
            </div>
        </div>
    );
}

