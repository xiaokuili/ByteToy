# 策略模式 (Strategy Pattern)

## 问题场景

当需要在运行时选择不同的算法或行为时，通常会使用条件语句（if-else 或 switch）来选择不同的行为。这种方式会导致代码难以维护，尤其是当算法复杂或需要添加新的算法时。

### JavaScript 问题代码

```javascript
// 支付处理类
class PaymentProcessor {
  processPayment(amount, paymentType) {
    if (paymentType === "CREDIT_CARD") {
      // 信用卡支付逻辑
      console.log(`使用信用卡支付 ${amount} 元`);
      console.log("验证信用卡信息...");
      console.log("连接信用卡网关...");
      console.log("处理支付...");
      console.log("记录交易...");
    } 
    else if (paymentType === "PAYPAL") {
      // PayPal支付逻辑
      console.log(`使用PayPal支付 ${amount} 元`);
      console.log("重定向到PayPal...");
      console.log("用户登录PayPal...");
      console.log("确认支付...");
      console.log("处理回调...");
    }
    else if (paymentType === "WECHAT") {
      // 微信支付逻辑
      console.log(`使用微信支付 ${amount} 元`);
      console.log("生成二维码...");
      console.log("等待扫码...");
      console.log("处理支付通知...");
    }
    else {
      console.log("不支持的支付方式");
    }
  }
}

// 客户端代码
const processor = new PaymentProcessor();
processor.processPayment(100, "CREDIT_CARD");
processor.processPayment(200, "PAYPAL");
processor.processPayment(300, "WECHAT");
```

### Python 问题代码

```python
# 支付处理类
class PaymentProcessor:
    def process_payment(self, amount, payment_type):
        if payment_type == "CREDIT_CARD":
            # 信用卡支付逻辑
            print(f"使用信用卡支付 {amount} 元")
            print("验证信用卡信息...")
            print("连接信用卡网关...")
            print("处理支付...")
            print("记录交易...")
        
        elif payment_type == "PAYPAL":
            # PayPal支付逻辑
            print(f"使用PayPal支付 {amount} 元")
            print("重定向到PayPal...")
            print("用户登录PayPal...")
            print("确认支付...")
            print("处理回调...")
        
        elif payment_type == "WECHAT":
            # 微信支付逻辑
            print(f"使用微信支付 {amount} 元")
            print("生成二维码...")
            print("等待扫码...")
            print("处理支付通知...")
        
        else:
            print("不支持的支付方式")

# 客户端代码
processor = PaymentProcessor()
processor.process_payment(100, "CREDIT_CARD")
processor.process_payment(200, "PAYPAL")
processor.process_payment(300, "WECHAT")
```

## 策略模式解决方案

策略模式定义了一系列算法，并将每个算法封装起来，使它们可以互相替换。策略模式让算法独立于使用它的客户端而变化。

### JavaScript 解决方案

```javascript
// 策略接口
class PaymentStrategy {
  pay(amount) {
    throw new Error("PaymentStrategy.pay() 方法必须被重写");
  }
}

// 具体策略
class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`使用信用卡支付 ${amount} 元`);
    console.log("验证信用卡信息...");
    console.log("连接信用卡网关...");
    console.log("处理支付...");
    console.log("记录交易...");
  }
}

class PayPalPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`使用PayPal支付 ${amount} 元`);
    console.log("重定向到PayPal...");
    console.log("用户登录PayPal...");
    console.log("确认支付...");
    console.log("处理回调...");
  }
}

class WeChatPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`使用微信支付 ${amount} 元`);
    console.log("生成二维码...");
    console.log("等待扫码...");
    console.log("处理支付通知...");
  }
}

// 上下文类
class BetterPaymentProcessor {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  
  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  
  processPayment(amount) {
    if (!this.paymentStrategy) {
      console.log("请先设置支付方式");
      return;
    }
    this.paymentStrategy.pay(amount);
  }
}

// 客户端代码
const betterProcessor = new BetterPaymentProcessor();

// 使用信用卡支付
betterProcessor.setPaymentStrategy(new CreditCardPayment());
betterProcessor.processPayment(100);

// 切换到PayPal支付
betterProcessor.setPaymentStrategy(new PayPalPayment());
betterProcessor.processPayment(200);

// 切换到微信支付
betterProcessor.setPaymentStrategy(new WeChatPayment());
betterProcessor.processPayment(300);
```

### Python 解决方案

```python
# 策略接口
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

# 具体策略
class CreditCardPayment(PaymentStrategy):
    def pay(self, amount):
        print(f"使用信用卡支付 {amount} 元")
        print("验证信用卡信息...")
        print("连接信用卡网关...")
        print("处理支付...")
        print("记录交易...")

class PayPalPayment(PaymentStrategy):
    def pay(self, amount):
        print(f"使用PayPal支付 {amount} 元")
        print("重定向到PayPal...")
        print("用户登录PayPal...")
        print("确认支付...")
        print("处理回调...")

class WeChatPayment(PaymentStrategy):
    def pay(self, amount):
        print(f"使用微信支付 {amount} 元")
        print("生成二维码...")
        print("等待扫码...")
        print("处理支付通知...")

# 上下文类
class BetterPaymentProcessor:
    def __init__(self, payment_strategy=None):
        self.payment_strategy = payment_strategy
    
    def set_payment_strategy(self, payment_strategy):
        self.payment_strategy = payment_strategy
    
    def process_payment(self, amount):
        if not self.payment_strategy:
            print("请先设置支付方式")
            return
        self.payment_strategy.pay(amount)

# 客户端代码
better_processor = BetterPaymentProcessor()

# 使用信用卡支付
better_processor.set_payment_strategy(CreditCardPayment())
better_processor.process_payment(100)

# 切换到PayPal支付
better_processor.set_payment_strategy(PayPalPayment())
better_processor.process_payment(200)

# 切换到微信支付
better_processor.set_payment_strategy(WeChatPayment())
better_processor.process_payment(300)
```

## 优点
1. 将算法的定义与使用分离
2. 消除了条件语句
3. 可以在运行时切换算法
4. 符合开闭原则，可以在不修改现有代码的情况下添加新的策略

## 应用场景
1. 不同的算法适用于不同的场景
2. 需要在运行时选择不同的行为
3. 有多个条件分支的代码
4. 避免使用多重条件选择语句

## 文件修改成本分析

### 设计原则分析

策略模式遵循以下设计原则：

1. **开闭原则 (Open/Closed Principle)**：
   - 问题代码：添加新的支付方式需要修改 `processPayment` 方法，违反了"对修改关闭"的原则
   - 策略模式：可以添加新的策略类，而无需修改现有代码，符合"对扩展开放，对修改关闭"的原则

2. **单一职责原则 (Single Responsibility Principle)**：
   - 问题代码：`PaymentProcessor` 类负责多种支付方式的处理逻辑
   - 策略模式：每个策略类只负责一种支付方式，职责单一

3. **依赖倒置原则 (Dependency Inversion Principle)**：
   - 问题代码：`PaymentProcessor` 类直接依赖具体的支付逻辑
   - 策略模式：`BetterPaymentProcessor` 类依赖于抽象的 `PaymentStrategy` 接口，而不是具体实现

4. **里氏替换原则 (Liskov Substitution Principle)**：
   - 策略模式：所有策略类都实现相同的接口，可以互相替换，不影响上下文类的行为

### 添加新支付方式的修改成本对比

假设需要添加一个新的支付方式 `ApplePay`：

#### 问题代码的修改：

```javascript
// 需要修改现有方法
processPayment(amount, paymentType) {
  if (paymentType === "CREDIT_CARD") {
    // 信用卡支付逻辑...
  } 
  else if (paymentType === "PAYPAL") {
    // PayPal支付逻辑...
  }
  else if (paymentType === "WECHAT") {
    // 微信支付逻辑...
  }
  else if (paymentType === "APPLE_PAY") {  // 新增条件分支
    // Apple Pay支付逻辑
    console.log(`使用Apple Pay支付 ${amount} 元`);
    console.log("验证设备...");
    console.log("连接Apple服务器...");
    console.log("处理支付...");
    console.log("记录交易...");
  }
  else {
    console.log("不支持的支付方式");
  }
}
```

修改成本：
- 需要修改现有代码，可能引入错误
- 随着支付方式的增加，方法会变得越来越长，难以维护
- 如果支付逻辑复杂，条件语句会变得更加复杂
- 违反开闭原则
- 如果相同的条件判断在多个地方出现，需要在所有地方都添加新的条件分支

#### 策略模式的修改：

```javascript
// 只需添加新的策略类
class ApplePayPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`使用Apple Pay支付 ${amount} 元`);
    console.log("验证设备...");
    console.log("连接Apple服务器...");
    console.log("处理支付...");
    console.log("记录交易...");
  }
}

// 客户端代码使用新策略
betterProcessor.setPaymentStrategy(new ApplePayPayment());
betterProcessor.processPayment(400);
```

修改成本：
- 不需要修改现有代码，只需添加新的策略类
- 上下文类 `BetterPaymentProcessor` 不需要任何修改
- 每个策略类都是独立的，易于测试和维护
- 符合开闭原则
- 可以在运行时动态切换策略

### 修改支付逻辑的修改成本对比

假设需要修改信用卡支付的逻辑，添加新的安全验证步骤：

#### 问题代码的修改：

```javascript
// 需要修改条件语句中的一部分
processPayment(amount, paymentType) {
  if (paymentType === "CREDIT_CARD") {
    // 修改信用卡支付逻辑
    console.log(`使用信用卡支付 ${amount} 元`);
    console.log("验证信用卡信息...");
    console.log("进行3D安全验证...");  // 新增步骤
    console.log("验证持卡人身份...");  // 新增步骤
    console.log("连接信用卡网关...");
    console.log("处理支付...");
    console.log("记录交易...");
  } 
  else if (paymentType === "PAYPAL") {
    // PayPal支付逻辑...
  }
  // 其他支付方式...
}
```

修改成本：
- 需要修改包含多个支付逻辑的方法
- 修改一种支付方式可能影响其他支付方式
- 需要重新测试整个方法
- 如果支付逻辑在多个地方重复，需要在所有地方都进行修改

#### 策略模式的修改：

```javascript
// 只需修改特定的策略类
class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`使用信用卡支付 ${amount} 元`);
    console.log("验证信用卡信息...");
    console.log("进行3D安全验证...");  // 新增步骤
    console.log("验证持卡人身份...");  // 新增步骤
    console.log("连接信用卡网关...");
    console.log("处理支付...");
    console.log("记录交易...");
  }
}
```

修改成本：
- 只需修改特定的策略类，不影响其他策略
- 修改范围小，风险低
- 只需测试修改的策略类
- 上下文类和其他策略类不受影响

### 工作量减轻分析

策略模式通过以下方式减轻工作量：

1. **算法封装**：
   - 将每种算法封装在独立的类中，使其易于理解和维护
   - 避免了大型条件语句的复杂性

2. **消除重复代码**：
   - 如果相同的算法在多个地方使用，策略模式可以消除重复代码
   - 算法的修改只需在一个地方进行

3. **支持并行开发**：
   - 不同的策略可以由不同的开发人员并行开发
   - 只要接口保持一致，各策略可以独立演化

4. **简化测试**：
   - 可以单独测试每个策略类
   - 可以使用模拟对象替换真实策略进行测试

### 实际应用案例

策略模式在实际项目中的典型应用：

1. **验证策略**：不同的表单验证规则
2. **排序算法**：根据不同条件选择不同的排序算法
3. **价格计算**：不同的折扣策略或税费计算
4. **路由策略**：不同的路由算法或负载均衡策略

### 进一步优化

策略模式还可以进一步优化：

1. **策略工厂**：使用工厂模式创建策略对象
2. **策略注册表**：使用映射表根据名称或类型获取策略
3. **默认策略**：提供默认策略，避免空策略检查
4. **组合策略**：将多个策略组合成复合策略

```javascript
// 策略工厂示例
class PaymentStrategyFactory {
  static getStrategy(type) {
    switch(type) {
      case "CREDIT_CARD": return new CreditCardPayment();
      case "PAYPAL": return new PayPalPayment();
      case "WECHAT": return new WeChatPayment();
      case "APPLE_PAY": return new ApplePayPayment();
      default: throw new Error(`不支持的支付方式: ${type}`);
    }
  }
}

// 客户端代码使用工厂
const strategy = PaymentStrategyFactory.getStrategy("CREDIT_CARD");
betterProcessor.setPaymentStrategy(strategy);
betterProcessor.processPayment(100);
```

总结：策略模式通过将不同的算法封装在独立的策略类中，使得添加或修改算法时只需要添加或修改相应的策略类，而不需要修改使用这些算法的上下文类，从而显著降低了修改成本和工作量。它特别适合于有多种算法或行为，且需要在运行时动态选择的场景。 