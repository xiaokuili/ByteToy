"use client"

interface DataItem {
    title: string 
    url?: string 
    source?: string
}

export default function DataCollector() {
    const exampleData: DataItem[] = [
        {
            title: "人工智能发展报告2023",
            url: "https://example.com/ai-report-2023",
            source: "中国科学院"
        },
        {
            title: "全球科技创新趋势分析",
            url: "https://example.com/tech-trends", 
            source: "麦肯锡咨询"
        },
        {
            title: "数字经济白皮书",
            url: "https://example.com/digital-economy",
            source: "国务院发展研究中心"
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">数据来源收集</h3>
            </div>

            <div className="space-y-2">
                {exampleData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg border">
                        <a 
                            href={item.url} 
                            className="hover:underline"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            {item.title}
                        </a>
                        <span className="text-sm text-foreground/70">{item.source}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}