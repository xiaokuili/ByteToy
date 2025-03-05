# 适配器模式 (Adapter Pattern)

## 问题场景

当需要使用一个已有的类，但其接口与需求不匹配时，通常会直接修改已有类或创建新的类。这种方式可能会导致代码重复或破坏原有类的设计。

### JavaScript 问题代码

```javascript
// 已有的第三方支付处理类（无法修改）
class LegacyPaymentProcessor {
  processPayment(amount) {
    console.log(`使用旧系统处理支付: ${amount} 元`);
    // 处理支付的代码...
    return true;
  }
}

// 新的支付接口
class NewPaymentGateway {
  makePayment(paymentData) {
    // 新系统需要一个包含金额、货币和时间戳的对象
    console.log(`使用新系统处理支付: ${paymentData.amount} ${paymentData.currency}`);
    console.log(`时间戳: ${paymentData.timestamp}`);
    // 处理支付的代码...
    return { success: true, transactionId: "12345" };
  }
}

// 客户端代码
// 问题：客户端需要同时处理两种不同的接口
const legacyProcessor = new LegacyPaymentProcessor();
legacyProcessor.processPayment(100);  // 旧接口

const newGateway = new NewPaymentGateway();
newGateway.makePayment({  // 新接口
  amount: 100,
  currency: "CNY",
  timestamp: new Date().getTime()
});

// 如果要在系统中统一使用一种接口，需要修改大量代码
```

### Python 问题代码

```python
# 已有的第三方支付处理类（无法修改）
class LegacyPaymentProcessor:
    def process_payment(self, amount):
        print(f"使用旧系统处理支付: {amount} 元")
        # 处理支付的代码...
        return True

# 新的支付接口
class NewPaymentGateway:
    def make_payment(self, payment_data):
        # 新系统需要一个包含金额、货币和时间戳的字典
        print(f"使用新系统处理支付: {payment_data['amount']} {payment_data['currency']}")
        print(f"时间戳: {payment_data['timestamp']}")
        # 处理支付的代码...
        return {"success": True, "transaction_id": "12345"}

# 客户端代码
# 问题：客户端需要同时处理两种不同的接口
import time

legacy_processor = LegacyPaymentProcessor()
legacy_processor.process_payment(100)  # 旧接口

new_gateway = NewPaymentGateway()
new_gateway.make_payment({  # 新接口
    "amount": 100,
    "currency": "CNY",
    "timestamp": time.time()
})

# 如果要在系统中统一使用一种接口，需要修改大量代码
```

## 适配器模式解决方案

适配器模式允许将一个类的接口转换成客户端所期望的另一个接口。适配器让原本由于接口不兼容而不能一起工作的类可以一起工作。

### JavaScript 解决方案

```javascript
// 已有的第三方支付处理类（无法修改）
class LegacyPaymentProcessor {
  processPayment(amount) {
    console.log(`使用旧系统处理支付: ${amount} 元`);
    // 处理支付的代码...
    return true;
  }
}

// 新的支付接口
class NewPaymentGateway {
  makePayment(paymentData) {
    // 新系统需要一个包含金额、货币和时间戳的对象
    console.log(`使用新系统处理支付: ${paymentData.amount} ${paymentData.currency}`);
    console.log(`时间戳: ${paymentData.timestamp}`);
    // 处理支付的代码...
    return { success: true, transactionId: "12345" };
  }
}

// 目标接口
class PaymentProcessor {
  pay(amount, currency) {
    throw new Error("PaymentProcessor.pay() 方法必须被重写");
  }
}

// 适配器：将LegacyPaymentProcessor适配到PaymentProcessor接口
class LegacyPaymentAdapter extends PaymentProcessor {
  constructor(legacyProcessor) {
    super();
    this.legacyProcessor = legacyProcessor;
  }
  
  pay(amount, currency) {
    // 调用旧系统的方法
    const result = this.legacyProcessor.processPayment(amount);
    // 转换返回结果为统一格式
    return { success: result, transactionId: "legacy-" + Date.now() };
  }
}

// 适配器：将NewPaymentGateway适配到PaymentProcessor接口
class NewPaymentAdapter extends PaymentProcessor {
  constructor(newGateway) {
    super();
    this.newGateway = newGateway;
  }
  
  pay(amount, currency) {
    // 准备新系统需要的数据格式
    const paymentData = {
      amount: amount,
      currency: currency || "CNY",
      timestamp: new Date().getTime()
    };
    // 调用新系统的方法
    return this.newGateway.makePayment(paymentData);
  }
}

// 客户端代码
// 现在客户端可以使用统一的接口
function processPayment(processor, amount) {
  console.log("开始处理支付...");
  const result = processor.pay(amount, "CNY");
  console.log(`支付结果: ${result.success ? "成功" : "失败"}`);
  if (result.transactionId) {
    console.log(`交易ID: ${result.transactionId}`);
  }
  console.log("------------------------");
}

// 使用旧系统
const legacyProcessor = new LegacyPaymentProcessor();
const legacyAdapter = new LegacyPaymentAdapter(legacyProcessor);
processPayment(legacyAdapter, 100);

// 使用新系统
const newGateway = new NewPaymentGateway();
const newAdapter = new NewPaymentAdapter(newGateway);
processPayment(newAdapter, 200);
```

### Python 解决方案

```python
# 已有的第三方支付处理类（无法修改）
class LegacyPaymentProcessor:
    def process_payment(self, amount):
        print(f"使用旧系统处理支付: {amount} 元")
        # 处理支付的代码...
        return True

# 新的支付接口
class NewPaymentGateway:
    def make_payment(self, payment_data):
        # 新系统需要一个包含金额、货币和时间戳的字典
        print(f"使用新系统处理支付: {payment_data['amount']} {payment_data['currency']}")
        print(f"时间戳: {payment_data['timestamp']}")
        # 处理支付的代码...
        return {"success": True, "transaction_id": "12345"}

# 目标接口
from abc import ABC, abstractmethod
import time

class PaymentProcessor(ABC):
    @abstractmethod
    def pay(self, amount, currency):
        pass

# 适配器：将LegacyPaymentProcessor适配到PaymentProcessor接口
class LegacyPaymentAdapter(PaymentProcessor):
    def __init__(self, legacy_processor):
        self.legacy_processor = legacy_processor
    
    def pay(self, amount, currency):
        # 调用旧系统的方法
        result = self.legacy_processor.process_payment(amount)
        # 转换返回结果为统一格式
        return {"success": result, "transaction_id": f"legacy-{int(time.time())}"}

# 适配器：将NewPaymentGateway适配到PaymentProcessor接口
class NewPaymentAdapter(PaymentProcessor):
    def __init__(self, new_gateway):
        self.new_gateway = new_gateway
    
    def pay(self, amount, currency):
        # 准备新系统需要的数据格式
        payment_data = {
            "amount": amount,
            "currency": currency or "CNY",
            "timestamp": time.time()
        }
        # 调用新系统的方法
        return self.new_gateway.make_payment(payment_data)

# 客户端代码
# 现在客户端可以使用统一的接口
def process_payment(processor, amount):
    print("开始处理支付...")
    result = processor.pay(amount, "CNY")
    print(f"支付结果: {'成功' if result['success'] else '失败'}")
    if "transaction_id" in result:
        print(f"交易ID: {result['transaction_id']}")
    print("------------------------")

# 使用旧系统
legacy_processor = LegacyPaymentProcessor()
legacy_adapter = LegacyPaymentAdapter(legacy_processor)
process_payment(legacy_adapter, 100)

# 使用新系统
new_gateway = NewPaymentGateway()
new_adapter = NewPaymentAdapter(new_gateway)
process_payment(new_adapter, 200)
```

## 优点
1. 将接口不兼容的类可以一起工作
2. 实现了类之间的解耦
3. 提高了类的复用性
4. 符合开闭原则，不需要修改现有代码

## 应用场景
1. 需要使用一个已有的类，但其接口与需求不匹配
2. 需要复用一些现有的类，但不能修改其接口
3. 需要统一多个类的接口
4. 需要适配第三方库或遗留系统

## 文件修改成本分析

### 集成新系统的修改成本对比

假设我们的应用程序已经在多处使用了 `LegacyPaymentProcessor` 类，现在需要集成新的 `NewPaymentGateway` 系统。

#### 不使用适配器模式时：

需要修改的文件和代码：
1. 找到所有使用 `LegacyPaymentProcessor` 的地方
2. 修改这些地方的代码，使其适应 `NewPaymentGateway` 的接口

```javascript
// 原代码
const processor = new LegacyPaymentProcessor();
processor.processPayment(100);

// 修改后的代码
const gateway = new NewPaymentGateway();
gateway.makePayment({
  amount: 100,
  currency: "CNY",
  timestamp: new Date().getTime()
});
```

这种修改方式存在以下问题：
- 需要找到并修改所有使用旧接口的地方，工作量大
- 如果遗漏某些地方，可能导致系统部分功能失效
- 如果需要同时支持新旧两种系统，代码会变得复杂
- 修改范围大，容易引入错误
- 如果将来需要再次更换支付系统，需要再次修改所有这些地方

#### 使用适配器模式时：

需要修改的文件和代码：
1. 创建适配器类 `NewPaymentAdapter`
2. 将现有代码中的 `LegacyPaymentProcessor` 实例替换为 `NewPaymentAdapter` 实例

```javascript
// 创建适配器
class NewPaymentAdapter extends PaymentProcessor {
  constructor(newGateway) {
    super();
    this.newGateway = newGateway;
  }
  
  // 实现与旧接口兼容的方法
  pay(amount, currency) {
    const paymentData = {
      amount: amount,
      currency: currency || "CNY",
      timestamp: new Date().getTime()
    };
    return this.newGateway.makePayment(paymentData);
  }
}

// 客户端代码修改
// 原代码
const processor = new LegacyPaymentProcessor();
processor.processPayment(100);

// 修改后的代码
const gateway = new NewPaymentGateway();
const adapter = new NewPaymentAdapter(gateway);
// 使用与原接口兼容的方法
adapter.pay(100, "CNY");
```

适配器模式的优势：
- 不需要修改原有类的代码
- 不需要修改客户端代码的逻辑，只需替换对象实例
- 可以同时支持新旧两种系统
- 将来如果再次更换系统，只需创建新的适配器，而不需要修改客户端代码

### 支持多种支付系统的修改成本对比

假设我们需要同时支持多种支付系统，并且能够根据配置或用户选择动态切换：

#### 不使用适配器模式时：

需要在每个使用支付系统的地方添加条件判断：

```javascript
function handlePayment(amount, paymentSystem) {
  if (paymentSystem === "legacy") {
    const processor = new LegacyPaymentProcessor();
    return processor.processPayment(amount);
  } 
  else if (paymentSystem === "new") {
    const gateway = new NewPaymentGateway();
    return gateway.makePayment({
      amount: amount,
      currency: "CNY",
      timestamp: new Date().getTime()
    });
  }
  else if (paymentSystem === "third") {
    // 处理第三种支付系统
    // ...
  }
}
```

这种方式的问题：
- 每个使用支付系统的地方都需要添加条件判断
- 代码重复，难以维护
- 添加新的支付系统需要修改所有这些条件判断
- 客户端代码需要了解每个支付系统的具体接口

#### 使用适配器模式时：

创建一个工厂方法来获取适当的适配器：

```javascript
// 工厂方法
function getPaymentProcessor(type) {
  if (type === "legacy") {
    const processor = new LegacyPaymentProcessor();
    return new LegacyPaymentAdapter(processor);
  } 
  else if (type === "new") {
    const gateway = new NewPaymentGateway();
    return new NewPaymentAdapter(gateway);
  }
  else if (type === "third") {
    // 返回第三种支付系统的适配器
    // ...
  }
}

// 客户端代码
function handlePayment(amount, paymentSystem) {
  const processor = getPaymentProcessor(paymentSystem);
  return processor.pay(amount, "CNY");
}
```

适配器模式的优势：
- 客户端代码只需要知道统一的接口 `pay(amount, currency)`
- 条件判断只在一个地方（工厂方法）
- 添加新的支付系统只需创建新的适配器并修改工厂方法
- 客户端代码不需要了解各个支付系统的具体接口

### 工作量减轻

使用适配器模式后，集成新系统或支持多系统的工作量显著减轻：
1. 不需要修改现有的业务逻辑代码
2. 不需要了解每个系统的具体接口细节
3. 可以逐步迁移到新系统，而不是一次性替换
4. 添加新系统只需创建新的适配器类
5. 测试更容易，可以单独测试每个适配器

### 实际应用中的文件修改成本

在实际项目中，特别是大型项目，适配器模式的优势更为明显：

1. **系统集成**：当需要集成第三方API或服务时，只需创建适配器，而不需要修改现有代码
2. **系统迁移**：当从旧系统迁移到新系统时，可以使用适配器实现平滑过渡
3. **多版本支持**：当需要同时支持API的多个版本时，可以为每个版本创建适配器
4. **测试替代**：在测试环境中，可以使用适配器将真实服务替换为模拟服务

总结：适配器模式通过创建适配器类来转换接口，使得集成新系统或支持多系统时，只需创建新的适配器类，而不需要修改现有代码，从而显著降低了文件修改成本和工作量。 