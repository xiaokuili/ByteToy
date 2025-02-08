import { dataSources } from '@/schema';
import db from '@/lib/drizzle';
const seedDataSources = [
  {
    id: 'ds1',
    name: '小红书搜索',
    category: 'api',
    description: '获取小红书搜索结果作为数据源',
    input: [
      {
        name: 'keyword',
        type: 'string',
        required: true
      },
      {
        name: 'limit',
        type: 'number',
        required: false
      }
    ],
    output: [
      {
        name: 'title',
        type: 'string'
      },
      {
        name: 'content',
        type: 'string'
      },
      {
        name: 'author',
        type: 'string'
      }
    ],
    example: {
      input: {
        keyword: "减肥食谱",
        limit: 10
      },
      output: {
        title: "超简单的减肥餐食谱",
        content: "今天给大家分享一周减肥餐...",
        author: "健康生活家"
      }
    },
    version: '1.0.0',
    status: 'active',
    tags: ['社交媒体', '小红书', '搜索'],
    usageCount: 0
  },
  {
    id: 'ds2', 
    name: '百度搜索',
    category: 'api',
    description: '获取百度搜索结果作为数据源',
    input: [
      {
        name: 'keyword',
        type: 'string',
        required: true
      },
      {
        name: 'page',
        type: 'number',
        required: false
      }
    ],
    output: [
      {
        name: 'title',
        type: 'string'
      },
      {
        name: 'snippet',
        type: 'string'
      },
      {
        name: 'url',
        type: 'string'
      }
    ],
    example: {
      input: {
        keyword: "人工智能",
        page: 1
      },
      output: {
        title: "人工智能(AI)的发展历程_百度百科",
        snippet: "人工智能从诞生到现在经历了多个发展阶段...",
        url: "https://baike.baidu.com/item/人工智能"
      }
    },
    version: '1.0.0',
    status: 'active',
    tags: ['搜索引擎', '百度'],
    usageCount: 0
  },
  {
    id: 'ds3',
    name: '论文检索',
    category: 'rag',
    description: '检索学术论文数据库',
    input: [
      {
        name: 'keyword',
        type: 'string',
        required: true
      },
      {
        name: 'year',
        type: 'number',
        required: false
      },
      {
        name: 'language',
        type: 'string',
        required: false
      }
    ],
    output: [
      {
        name: 'title',
        type: 'string'
      },
      {
        name: 'abstract',
        type: 'string'
      },
      {
        name: 'authors',
        type: 'string[]'
      },
      {
        name: 'journal',
        type: 'string'
      }
    ],
    example: {
      input: {
        keyword: "机器学习",
        year: 2023,
        language: "zh"
      },
      output: {
        title: "深度学习在自然语言处理中的应用研究",
        abstract: "本文探讨了深度学习技术在自然语言处理领域的最新进展...",
        authors: ["张三", "李四"],
        journal: "计算机研究与发展"
      }
    },
    version: '1.0.0',
    status: 'active',
    tags: ['学术', '论文', '研究'],
    usageCount: 0
  }
];

async function seed() {
  console.log('Seeding database...');
  
  try {
    await db.insert(dataSources).values(seedDataSources);
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// 运行 seed
seed();