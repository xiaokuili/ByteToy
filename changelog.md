# shadow:v0.0.2

实现 编写 sql, 基于 sql 进行查询和展示
https://www.figma.com/design/sCXneD6fYa1zyzLXo8AlPh/shadow?node-id=23-62&t=3F7JpEu0L7J99BNH-1

# SQL 查询与可视化系统设计

## 1. 查询

### 核心能力

- 查询编辑能力

  - SQL 内容管理
  - 变量管理
  - 数据源选择

- 操作控制区
  - 执行按钮（提交可以执行命令）

### 数据管理

```
sqlContent: string          // 用户输入
variables: Variable[]       // 用户输入，用户修改
databaseId: string             // 用户选择
isExecuting: boolean        // 不进行真正执行，只维护状态 单独渲染
```

## 2. 可视化领域

### 核心能力

- 数据展示能力
  - 执行数据管理模块进行查询 // 依赖 isExecuting 控制触发,依赖 sql_content, variable, datasource 实际执行
  - 选择展示类型 // 触发展示，依赖 viewmode 控制执行， 但是 sqlresult 可能不变
  - 基于选择类型进行展示

### 数据管理

- 视图状态

  ```
  viewMode: ViewMode


  ```

### UI 及交互

- 展示区域
  - 数据视图（实现数据展示能力）
  - 视图选择器（实现视图控制能力）
  - 配置面板（实现视图配置能力）

# 报告系统设计

## 可视化组件

### 核心功能

- 图表检索
- 画布图表管理
  - 添加图表
  - 删除图表
  - 图表排序

### 数据结构

```typescript
interface Visualization {
  viewId: string;
  sqlContent: string;
  sqlVariables: Record<string, unknown>;
  databaseId: string;
  llmConfig?: LLMConfig;
}

interface DashboardSection {
  viewId: string;
  sqlContent: string;
  sqlVariables: Record<string, unknown>;
  databaseId: string;
  llmConfig?: LLMConfig;
  order: number;
}

type DashboardSections = DashboardSection[];
```

## 文本组件

### 核心功能

- 文本内容管理
  - 标题管理
  - 段落管理
- AI 辅助内容生成

### 数据结构

```typescript
interface TextSection {
  type: "title" | "paragraph";
  content: string;
  order: number;
  aiGenerated?: boolean;
}
```

v 1.1.2

1. 实现 dashboard
2. 列表展示存在问题，多个列表公用一套参数
3. 解决多次渲染的问题，更新列表影响其他列表
4. 测试是否 updatesection 的问题， 是这个的问题， 更新 viewid 开始 viewfactory 渲染就开始有问题
5. 为什么到 view 就开始出问题， 是因为 isexecuting 导致的问题
6. 添加一个外部暴露的 execute 函数
7. query 需要不停的修改 view。dashboard 自己定义函数


v 1.1.3  实现 dashboard 模块
1. 测试dashboard section 和 内容大小关系 
2. 调整修改section name
3. 实现保存功能
4. dashbaord 添加id
5. 添加一个数据爬虫，爬去搜索引擎
6。 实现llm