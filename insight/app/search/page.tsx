'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchResult from '@/components/search/SearchResult';
import SearchInput from '@/components/search/SearchInput';
import { ChartConfig } from '@/components/search/charts/ChartTypes';
import { DisplayFormat } from '@/config/filters';
import { SearchResultProps } from '@/components/search/SearchResult';
// 客户端组件不能直接使用 generateMetadata，但可以通过 useEffect 更新文档标题

export default function Page() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const model = searchParams.get('model') || 'DEEPSEEK';
    const format = searchParams.get('format') || 'pie';
    const source = searchParams.get('source') || '';

    const searchedQueriesRef = useRef<Set<string>>(new Set());


    const [searchResults, setSearchResults] = useState<SearchResultProps[]>([]);

    // 当 URL 参数变化时执行搜索
    useEffect(() => {
        // 创建一个唯一的搜索标识符（组合查询和其他参数）
        const searchKey = `${query}_${model}_${format}_${source}`;

        // 只有当这个组合没有被搜索过时才执行搜索
        if (query && !searchedQueriesRef.current.has(searchKey)) {
            searchedQueriesRef.current.add(searchKey);
            handleSearch(query);
        }
    }, [query, model, format, source]);

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        // 生成唯一ID用于标识此次搜索
        const searchId = Date.now().toString();

        // 创建新的搜索结果（初始状态为加载中）
        const newResult = {
            id: searchId,
            query,
            isLoading: true,
            format: 'list' as DisplayFormat, // 默认格式，将被API响应覆盖
            chartConfig: {} as ChartConfig
        };

        setSearchResults(prev => [newResult, ...prev]);

        try {
            // TODO: 替换为真实API调用
            // const response = await fetchSearchResults(query, model, format, source);
            // const data = await response.json();

            // 暂时使用mock数据
            const mockResponse = await mockSearchAPI(query, model, format, source);

            // 只更新匹配ID的搜索结果
            setSearchResults(prev =>
                prev.map(result => {
                    if (result.id === searchId) {
                        return {
                            ...result,
                            isLoading: false,
                            format: mockResponse.format,
                            chartConfig: mockResponse.contentProps.chartConfig
                        };
                    }
                    return result;
                })
            );
        } catch (error) {
            console.error('搜索失败:', error);

            // 只更新匹配ID的搜索结果
            setSearchResults(prev =>
                prev.map(result => {
                    if (result.id === searchId) {
                        return {
                            ...result,
                            isLoading: false,
                            format: 'list' as DisplayFormat,
                            contentProps: {
                                content: '搜索请求失败，请稍后重试。'
                            }
                        };
                    }
                    return result;
                })
            );
        }
    };
    console.log(searchResults);
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

                    </div>
                </div>
            </header>



            {/* 浮动输入框 */}
            <SearchInput
                onSearch={handleSearch}
                defaultModel={model}
                placeholder="输入您的问题..."
            />

            {/* 搜索历史和结果区域 */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-24 overflow-y-auto relative z-10">
                <div className="space-y-8">
                    {searchResults.map((result, index) => {
                        const props = {
                            id: result.id,
                            query: result.query,
                            isLoading: result.isLoading,
                            format: result.format,
                            chartConfig: result.chartConfig
                        };

                        return <SearchResult key={result.id || index} {...props} />;
                    })}
                </div>
            </div>
        </div>
    );
}

// =====================================================================
// ==================== 模拟搜索 API 和示例数据 ==========================
// =====================================================================

// 模拟搜索结果的接口
interface MockSearchResponse {
    format: DisplayFormat;
    contentProps: any;
}

// 模拟搜索API
async function mockSearchAPI(
    query: string,
    model: string = 'DEEPSEEK',
    format: string = 'pie',
    source: string = ''
): Promise<MockSearchResponse> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 尝试从预设结果中查找匹配的查询
    const exactMatch = EXAMPLE_SEARCH_RESULTS.find(result =>
        result.query.toLowerCase() === query.toLowerCase()
    );

    if (exactMatch) {
        return {
            format: exactMatch.format,
            contentProps: exactMatch.contentProps
        };
    }

    // 如果没有精确匹配，则生成随机结果
    const formats: DisplayFormat[] = ["pie", "bar", "line"];

    // 如果指定了格式，尝试使用指定的格式，否则随机选择
    let resultFormat: DisplayFormat;
    if (formats.includes(format as DisplayFormat)) {
        resultFormat = format as DisplayFormat;
    } else {
        resultFormat = formats[Math.floor(Math.random() * formats.length)];
    }

    // 根据不同的格式生成不同的内容
    switch (resultFormat) {
        case 'pie':
        case 'bar':
        case 'line':
            return generateChartData(query, resultFormat);

        case 'table':
            return {
                format: 'table',
                contentProps: {
                    headers: ['项目', '描述', '值'],
                    rows: [
                        ['示例1', `关于 "${query}" 的数据1`, Math.floor(Math.random() * 1000).toString()],
                        ['示例2', `关于 "${query}" 的数据2`, Math.floor(Math.random() * 1000).toString()],
                        ['示例3', `关于 "${query}" 的数据3`, Math.floor(Math.random() * 1000).toString()]
                    ]
                }
            };

        case 'list':
        default:
            return {
                format: 'list',
                contentProps: {
                    items: [
                        `关于 "${query}" 的第一点：这是一个示例项目，在实际应用中会替换为真实内容。`,
                        `关于 "${query}" 的第二点：这是另一个示例项目，展示列表格式的呈现方式。`,
                        `关于 "${query}" 的第三点：在实际应用中，这些内容将来自API响应。`
                    ],
                    ordered: Math.random() > 0.5
                }
            };
    }
}

// 生成图表数据
function generateChartData(query: string, formatType: DisplayFormat): MockSearchResponse {
    let chartConfig: ChartConfig;

    if (formatType === 'bar') {
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
    } else if (formatType === 'line') {
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

    return {
        format: formatType,
        contentProps: { chartConfig }
    };
}

// 预设的示例搜索结果
const EXAMPLE_SEARCH_RESULTS = [
    {
        id: '1',
        query: '什么是向量数据库？',
        format: 'list' as DisplayFormat,
        contentProps: {
            items: [
                '向量数据库是一种专门设计用于存储、索引和查询高维向量数据的数据库系统。',
                '它们在机器学习、人工智能和相似性搜索等应用中非常有用，因为这些领域通常需要处理大量的向量数据。',
                '向量数据库使用特殊的索引结构（如HNSW、IVF等）来加速相似性搜索，使得在数十亿向量中快速找到最相似的向量成为可能。'
            ],
            ordered: false
        }
    },
    {
        id: '2',
        query: '如何使用React Hooks实现状态管理？',
        format: 'list' as DisplayFormat,
        contentProps: {
            items: [
                <div key="1">
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">1. useState Hook</strong>
                    <p>useState 是最基本的状态管理 Hook，用于在函数组件中添加本地状态。</p>
                </div>,
                <div key="2">
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">2. useReducer Hook</strong>
                    <p>对于更复杂的状态逻辑，可以使用 useReducer。</p>
                </div>,
                <div key="3">
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">3. useContext Hook</strong>
                    <p>结合 Context API 可以实现跨组件的状态共享。</p>
                </div>
            ],
            ordered: true
        }
    },
    {
        id: '4',
        query: '2023年全球前五大科技公司市值',
        format: 'table' as DisplayFormat,
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
        format: 'list' as DisplayFormat,
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
        format: 'line' as DisplayFormat,
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
        format: 'pie' as DisplayFormat,
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
        format: 'bar' as DisplayFormat,
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
];

