v 0.0.1

- can run sql
- write table to view data
- 布局调整， 不应该有overflow
- 实现列表绑定数据
- table实现上下滚动
- 查询时添加loading
- 调整table 演示
- 实现添加变量
- 优化变量展示
- 实现query footer
- 测试数据展示
- table 去掉表头
- 实现variable 查询
- 点击footer visiable，展示一个面板在右边
- 底部滚动直接可以看到，而不是移动到底部才看到
- QueryViewComponent 有最小的值 ，占据当前所有的窗口
- 实现view-mode-selector
- 添加不同的实现方式，并且可以基于点击进行切换
- 添加切换table 和 view
- 调整footer布局，如果没有sql执行，footer不展示
- 抽取 VIEW_MODES 到factory ,从而支持footer toggle 可以进行动态的icon
- 在view-select中，鼠标移动到icon进行提示
- 完成bar example
- 重构factory函数，添加数据验证功能， 添加errorview 功能
- 更新生成图表高度
- sql执行后，必须切换到table 展示
- 优化左侧边栏展示
- 调整展示布局
- 修复 sql 执行 ， error 不显示问题
- 重构factory文件，解决格式问题
- 开始实现ai分析 页面
- 开始实现ai分析流程
- 实现llm-view 可以请求大模型接口功能
- 调整viewMode， 不应该有llm 展示在图形展示中
- 实现dashboard 的visualization 列表页面
- dashboard 添加title 和 variables 配置
- 实现copy card 功能
- 实现llm功能和展示
- 解决右边滚动条
- 解决dashbaord 太丑的问题
- 调整 dashboard 布局, 先添加一个配置框
- 调整header border
- 调整是否展示配置
- 基于dashboarrd section 数据结构进行实现
- 优化section选择大小等
- 优化图形的展示样式
- 添加设计基本信息
- 开始实现llm
- 实现llm loading 效果
- name 和 试图生成抽取
- 重写 query 页面 ， 重新定义数据

v0.0.2
感觉我要升级了 ，我知道怎么写了
实现一个sql查询页面

- 页面 https://www.figma.com/design/sCXneD6fYa1zyzLXo8AlPh/shadow?node-id=23-62&t=3F7JpEu0L7J99BNH-1

# SQL查询与可视化系统设计

## 1. 查询领域

### 核心能力

- 查询编辑能力

  - SQL内容管理
  - 变量解析与管理
  - 数据源选择

- 操作控制区
  - 预览按钮（触发SQL预览）
  - 执行按钮（触发查询执行）
- 查询执行能力
  - SQL预览
  - 查询执行
  - 结果处理

### 数据管理

- 查询状态
  ```
  sqlContent: string
  variables: Variable[]
  databaseId: string
  previewContent: string
  executionResult: Result
  isExecuting: boolean      // 是否正在执行查询,如果正在执行, 进行展示
  lastExecutedAt: Date      // 最后执行时间
  executionError: string    // 执行错误信息
  ```

### UI及交互

- 查询编辑区

  - SQL编辑器（实现查询编辑能力）
  - 变量展示和修改区（实现变量管理能力）
  - 数据源选择器（实现数据源选择能力）

- 操作控制区
  - 预览按钮（触发SQL预览）
  - 执行按钮（触发查询执行）

## 2. 可视化领域

### 核心能力

- 数据展示能力

  - 表格展示
  - 图表展示
  - 数据转换

- 视图控制能力
  - 视图切换
  - 视图配置
  - 展示规则管理

### 数据管理

- 视图状态

  ```
  viewMode: ViewMode

  ```

### UI及交互

- 展示区域
  - 数据视图（实现数据展示能力）
  - 视图选择器（实现视图控制能力）
  - 配置面板（实现视图配置能力）
