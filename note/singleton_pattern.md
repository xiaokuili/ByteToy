# 单例模式 (Singleton Pattern)

## 代码实现对比

### JavaScript 实现

```javascript
// 问题代码：每次创建新实例
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

// 客户端使用问题代码
const conn1 = new DatabaseConnection("mongodb://localhost:27017/mydb");
conn1.query("SELECT * FROM users");

const conn2 = new DatabaseConnection("mongodb://localhost:27017/mydb");
conn2.query("SELECT * FROM products");

console.log(conn1 === conn2); // false，两个不同的实例

// 单例模式解决方案
class SingletonDatabaseConnection {
  constructor(connectionString) {
    if (SingletonDatabaseConnection.instance) {
      return SingletonDatabaseConnection.instance;
    }
    
    this.connectionString = connectionString;
    console.log(`创建新的数据库连接: ${connectionString}`);
    // 连接数据库的代码...
    
    SingletonDatabaseConnection.instance = this;
  }
  
  query(sql) {
    console.log(`执行SQL: ${sql}`);
    // 查询数据库的代码...
  }
  
  // 静态方法提供全局访问点
  static getInstance(connectionString = "mongodb://localhost:27017/mydb") {
    if (!SingletonDatabaseConnection.instance) {
      SingletonDatabaseConnection.instance = new SingletonDatabaseConnection(connectionString);
    }
    return SingletonDatabaseConnection.instance;
  }
}

// 客户端使用单例模式
const singletonConn1 = SingletonDatabaseConnection.getInstance();
singletonConn1.query("SELECT * FROM users");

const singletonConn2 = SingletonDatabaseConnection.getInstance();
singletonConn2.query("SELECT * FROM products");

console.log(singletonConn1 === singletonConn2); // true，是同一个实例
```

### Python 实现

```python
# 问题代码：每次创建新实例
class DatabaseConnection:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        print(f"创建新的数据库连接: {connection_string}")
        # 连接数据库的代码...
    
    def query(self, sql):
        print(f"执行SQL: {sql}")
        # 查询数据库的代码...

# 客户端使用问题代码
conn1 = DatabaseConnection("mongodb://localhost:27017/mydb")
conn1.query("SELECT * FROM users")

conn2 = DatabaseConnection("mongodb://localhost:27017/mydb")
conn2.query("SELECT * FROM products")

print(conn1 is conn2)  # False，两个不同的实例

# 单例模式解决方案
class SingletonDatabaseConnection:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(SingletonDatabaseConnection, cls).__new__(cls)
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

# 客户端使用单例模式
singleton_conn1 = SingletonDatabaseConnection("mongodb://localhost:27017/mydb")
singleton_conn1.query("SELECT * FROM users")

singleton_conn2 = SingletonDatabaseConnection()  # 不需要再传入连接字符串
singleton_conn2.query("SELECT * FROM products")

print(singleton_conn1 is singleton_conn2)  # True，是同一个实例
```

## 修改成本分析

### 设计原则分析

单例模式涉及以下设计原则：

1. **单一职责原则 (Single Responsibility Principle)**：
   - 单例类除了自身业务逻辑外，还承担了保证单一实例的职责
   - 这是单例模式的一个小缺点，但通常可以接受，因为实例管理与类的核心功能紧密相关

2. **开闭原则 (Open/Closed Principle)**：
   - 单例模式一旦实现，通常不需要修改单例的创建逻辑
   - 业务逻辑的变化只需修改单例类的相关方法，不影响单例的创建机制

3. **依赖倒置原则 (Dependency Inversion Principle)**：
   - 客户端代码依赖于单例类的抽象接口，而不是具体实现细节
   - 可以通过接口或抽象类进一步增强这一点

4. **接口隔离原则 (Interface Segregation Principle)**：
   - 单例类应该只提供必要的方法，避免过于臃肿的接口

### 从普通类转换为单例类的修改成本对比

假设应用程序已经在多处使用了 `DatabaseConnection` 类，现在需要确保它只有一个实例。

#### 不使用单例模式的解决方案：

```javascript
// 全局变量方式
const globalDbConnection = new DatabaseConnection("mongodb://localhost:27017/mydb");

// 需要修改所有使用 DatabaseConnection 的地方
// 原代码：
const conn = new DatabaseConnection("mongodb://localhost:27017/mydb");
conn.query("SELECT * FROM users");

// 修改后：
globalDbConnection.query("SELECT * FROM users");
```

修改成本：
- 需要找到并修改所有创建 `DatabaseConnection` 实例的地方
- 可能遗漏某些创建实例的代码，导致仍然创建多个实例
- 全局变量可能导致命名冲突和依赖问题
- 修改范围大，容易引入错误

#### 使用单例模式的解决方案：

```javascript
// 修改 DatabaseConnection 类为单例
class DatabaseConnection {
  constructor(connectionString) {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connectionString = connectionString;
    console.log(`创建新的数据库连接: ${connectionString}`);
    // 连接数据库的代码...
    
    DatabaseConnection.instance = this;
  }
  
  // 其他方法保持不变...
  
  static getInstance(connectionString = "mongodb://localhost:27017/mydb") {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(connectionString);
    }
    return DatabaseConnection.instance;
  }
}

// 客户端代码可以逐步迁移
// 方式1：继续使用构造函数（会返回单例）
const conn1 = new DatabaseConnection("mongodb://localhost:27017/mydb");

// 方式2：使用getInstance方法（更明确的单例用法）
const conn2 = DatabaseConnection.getInstance();
```

修改成本：
- 只需修改 `DatabaseConnection` 类本身
- 现有代码可以继续使用 `new DatabaseConnection()`，因为构造函数已经被修改为返回单例
- 可以逐步将代码迁移到使用 `getInstance()` 方法
- 不需要修改业务逻辑代码

### 工作量减轻分析

单例模式通过以下方式减轻工作量：

1. **集中管理实例创建逻辑**：
   - 实例的创建和管理逻辑集中在类本身，而不是分散在客户端代码中
   - 当需要修改实例创建逻辑时，只需修改单例类，而不是多处客户端代码

2. **渐进式迁移**：
   - 可以在不破坏现有代码的情况下，逐步将系统迁移到使用单例模式
   - 可以同时支持直接构造和 `getInstance()` 方法，便于过渡

3. **简化资源管理**：
   - 集中管理共享资源，如数据库连接、线程池等
   - 避免资源浪费和不一致状态

4. **减少全局变量**：
   - 避免使用全局变量来共享实例，减少命名冲突和依赖问题
   - 单例的访问点更加明确和受控

### 实际应用案例

单例模式在实际项目中的典型应用：

1. **配置管理器**：存储应用程序配置，确保所有组件使用相同的配置
2. **数据库连接池**：管理数据库连接，避免创建过多连接
3. **日志记录器**：提供统一的日志记录接口
4. **缓存管理器**：集中管理缓存，避免数据不一致
5. **应用程序状态**：管理应用程序全局状态

### 注意事项

虽然单例模式可以减少修改成本，但也有一些注意事项：

1. **测试难度**：单例模式可能使单元测试变得困难，因为测试依赖于全局状态
2. **并发问题**：在多线程环境中，需要确保单例的线程安全
3. **过度使用**：不应该将单例模式用于所有类，只用于确实需要单一实例的情况

总结：单例模式通过将实例的创建和访问逻辑封装在类本身中，使得从普通类转换为单例类时只需修改类本身，而不需要修改所有使用该类的代码，从而显著降低了修改成本和工作量。