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
    - 执行数据管理模块进行查询   // 依赖isExecuting控制触发,依赖sql_content, variable, datasource实际执行
    - 选择展示类型  // 触发展示，依赖viewmode 控制执行， 但是sqlresult可能不变
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
