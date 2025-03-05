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
class PaymentProcessor {
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
const processor = new PaymentProcessor();

// 使用信用卡支付
processor.setPaymentStrategy(new CreditCardPayment());
processor.processPayment(100);

// 切换到PayPal支付
processor.setPaymentStrategy(new PayPalPayment());
processor.processPayment(200);

// 切换到微信支付
processor.setPaymentStrategy(new WeChatPayment());
processor.processPayment(300);
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
class PaymentProcessor:
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
processor = PaymentProcessor()

# 使用信用卡支付
processor.set_payment_strategy(CreditCardPayment())
processor.process_payment(100)

# 切换到PayPal支付
processor.set_payment_strategy(PayPalPayment())
processor.process_payment(200)

# 切换到微信支付
processor.set_payment_strategy(WeChatPayment())
processor.process_payment(300)
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

### 添加新支付方式的修改成本对比

假设我们需要添加一个新的支付方式 `ApplePay`：

#### 不使用策略模式时：

需要修改的文件和代码：
1. 修改 `PaymentProcessor` 类的 `processPayment` 方法，添加新的条件分支

```javascript
// 需要修改的方法
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

这种修改方式存在以下问题：
- 需要修改现有代码，可能引入错误
- 随着支付方式的增加，方法会变得越来越长，难以维护
- 如果支付逻辑复杂，条件语句会变得更加复杂
- 违反了开闭原则
- 如果相同的条件判断在多个地方出现，需要在所有地方都添加新的条件分支

#### 使用策略模式时：

需要修改的文件和代码：
1. 创建新的策略类 `ApplePayPayment`

```javascript
// 新增策略类
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
processor.setPaymentStrategy(new ApplePayPayment());
processor.processPayment(400);
```

策略模式的优势：
- 无需修改现有代码，只需添加新的策略类
- 上下文类 `PaymentProcessor` 不需要知道具体策略的实现细节
- 每个策略类都是独立的，易于测试和维护
- 符合开闭原则
- 可以在运行时动态切换策略

### 修改支付逻辑的修改成本对比

假设我们需要修改信用卡支付的逻辑，添加新的安全验证步骤：

#### 不使用策略模式时：

需要修改 `PaymentProcessor` 类的 `processPayment` 方法中的信用卡支付逻辑部分。

```javascript
// 需要修改的方法
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

#### 使用策略模式时：

只需修改 `CreditCardPayment` 策略类的 `pay` 方法。

```javascript
// 只需修改这个类
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

### 工作量减轻

使用策略模式后，添加或修改算法的工作量显著减轻：
1. 不需要修改包含条件语句的复杂方法
2. 每个策略类都是独立的，可以由不同的开发人员并行开发
3. 可以单独测试每个策略类，不会影响其他策略
4. 代码组织更清晰，每个策略类只负责一种算法
5. 减少了因修改条件语句而引入错误的风险

总结：策略模式通过将不同的算法封装在独立的策略类中，使得添加或修改算法时只需要添加或修改相应的策略类，而不需要修改使用这些算法的上下文类，从而显著降低了文件修改成本和工作量。 