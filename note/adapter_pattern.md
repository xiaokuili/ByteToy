# 适配器模式 (Adapter Pattern)

## 代码实现对比

### JavaScript 实现

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

// 问题代码：客户端需要处理不同的接口
function processPaymentsWithoutAdapter() {
  // 使用旧系统
  const legacyProcessor = new LegacyPaymentProcessor();
  const legacyResult = legacyProcessor.processPayment(100);
  console.log(`旧系统支付结果: ${legacyResult ? "成功" : "失败"}`);
  
  // 使用新系统
  const newGateway = new NewPaymentGateway();
  const newResult = newGateway.makePayment({
    amount: 200,
    currency: "CNY",
    timestamp: new Date().getTime()
  });
  console.log(`新系统支付结果: ${newResult.success ? "成功" : "失败"}`);
  console.log(`交易ID: ${newResult.transactionId}`);
  
  // 问题：接口不一致，客户端需要了解两种不同的接口
  // 如果要添加第三种支付系统，需要再学习一种接口
}

// 调用问题代码
processPaymentsWithoutAdapter();

// 适配器模式解决方案
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

// 统一的处理函数
function processPayment(processor, amount, currency = "CNY") {
  console.log("开始处理支付...");
  const result = processor.pay(amount, currency);
  console.log(`支付结果: ${result.success ? "成功" : "失败"}`);
  if (result.transactionId) {
    console.log(`交易ID: ${result.transactionId}`);
  }
  console.log("------------------------");
}

// 客户端使用适配器模式
function processPaymentsWithAdapter() {
  // 使用旧系统
  const legacyProcessor = new LegacyPaymentProcessor();
  const legacyAdapter = new LegacyPaymentAdapter(legacyProcessor);
  processPayment(legacyAdapter, 100);
  
  // 使用新系统
  const newGateway = new NewPaymentGateway();
  const newAdapter = new NewPaymentAdapter(newGateway);
  processPayment(newAdapter, 200);
  
  // 优点：客户端使用统一的接口，不需要了解底层实现
}

// 调用适配器模式解决方案
processPaymentsWithAdapter();
```

### Python 实现

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

# 问题代码：客户端需要处理不同的接口
def process_payments_without_adapter():
    import time
    
    # 使用旧系统
    legacy_processor = LegacyPaymentProcessor()
    legacy_result = legacy_processor.process_payment(100)
    print(f"旧系统支付结果: {'成功' if legacy_result else '失败'}")
    
    # 使用新系统
    new_gateway = NewPaymentGateway()
    new_result = new_gateway.make_payment({
        "amount": 200,
        "currency": "CNY",
        "timestamp": time.time()
    })
    print(f"新系统支付结果: {'成功' if new_result['success'] else '失败'}")
    print(f"交易ID: {new_result['transaction_id']}")
    
    # 问题：接口不一致，客户端需要了解两种不同的接口
    # 如果要添加第三种支付系统，需要再学习一种接口

# 调用问题代码
process_payments_without_adapter()

# 适配器模式解决方案
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

# 统一的处理函数
def process_payment(processor, amount, currency="CNY"):
    print("开始处理支付...")
    result = processor.pay(amount, currency)
    print(f"支付结果: {'成功' if result['success'] else '失败'}")
    if "transaction_id" in result:
        print(f"交易ID: {result['transaction_id']}")
    print("------------------------")

# 客户端使用适配器模式
def process_payments_with_adapter():
    # 使用旧系统
    legacy_processor = LegacyPaymentProcessor()
    legacy_adapter = LegacyPaymentAdapter(legacy_processor)
    process_payment(legacy_adapter, 100)
    
    # 使用新系统
    new_gateway = NewPaymentGateway()
    new_adapter = NewPaymentAdapter(new_gateway)
    process_payment(new_adapter, 200)
    
    # 优点：客户端使用统一的接口，不需要了解底层实现

# 调用适配器模式解决方案
process_payments_with_adapter()
```

## 修改成本分析

### 设计原则分析

适配器模式遵循以下设计原则：

1. **开闭原则 (Open/Closed Principle)**：
   - 问题代码：集成新系统需要修改客户端代码，违反了"对修改关闭"的原则
   - 适配器模式：可以通过创建新的适配器来支持新系统，而不需要修改现有代码，符合"对扩展开放，对修改关闭"的原则

2. **单一职责原则 (Single Responsibility Principle)**：
   - 问题代码：客户端代码需要了解并处理多种不同的接口
   - 适配器模式：每个适配器只负责转换一种特定的接口，职责单一

3. **依赖倒置原则 (Dependency Inversion Principle)**：
   - 问题代码：客户端直接依赖具体的实现类
   - 适配器模式：客户端依赖于抽象的 `PaymentProcessor` 接口，而不是具体实现

4. **接口隔离原则 (Interface Segregation Principle)**：
   - 适配器模式：通过适配器提供客户端所需的最小接口，隐藏不必要的复杂性

### 集成新系统的修改成本对比

假设需要集成第三种支付系统 `AlternativePaymentService`：

#### 问题代码的修改：

```javascript
// 第三方支付系统
class AlternativePaymentService {
  executeTransaction(transactionInfo) {
    console.log(`使用替代系统处理支付: ${transactionInfo.value}`);
    // 处理支付的代码...
    return { status: "completed", reference: "alt-12345" };
  }
}

// 需要修改客户端代码
function processPaymentsWithoutAdapter() {
  // 使用旧系统...
  
  // 使用新系统...
  
  // 使用替代系统（新增代码）
  const altService = new AlternativePaymentService();
  const altResult = altService.executeTransaction({
    value: 300,
    currency: "CNY",
    metadata: { source: "web" }
  });
  console.log(`替代系统支付结果: ${altResult.status === "completed" ? "成功" : "失败"}`);
  console.log(`参考号: ${altResult.reference}`);
  
  // 每添加一个新系统，都需要修改这个函数
  // 客户端需要了解每个系统的接口细节
}
```

修改成本：
- 需要修改现有客户端代码
- 客户端需要了解新系统的接口细节
- 代码变得越来越复杂，难以维护
- 如果有多个地方使用支付系统，需要在所有地方都添加新代码

#### 适配器模式的修改：

```javascript
// 只需创建新的适配器
class AlternativePaymentAdapter extends PaymentProcessor {
  constructor(altService) {
    super();
    this.altService = altService;
  }
  
  pay(amount, currency) {
    // 准备替代系统需要的数据格式
    const transactionInfo = {
      value: amount,
      currency: currency,
      metadata: { source: "web" }
    };
    // 调用替代系统的方法
    const result = this.altService.executeTransaction(transactionInfo);
    // 转换返回结果为统一格式
    return {
      success: result.status === "completed",
      transactionId: result.reference
    };
  }
}

// 客户端代码不需要修改，只需使用新适配器
function useNewPaymentSystem() {
  const altService = new AlternativePaymentService();
  const altAdapter = new AlternativePaymentAdapter(altService);
  processPayment(altAdapter, 300);
}
```

修改成本：
- 不需要修改现有代码，只需添加新的适配器类
- 客户端不需要了解新系统的接口细节
- 统一的处理函数可以处理所有支付系统
- 符合开闭原则

### 工作量减轻分析

适配器模式通过以下方式减轻工作量：

1. **接口统一**：
   - 将不同的接口转换为统一的接口
   - 客户端只需学习一种接口，而不是多种

2. **隔离变化**：
   - 将接口转换的逻辑封装在适配器中
   - 当第三方接口变化时，只需修改对应的适配器

3. **渐进式迁移**：
   - 可以在不破坏现有代码的情况下，逐步迁移到新系统
   - 可以同时支持新旧系统，便于过渡

4. **简化测试**：
   - 可以使用适配器将真实系统替换为模拟对象
   - 可以单独测试适配器，确保接口转换正确

### 实际应用案例

适配器模式在实际项目中的典型应用：

1. **数据格式转换**：将一种数据格式转换为另一种格式
2. **API集成**：集成第三方API，使其符合系统接口
3. **遗留系统集成**：将旧系统接口适配到新系统
4. **跨平台兼容**：使不同平台的组件可以一起工作

### 进一步优化

适配器模式还可以进一步优化：

1. **适配器工厂**：使用工厂模式创建适配器
2. **缓存适配器**：缓存适配器实例，避免重复创建
3. **双向适配器**：支持双向接口转换
4. **默认适配器**：为接口提供默认实现

```javascript
// 适配器工厂示例
class PaymentAdapterFactory {
  static getAdapter(paymentSystem) {
    if (paymentSystem instanceof LegacyPaymentProcessor) {
      return new LegacyPaymentAdapter(paymentSystem);
    } else if (paymentSystem instanceof NewPaymentGateway) {
      return new NewPaymentAdapter(paymentSystem);
    } else if (paymentSystem instanceof AlternativePaymentService) {
      return new AlternativePaymentAdapter(paymentSystem);
    } else {
      throw new Error("不支持的支付系统");
    }
  }
}

// 客户端使用工厂
const legacySystem = new LegacyPaymentProcessor();
const adapter = PaymentAdapterFactory.getAdapter(legacySystem);
processPayment(adapter, 100);
```

总结：适配器模式通过创建适配器类来转换接口，使得集成新系统或支持多系统时，只需创建新的适配器类，而不需要修改现有代码，从而显著降低了修改成本和工作量。它特别适合于需要集成不兼容接口的系统，或者需要使现有类与新接口一起工作的场景。