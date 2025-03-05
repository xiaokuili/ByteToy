# 观察者模式 (Observer Pattern)

## 代码实现对比

### JavaScript 实现

```javascript
// ==================== 问题代码 ====================
// 股票价格类 - 直接通知观察者
class StockPrice {
  constructor(symbol, price) {
    this.symbol = symbol;
    this.price = price;
  }
  
  setPrice(price) {
    this.price = price;
    
    // 直接通知各个观察者，导致高度耦合
    console.log(`通知投资者A: ${this.symbol} 价格变为 ${this.price}`);
    console.log(`通知投资者B: ${this.symbol} 价格变为 ${this.price}`);
    console.log(`通知投资者C: ${this.symbol} 价格变为 ${this.price}`);
    
    // 如果要添加新的观察者，必须修改这个方法
  }
}

// 客户端代码
const stock = new StockPrice("AAPL", 150);
stock.setPrice(155);
stock.setPrice(160);

// ==================== 观察者模式解决方案 ====================
// 主题接口（被观察者）
class Subject {
  constructor() {
    this.observers = [];
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notifyObservers() {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

// 具体主题
class BetterStockPrice extends Subject {
  constructor(symbol, price) {
    super();
    this.symbol = symbol;
    this.price = price;
  }
  
  setPrice(price) {
    this.price = price;
    this.notifyObservers();
  }
}

// 观察者接口
class Observer {
  update(subject) {
    throw new Error("Observer.update() 方法必须被重写");
  }
}

// 具体观察者
class Investor extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }
  
  update(subject) {
    console.log(`${this.name} 收到通知: ${subject.symbol} 价格变为 ${subject.price}`);
  }
}

// 客户端代码
const betterStock = new BetterStockPrice("AAPL", 150);

// 创建观察者
const investor1 = new Investor("投资者A");
const investor2 = new Investor("投资者B");
const investor3 = new Investor("投资者C");

// 注册观察者
betterStock.addObserver(investor1);
betterStock.addObserver(investor2);
betterStock.addObserver(investor3);

// 价格变化，自动通知所有观察者
betterStock.setPrice(155);

// 移除一个观察者
betterStock.removeObserver(investor2);

// 再次价格变化，只有剩余的观察者收到通知
betterStock.setPrice(160);
```

### Python 实现

```python
# ==================== 问题代码 ====================
# 股票价格类 - 直接通知观察者
class StockPrice:
    def __init__(self, symbol, price):
        self.symbol = symbol
        self.price = price
    
    def set_price(self, price):
        self.price = price
        
        # 直接通知各个观察者，导致高度耦合
        print(f"通知投资者A: {self.symbol} 价格变为 {self.price}")
        print(f"通知投资者B: {self.symbol} 价格变为 {self.price}")
        print(f"通知投资者C: {self.symbol} 价格变为 {self.price}")
        
        # 如果要添加新的观察者，必须修改这个方法

# 客户端代码
stock = StockPrice("AAPL", 150)
stock.set_price(155)
stock.set_price(160)

# ==================== 观察者模式解决方案 ====================
# 主题接口（被观察者）
class Subject:
    def __init__(self):
        self.observers = []
    
    def add_observer(self, observer):
        self.observers.append(observer)
    
    def remove_observer(self, observer):
        if observer in self.observers:
            self.observers.remove(observer)
    
    def notify_observers(self):
        for observer in self.observers:
            observer.update(self)

# 具体主题
class BetterStockPrice(Subject):
    def __init__(self, symbol, price):
        super().__init__()
        self.symbol = symbol
        self.price = price
    
    def set_price(self, price):
        self.price = price
        self.notify_observers()

# 观察者接口
class Observer:
    def update(self, subject):
        pass  # 抽象方法，需要在子类中实现

# 具体观察者
class Investor(Observer):
    def __init__(self, name):
        self.name = name
    
    def update(self, subject):
        print(f"{self.name} 收到通知: {subject.symbol} 价格变为 {subject.price}")

# 客户端代码
better_stock = BetterStockPrice("AAPL", 150)

# 创建观察者
investor1 = Investor("投资者A")
investor2 = Investor("投资者B")
investor3 = Investor("投资者C")

# 注册观察者
better_stock.add_observer(investor1)
better_stock.add_observer(investor2)
better_stock.add_observer(investor3)

# 价格变化，自动通知所有观察者
better_stock.set_price(155)

# 移除一个观察者
better_stock.remove_observer(investor2)

# 再次价格变化，只有剩余的观察者收到通知
better_stock.set_price(160)
```

## 修改成本分析

### 设计原则分析

观察者模式遵循以下设计原则：

1. **开闭原则 (Open/Closed Principle)**
   - 问题代码：添加新观察者需要修改主题类的通知方法，违反了"对修改关闭"的原则
   - 观察者模式：可以添加任意数量的观察者，而无需修改主题类，符合"对扩展开放，对修改关闭"的原则

2. **单一职责原则 (Single Responsibility Principle)**
   - 问题代码：主题类同时负责自身状态管理和通知所有观察者
   - 观察者模式：主题类只负责状态管理和触发通知，具体通知逻辑由各观察者自行实现

3. **依赖倒置原则 (Dependency Inversion Principle)**
   - 问题代码：主题类直接依赖具体观察者
   - 观察者模式：主题类依赖观察者接口，而不是具体观察者类，实现了依赖倒置

4. **迪米特法则 (Law of Demeter)**
   - 问题代码：主题类需要了解每个观察者的细节
   - 观察者模式：主题类只需知道观察者实现了update方法，不需要了解其内部实现

### 修改成本对比

假设需要添加一个新的观察者 `MobileApp`，用于在股票价格变化时发送手机通知。

#### 不使用观察者模式的修改：

```javascript
// 需要修改主题类
class StockPrice {
  constructor(symbol, price) {
    this.symbol = symbol;
    this.price = price;
  }
  
  setPrice(price) {
    this.price = price;
    
    // 直接通知各个观察者，导致高度耦合
    console.log(`通知投资者A: ${this.symbol} 价格变为 ${this.price}`);
    console.log(`通知投资者B: ${this.symbol} 价格变为 ${this.price}`);
    console.log(`通知投资者C: ${this.symbol} 价格变为 ${this.price}`);
    console.log(`通知手机应用: ${this.symbol} 价格变为 ${this.price}`);  // 新增通知
    
    // 每次添加新的观察者，都需要修改这个方法
  }
}
```

**修改成本**：
- 需要修改主题类的代码
- 主题类需要了解新观察者的细节
- 如果主题类在多个地方使用，修改风险更高
- 违反开闭原则

#### 使用观察者模式的修改：

```javascript
// 只需创建新的观察者类
class MobileApp extends Observer {
  constructor(appName) {
    super();
    this.appName = appName;
  }
  
  update(subject) {
    console.log(`${this.appName} 发送通知: ${subject.symbol} 价格变为 ${subject.price}`);
    // 发送手机通知的代码...
  }
}

// 客户端代码中注册新观察者
const mobileApp = new MobileApp("股票通知App");
betterStock.addObserver(mobileApp);
```

**修改成本**：
- 不需要修改主题类
- 只需创建新的观察者类并注册
- 主题类不需要了解新观察者的细节
- 符合开闭原则

### 工作量减轻分析

观察者模式通过以下方式显著减轻工作量：

1. **解耦主题和观察者**
   - 主题和观察者之间是松耦合的，互不依赖对方的具体实现
   - 可以独立开发和测试主题类和观察者类

2. **动态管理观察关系**
   - 可以在运行时动态添加或删除观察者
   - 不需要在编译时确定所有观察者

3. **简化主题类**
   - 主题类不需要知道如何通知每个具体的观察者
   - 主题类只负责维护观察者列表和触发通知

4. **支持多种通知方式**
   - 不同的观察者可以以不同的方式响应同一事件
   - 可以轻松添加新的通知方式，如邮件、短信、推送等

### 实际应用场景

观察者模式在实际项目中特别适用于以下场景：

1. **UI事件处理**：按钮点击、鼠标移动等事件触发多个处理器
2. **消息发布-订阅系统**：消息队列、事件总线
3. **数据绑定**：MVC/MVVM框架中的数据绑定
4. **系统监控**：监控系统状态变化并触发相应操作

### 进一步优化

观察者模式还可以进一步优化：

1. **事件过滤**：观察者可以只订阅感兴趣的事件类型
2. **优先级**：为观察者设置优先级，按优先级顺序通知
3. **异步通知**：使用异步方式通知观察者，避免阻塞主题
4. **弱引用**：使用弱引用存储观察者，避免内存泄漏

总结：观察者模式通过将主题和观察者解耦，使得添加或删除观察者时只需要创建新的观察者类或调用注册/注销方法，而不需要修改现有代码，从而显著降低了修改成本和工作量。它特别适合于对象间一对多的依赖关系，当一个对象状态改变时需要通知多个其他对象的场景。