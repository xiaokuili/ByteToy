# 观察者模式 (Observer Pattern)

## 问题场景

当一个对象的状态发生变化时，需要通知其他对象并自动更新它们。如果不使用观察者模式，通常会在对象状态变化的代码中直接调用其他对象的更新方法，导致对象之间的高度耦合。

### JavaScript 问题代码

```javascript
// 股票价格类
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
```

### Python 问题代码

```python
# 股票价格类
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
```

## 观察者模式解决方案

观察者模式定义了对象之间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会收到通知并自动更新。

### JavaScript 解决方案

```javascript
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
class StockPrice extends Subject {
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
const stock = new StockPrice("AAPL", 150);

// 创建观察者
const investor1 = new Investor("投资者A");
const investor2 = new Investor("投资者B");
const investor3 = new Investor("投资者C");

// 注册观察者
stock.addObserver(investor1);
stock.addObserver(investor2);
stock.addObserver(investor3);

// 价格变化，自动通知所有观察者
stock.setPrice(155);

// 移除一个观察者
stock.removeObserver(investor2);

// 再次价格变化，只有剩余的观察者收到通知
stock.setPrice(160);
```

### Python 解决方案

```python
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
class StockPrice(Subject):
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
stock = StockPrice("AAPL", 150)

# 创建观察者
investor1 = Investor("投资者A")
investor2 = Investor("投资者B")
investor3 = Investor("投资者C")

# 注册观察者
stock.add_observer(investor1)
stock.add_observer(investor2)
stock.add_observer(investor3)

# 价格变化，自动通知所有观察者
stock.set_price(155)

# 移除一个观察者
stock.remove_observer(investor2)

# 再次价格变化，只有剩余的观察者收到通知
stock.set_price(160)
```

## 优点
1. 实现了对象之间的松耦合关系
2. 支持广播通信
3. 符合开闭原则，可以在不修改现有代码的情况下添加新的观察者

## 应用场景
1. 事件处理系统
2. 消息订阅与发布
3. GUI框架中的事件监听
4. 数据变化通知

## 文件修改成本分析

### 添加新观察者的修改成本对比

假设我们需要添加一个新的观察者 `MobileApp`，用于在股票价格变化时发送手机通知。

#### 不使用观察者模式时：

需要修改的文件和代码：
1. 创建新的 `MobileApp` 类
2. 修改 `StockPrice` 类的 `setPrice` 方法，添加对新观察者的通知

```javascript
// 需要修改 StockPrice 类
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

这种修改方式存在以下问题：
- 需要修改现有代码，可能引入错误
- 主题类需要了解所有观察者的细节，导致高度耦合
- 每次添加或删除观察者都需要修改主题类
- 违反了开闭原则

#### 使用观察者模式时：

需要修改的文件和代码：
1. 创建新的 `MobileApp` 观察者类
2. 在客户端代码中注册新的观察者

```javascript
// 新增观察者类
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
stock.addObserver(mobileApp);
```

观察者模式的优势：
- 无需修改 `StockPrice` 类或其他现有观察者
- 主题类与观察者类解耦，互不了解对方的实现细节
- 可以在运行时动态添加或删除观察者
- 符合开闭原则

### 工作量减轻

使用观察者模式后，添加新观察者的工作量显著减轻：
1. 不需要修改主题类的代码
2. 不需要了解主题类的内部实现
3. 可以独立开发和测试新的观察者类
4. 可以在不影响现有功能的情况下添加新功能

### 移除观察者的修改成本对比

#### 不使用观察者模式时：

需要修改 `StockPrice` 类的 `setPrice` 方法，删除对特定观察者的通知代码。

#### 使用观察者模式时：

只需在客户端代码中调用 `removeObserver` 方法，无需修改任何类的实现。

```javascript
// 移除观察者
stock.removeObserver(investor2);
```

总结：观察者模式通过将主题和观察者解耦，使得添加或删除观察者时只需要创建新的观察者类或调用注册/注销方法，而不需要修改现有代码，从而显著降低了文件修改成本和工作量。 