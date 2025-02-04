# SAAS报告生成系统 - 核心需求分析

## 1. 质疑需求 (Make Requirements Less Dumb)

### 核心目标
- 自动化生成标准报告

### 必要功能
- 模板定义和使用
- 数据获取和处理
- 报告内容生成
- 定期推送

## 2. 删除不必要部分 (Delete Parts)

### 删除的功能
- 用户管理
- 权限控制
- 多格式支持
- 实时预览
- 协作功能
- 历史版本
- 高级分析

### 保留的核心系统
- 模板系统
- 数据系统
- 报告生成系统
- 定时推送系统


## 模板系统（可以生成内容的大纲列表， 大纲包含数据如何和获取和内容如何生成）
目标：AI辅助用户生成模板

路径优化： 用户输入需求， 系统生成模板， 用户确认模板
interface ReportRequirement {
  title: {
    template: string     
    variables: Record<string, string | number>  
  }

  history_sample?: {
    files: File[]     
    type: 'history' | 'reference'  
  }

  // 关键需求
  key: {
    // 必要的章节列表
    sections: string[]    // 例如：["市场概况", "重点企业分析", "发展趋势"]
    
    // 需要的数据列表
    data_needs: string[]  // 例如：["企业营收数据", "市场规模数据", "投资数据"]
    
    // 分析重点列表
    focus: string[]       // 例如：["重点关注创新药企业", "关注融资情况"]
  }
}
// 1. 数据模板 - 负责数据获取和处理
interface DataTemplate {
  id: string
  source: string
  query: string
  transform: {
    type: 'function' | 'module'
    name: string
    params?: Record<string, any>
  }[]
}

// 2. 内容模板 - 负责内容生成
interface ContentTemplate {
  id: string
  type: 'text' | 'table' | 'chart' | 'image' | 'mixed'
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'custom'
  generator: {
    type: 'ai' | 'function' | 'mixed'
    config: {
      prompt?: string
      function?: string
      params?: Record<string, any>
    }
  }
  display: {
    template: string
    style?: Record<string, any>
  }
}

// 3. 报告模板 - 只负责组织结构
interface ReportTemplate {
  id: string
  name: string
  description: string
  
  outline: Array<{
    id: string
    title: string
    level: number
    order: number
    dataTemplateId?: string    // 引用数据模板
    contentTemplateId: string  // 引用内容模板
  }>
}