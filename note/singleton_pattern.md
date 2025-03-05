# 单例模式 (Singleton Pattern)

## 问题场景

在某些情况下，我们需要确保一个类只有一个实例，并提供一个全局访问点。例如，数据库连接、线程池、配置管理器等。如果不使用单例模式，可能会创建多个实例，导致资源浪费或不一致的状态。

### JavaScript 问题代码

```javascript
// 数据库连接类
class DatabaseConnection {
  constructor(connectionString) {
    this.connectionString = connectionString;
    console.log(`创建新的数据库连接: ${connectionString}`);
    // 连接数据库的代码...
  }
  
  query(sql) {
    console.log(`执行SQL: ${sql}`);
    // 查询数据库的代码...
  }
}

// 客户端代码
// 在不同的地方创建多个连接实例
const conn1 = new DatabaseConnection("mongodb://localhost:27017/mydb");
conn1.query("SELECT * FROM users");

// 另一处代码又创建了一个新连接
const conn2 = new DatabaseConnection("mongodb://localhost:27017/mydb");
conn2.query("SELECT * FROM products");

// 创建了不必要的多个连接实例，浪费资源
console.log(conn1 === conn2); // false，两个不同的实例
```

### Python 问题代码

```python
# 数据库连接类
class DatabaseConnection:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        print(f"创建新的数据库连接: {connection_string}")
        # 连接数据库的代码...
    
    def query(self, sql):
        print(f"执行SQL: {sql}")
        # 查询数据库的代码...

# 客户端代码
# 在不同的地方创建多个连接实例
conn1 = DatabaseConnection("mongodb://localhost:27017/mydb")
conn1.query("SELECT * FROM users")

# 另一处代码又创建了一个新连接
conn2 = DatabaseConnection("mongodb://localhost:27017/mydb")
conn2.query("SELECT * FROM products")

# 创建了不必要的多个连接实例，浪费资源
print(conn1 is conn2)  # False，两个不同的实例
```

## 单例模式解决方案

单例模式确保一个类只有一个实例，并提供一个全局访问点。

### JavaScript 解决方案

```javascript
// 数据库连接类 - 单例模式
class DatabaseConnection {
  constructor(connectionString) {
    this.connectionString = connectionString;
    console.log(`创建新的数据库连接: ${connectionString}`);
    // 连接数据库的代码...
  }
  
  query(sql) {
    console.log(`执行SQL: ${sql}`);
    // 查询数据库的代码...
  }
  
  // 静态方法提供全局访问点
  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection("mongodb://localhost:27017/mydb");
    }
    return DatabaseConnection.instance;
  }
}

// 客户端代码
const conn1 = DatabaseConnection.getInstance();
conn1.query("SELECT * FROM users");

const conn2 = DatabaseConnection.getInstance();
conn2.query("SELECT * FROM products");

// 验证是否是同一个实例
console.log(conn1 === conn2); // true，是同一个实例
```

### Python 解决方案

```python
# 数据库连接类 - 单例模式
class DatabaseConnection:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self, connection_string=None):
        if not self._initialized:
            self.connection_string = connection_string or "mongodb://localhost:27017/mydb"
            print(f"创建新的数据库连接: {self.connection_string}")
            # 连接数据库的代码...
            self._initialized = True
    
    def query(self, sql):
        print(f"执行SQL: {sql}")
        # 查询数据库的代码...

# 客户端代码
conn1 = DatabaseConnection("mongodb://localhost:27017/mydb")
conn1.query("SELECT * FROM users")

conn2 = DatabaseConnection()  # 不需要再传入连接字符串
conn2.query("SELECT * FROM products")

# 验证是否是同一个实例
print(conn1 is conn2)  # True，是同一个实例
```

## 优点
1. 保证一个类只有一个实例，节约系统资源
2. 提供了对唯一实例的全局访问点
3. 可以严格控制客户怎样以及何时访问它

## 注意事项
1. JavaScript中可以使用模块模式或闭包实现更简洁的单例
2. Python中还可以使用装饰器或元类实现单例
3. 单例模式可能会使测试变得困难

## 文件修改成本分析

### 从普通类转换为单例类的修改成本对比

假设我们的应用程序已经在多处使用了 `DatabaseConnection` 类，现在需要确保它只有一个实例。

#### 不使用单例模式时的解决方案：

需要修改的文件和代码：
1. 在应用程序的入口点创建一个全局实例
2. 修改所有使用 `DatabaseConnection` 的地方，改为使用全局实例

```javascript
// 全局实例
const globalDbConnection = new DatabaseConnection("mongodb://localhost:27017/mydb");

// 需要修改所有使用 DatabaseConnection 的地方
// 原代码：
const conn = new DatabaseConnection("mongodb://localhost:27017/mydb");
conn.query("SELECT * FROM users");

// 修改后：
globalDbConnection.query("SELECT * FROM users");
```

这种修改方式存在以下问题：
- 需要找到并修改所有创建 `DatabaseConnection` 实例的地方
- 可能遗漏某些创建实例的代码，导致仍然创建多个实例
- 全局变量可能导致命名冲突和依赖问题
- 修改范围大，容易引入错误

#### 使用单例模式时：

需要修改的文件和代码：
1. 只需修改 `DatabaseConnection` 类本身，添加单例实现

```javascript
// 只需修改这一个类
class DatabaseConnection {
  // 原有代码保持不变
  constructor(connectionString) {
    this.connectionString = connectionString;
    console.log(`创建新的数据库连接: ${connectionString}`);
    // 连接数据库的代码...
  }
  
  query(sql) {
    console.log(`执行SQL: ${sql}`);
    // 查询数据库的代码...
  }
  
  // 添加单例方法
  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection("mongodb://localhost:27017/mydb");
    }
    return DatabaseConnection.instance;
  }
}
```

然后，可以逐步将代码中的 `new DatabaseConnection()` 替换为 `DatabaseConnection.getInstance()`，而不会影响系统的正常运行。

单例模式的优势：
- 只需修改一个类文件，不需要修改所有使用该类的地方
- 可以渐进式地将代码迁移到使用单例模式
- 封装了单例的创建逻辑，客户端代码不需要关心实例如何创建
- 降低了引入错误的风险

### 工作量减轻

使用单例模式后，确保类只有一个实例的工作量显著减轻：
1. 不需要创建和管理全局变量
2. 不需要修改所有使用该类的代码
3. 单例的创建和访问逻辑集中在一处，易于维护
4. 可以在不影响现有功能的情况下逐步迁移代码

总结：单例模式通过将实例的创建和访问逻辑封装在类本身中，使得从普通类转换为单例类时只需修改类本身，而不需要修改所有使用该类的代码，从而显著降低了文件修改成本和工作量。 