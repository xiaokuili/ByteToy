import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dataSources = [
  {
    name: "医药产业统计数据",
    category: "api", 
    description: "获取医药行业相关的政府统计数据，包括产值、研发投入等",
    input: [
      { name: "year", type: "number", required: true },
      { name: "region", type: "string", required: true },
      { name: "industry", type: "string", required: true }
    ],
    output: [
      { name: "totalOutput", type: "number" },
      { name: "rdInvestment", type: "number" },
      { name: "employeeCount", type: "number" },
      { name: "growthRate", type: "number" }
    ],
    example: {
      input: { year: 2024, region: "中国", industry: "生物制药" },
      output: { totalOutput: 2800000, rdInvestment: 420000, employeeCount: 150000, growthRate: 0.12 }
    },
    version: "1.0.0",
    status: "active",
    tags: ["政府数据", "产业统计", "医药"]
  },
  {
    name: "行业研究报告库",
    category: "rag",
    description: "从行业研究报告中提取相关内容和数据",
    input: [
      { name: "keyword", type: "string", required: true },
      { name: "timeRange", type: "string", required: true },
      { name: "topic", type: "string", required: true }
    ],
    output: [
      { name: "content", type: "string" },
      { name: "source", type: "string" },
      { name: "publishDate", type: "string" }
    ],
    example: {
      input: { keyword: "CAR-T", timeRange: "2023-2024", topic: "市场分析" },
      output: { 
        content: "CAR-T疗法市场预计将在2024年达到...",
        source: "医药行业深度报告",
        publishDate: "2024-01-15"
      }
    },
    version: "1.0.0",
    status: "active",
    tags: ["研究报告", "行业分析", "医药"]
  },
  {
    name: "社交媒体趋势",
    category: "rag",
    description: "从社交媒体平台提取医药相关的热点讨论和趋势",
    input: [
      { name: "platform", type: "string", required: true },
      { name: "topic", type: "string", required: true },
      { name: "timeFrame", type: "string", required: true }
    ],
    output: [
      { name: "trendingSummary", type: "string" },
      { name: "sentimentScore", type: "number" },
      { name: "engagementMetrics", type: "object" }
    ],
    example: {
      input: { platform: "微博", topic: "新冠疫苗", timeFrame: "最近7天" },
      output: {
        trendingSummary: "关于新冠疫苗的讨论主要集中在...",
        sentimentScore: 0.75,
        engagementMetrics: {
          discussions: 15000,
          shares: 5000,
          likes: 25000
        }
      }
    },
    version: "1.0.0",
    status: "active",
    tags: ["社交媒体", "舆情分析", "医药"]
  }
]

async function main() {
  for (const data of dataSources) {
    await prisma.dataSource.create({ data })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })