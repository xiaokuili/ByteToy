# 装饰器模式 (Decorator Pattern)

## 问题场景

当需要给对象动态添加新功能，而又不想通过继承来扩展类（可能会导致类爆炸）时，通常会直接修改原始类或创建大量子类。这种方式会导致代码难以维护和扩展。

### JavaScript 问题代码

```javascript
// 咖啡类
class Coffee {
  getCost() {
    return 10;
  }
  
  getDescription() {
    return "普通咖啡";
  }
}

// 如果要添加不同配料，可能会创建大量子类
class CoffeeWithMilk extends Coffee {
  getCost() {
    return super.getCost() + 2;
  }
  
  getDescription() {
    return super.getDescription() + "，加奶";
  }
}

class CoffeeWithSugar extends Coffee {
  getCost() {
    return super.getCost() + 1;
  }
  
  getDescription() {
    return super.getDescription() + "，加糖";
  }
}

class CoffeeWithMilkAndSugar extends Coffee {
  getCost() {
    return super.getCost() + 3;
  }
  
  getDescription() {
    return super.getDescription() + "，加奶和糖";
  }
}

// 客户端代码
const coffee = new Coffee();
console.log(`${coffee.getDescription()} - ¥${coffee.getCost()}`);

const coffeeWithMilk = new CoffeeWithMilk();
console.log(`${coffeeWithMilk.getDescription()} - ¥${coffeeWithMilk.getCost()}`);

const coffeeWithSugar = new CoffeeWithSugar();
console.log(`${coffeeWithSugar.getDescription()} - ¥${coffeeWithSugar.getCost()}`);

const coffeeWithMilkAndSugar = new CoffeeWithMilkAndSugar();
console.log(`${coffeeWithMilkAndSugar.getDescription()} - ¥${coffeeWithMilkAndSugar.getCost()}`);

// 如果要添加更多配料，如巧克力、肉桂等，需要创建更多的子类，组合爆炸
```

### Python 问题代码

```python
# 咖啡类
class Coffee:
    def get_cost(self):
        return 10
    
    def get_description(self):
        return "普通咖啡"

# 如果要添加不同配料，可能会创建大量子类
class CoffeeWithMilk(Coffee):
    def get_cost(self):
        return super().get_cost() + 2
    
    def get_description(self):
        return super().get_description() + "，加奶"

class CoffeeWithSugar(Coffee):
    def get_cost(self):
        return super().get_cost() + 1
    
    def get_description(self):
        return super().get_description() + "，加糖"

class CoffeeWithMilkAndSugar(Coffee):
    def get_cost(self):
        return super().get_cost() + 3
    
    def get_description(self):
        return super().get_description() + "，加奶和糖"

# 客户端代码
coffee = Coffee()
print(f"{coffee.get_description()} - ¥{coffee.get_cost()}")

coffee_with_milk = CoffeeWithMilk()
print(f"{coffee_with_milk.get_description()} - ¥{coffee_with_milk.get_cost()}")

coffee_with_sugar = CoffeeWithSugar()
print(f"{coffee_with_sugar.get_description()} - ¥{coffee_with_sugar.get_cost()}")

coffee_with_milk_and_sugar = CoffeeWithMilkAndSugar()
print(f"{coffee_with_milk_and_sugar.get_description()} - ¥{coffee_with_milk_and_sugar.get_cost()}")

# 如果要添加更多配料，如巧克力、肉桂等，需要创建更多的子类，组合爆炸
```

## 装饰器模式解决方案

装饰器模式允许向一个现有的对象添加新的功能，同时又不改变其结构。这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能。

### JavaScript 解决方案

```javascript
// 组件接口
class Coffee {
  getCost() {
    throw new Error("Coffee.getCost() 方法必须被重写");
  }
  
  getDescription() {
    throw new Error("Coffee.getDescription() 方法必须被重写");
  }
}

// 具体组件
class SimpleCoffee extends Coffee {
  getCost() {
    return 10;
  }
  
  getDescription() {
    return "普通咖啡";
  }
}

// 装饰器基类
class CoffeeDecorator extends Coffee {
  constructor(coffee) {
    super();
    this.coffee = coffee;
  }
  
  getCost() {
    return this.coffee.getCost();
  }
  
  getDescription() {
    return this.coffee.getDescription();
  }
}

// 具体装饰器
class MilkDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 2;
  }
  
  getDescription() {
    return this.coffee.getDescription() + "，加奶";
  }
}

class SugarDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 1;
  }
  
  getDescription() {
    return this.coffee.getDescription() + "，加糖";
  }
}

class ChocolateDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 3;
  }
  
  getDescription() {
    return this.coffee.getDescription() + "，加巧克力";
  }
}

// 客户端代码
let coffee = new SimpleCoffee();
console.log(`${coffee.getDescription()} - ¥${coffee.getCost()}`);

// 用牛奶装饰
coffee = new MilkDecorator(coffee);
console.log(`${coffee.getDescription()} - ¥${coffee.getCost()}`);

// 再用糖装饰
coffee = new SugarDecorator(coffee);
console.log(`${coffee.getDescription()} - ¥${coffee.getCost()}`);

// 创建一个加奶、加巧克力的咖啡
let specialCoffee = new SimpleCoffee();
specialCoffee = new MilkDecorator(specialCoffee);
specialCoffee = new ChocolateDecorator(specialCoffee);
console.log(`${specialCoffee.getDescription()} - ¥${specialCoffee.getCost()}`);
```

### Python 解决方案

```python
# 组件接口
from abc import ABC, abstractmethod

class Coffee(ABC):
    @abstractmethod
    def get_cost(self):
        pass
    
    @abstractmethod
    def get_description(self):
        pass

# 具体组件
class SimpleCoffee(Coffee):
    def get_cost(self):
        return 10
    
    def get_description(self):
        return "普通咖啡"

# 装饰器基类
class CoffeeDecorator(Coffee):
    def __init__(self, coffee):
        self.coffee = coffee
    
    def get_cost(self):
        return self.coffee.get_cost()
    
    def get_description(self):
        return self.coffee.get_description()

# 具体装饰器
class MilkDecorator(CoffeeDecorator):
    def get_cost(self):
        return self.coffee.get_cost() + 2
    
    def get_description(self):
        return self.coffee.get_description() + "，加奶"

class SugarDecorator(CoffeeDecorator):
    def get_cost(self):
        return self.coffee.get_cost() + 1
    
    def get_description(self):
        return self.coffee.get_description() + "，加糖"

class ChocolateDecorator(CoffeeDecorator):
    def get_cost(self):
        return self.coffee.get_cost() + 3
    
    def get_description(self):
        return self.coffee.get_description() + "，加巧克力"

# 客户端代码
better_coffee = SimpleCoffee()
print(f"{better_coffee.get_description()} - ¥{better_coffee.get_cost()}")

# 用牛奶装饰
better_coffee = MilkDecorator(better_coffee)
print(f"{better_coffee.get_description()} - ¥{better_coffee.get_cost()}")

# 再用糖装饰
better_coffee = SugarDecorator(better_coffee)
print(f"{better_coffee.get_description()} - ¥{better_coffee.get_cost()}")

# 创建一个加奶、加巧克力的咖啡
special_coffee = SimpleCoffee()
special_coffee = MilkDecorator(special_coffee)
special_coffee = ChocolateDecorator(special_coffee)
print(f"{special_coffee.get_description()} - ¥{special_coffee.get_cost()}")
```

## 优点
1. 比继承更灵活，可以动态地添加或删除职责
2. 避免了类爆炸问题
3. 遵循开闭原则，可以在不修改现有代码的情况下添加新功能
4. 可以将多个装饰器组合使用

## 应用场景
1. 需要动态地给对象添加功能，而且这些功能可以动态地撤销
2. 需要为对象增加功能，但是增加的种类很多，为每种组合都创建子类会导致类爆炸
3. 不能通过继承扩展对象功能的场景（如最终类）

## 文件修改成本分析

### 设计原则分析

装饰器模式遵循以下设计原则：

1. **开闭原则 (Open/Closed Principle)**：
   - 问题代码：添加新配料组合需要创建新的子类，修改现有代码结构
   - 装饰器模式：可以通过创建新的装饰器类或组合现有装饰器来添加新功能，不需要修改现有代码

2. **单一职责原则 (Single Responsibility Principle)**：
   - 问题代码：每个子类负责特定的配料组合，职责不够单一
   - 装饰器模式：每个装饰器类只负责添加一种特定的功能，职责单一

3. **组合优于继承原则 (Composition Over Inheritance)**：
   - 问题代码：使用继承来扩展功能，导致类爆炸
   - 装饰器模式：使用组合来扩展功能，更加灵活

4. **依赖倒置原则 (Dependency Inversion Principle)**：
   - 装饰器模式：装饰器和被装饰对象都依赖于抽象接口，而不是具体实现

### 添加新配料的修改成本对比

假设需要添加一个新的配料"肉桂"：

#### 问题代码的修改：

```javascript
// 需要创建多个新类
class CoffeeWithCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 1.5;
  }
  
  getDescription() {
    return super.getDescription() + "，加肉桂";
  }
}

// 还需要为每种可能的组合创建新类
class CoffeeWithMilkAndCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 3.5;  // 2 (牛奶) + 1.5 (肉桂)
  }
  
  getDescription() {
    return super.getDescription() + "，加奶和肉桂";
  }
}

class CoffeeWithSugarAndCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 2.5;  // 1 (糖) + 1.5 (肉桂)
  }
  
  getDescription() {
    return super.getDescription() + "，加糖和肉桂";
  }
}

class CoffeeWithMilkAndSugarAndCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 4.5;  // 2 (牛奶) + 1 (糖) + 1.5 (肉桂)
  }
  
  getDescription() {
    return super.getDescription() + "，加奶、糖和肉桂";
  }
}

// 如果有更多配料，组合数量会呈指数级增长
```

修改成本：
- 需要创建多个新类，每个类代表一种配料组合
- 类的数量随配料种类的增加呈指数级增长
- 代码重复，难以维护
- 如果基础咖啡类的行为发生变化，所有子类都需要相应修改

#### 装饰器模式的修改：

```javascript
// 只需创建一个新的装饰器类
class CinnamonDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 1.5;
  }
  
  getDescription() {
    return this.coffee.getDescription() + "，加肉桂";
  }
}

// 客户端可以自由组合
let coffeeWithCinnamon = new SimpleCoffee();
coffeeWithCinnamon = new CinnamonDecorator(coffeeWithCinnamon);
console.log(`${coffeeWithCinnamon.getDescription()} - ¥${coffeeWithCinnamon.getCost()}`);

// 任意组合
let complexCoffee = new SimpleCoffee();
complexCoffee = new MilkDecorator(complexCoffee);
complexCoffee = new SugarDecorator(complexCoffee);
complexCoffee = new CinnamonDecorator(complexCoffee);
console.log(`${complexCoffee.getDescription()} - ¥${complexCoffee.getCost()}`);
```

修改成本：
- 只需创建一个新的装饰器类
- 不需要修改现有代码
- 可以与现有装饰器自由组合
- 代码简洁，易于维护

### 修改配料价格的修改成本对比

假设需要将牛奶的价格从 2 元调整为 2.5 元：

#### 问题代码的修改：

```javascript
// 需要修改所有包含牛奶的子类
class CoffeeWithMilk extends Coffee {
  getCost() {
    return super.getCost() + 2.5;  // 从 2 改为 2.5
  }
  // ...
}

class CoffeeWithMilkAndSugar extends Coffee {
  getCost() {
    return super.getCost() + 3.5;  // 从 3 改为 3.5
  }
  // ...
}

class CoffeeWithMilkAndCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 4;  // 从 3.5 改为 4
  }
  // ...
}

class CoffeeWithMilkAndSugarAndCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 5;  // 从 4.5 改为 5
  }
  // ...
}

// 更多包含牛奶的组合...
```

修改成本：
- 需要修改所有包含牛奶的子类
- 容易遗漏某些类，导致价格不一致
- 修改范围大，风险高
- 如果有多个地方使用了硬编码的价格，需要全部修改

#### 装饰器模式的修改：

```javascript
// 只需修改一个装饰器类
class MilkDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 2.5;  // 从 2 改为 2.5
  }
  
  getDescription() {
    return this.coffee.getDescription() + "，加奶";
  }
}
```

修改成本：
- 只需修改一个装饰器类
- 所有使用该装饰器的组合都会自动更新价格
- 修改范围小，风险低
- 价格逻辑集中在一处，易于维护

### 工作量减轻分析

装饰器模式通过以下方式减轻工作量：

1. **避免类爆炸**：
   - 使用组合而不是继承来扩展功能
   - n个配料只需要n个装饰器类，而不是2^n个子类

2. **动态组合**：
   - 可以在运行时动态组合不同的装饰器
   - 不需要预先定义所有可能的组合

3. **职责分离**：
   - 每个装饰器只负责添加一种特定的功能
   - 装饰器之间相互独立，可以单独开发和测试

4. **易于维护**：
   - 修改一个装饰器不会影响其他装饰器
   - 添加新功能只需创建新的装饰器类

### 实际应用案例

装饰器模式在实际项目中的典型应用：

1. **UI组件**：动态添加边框、滚动条、阴影等视觉效果
2. **输入输出流**：Java的I/O流库使用装饰器模式添加缓冲、加密等功能
3. **中间件**：Web框架中的请求处理中间件
4. **权限控制**：动态添加权限检查、日志记录等功能

### 进一步优化

装饰器模式还可以进一步优化：

1. **装饰器工厂**：使用工厂模式创建常用的装饰器组合
2. **装饰器注册表**：使用映射表根据名称或类型获取装饰器
3. **自动装饰**：根据配置自动应用装饰器
4. **装饰器顺序管理**：控制装饰器应用的顺序

```javascript
// 装饰器工厂示例
class CoffeeFactory {
  static createCoffeeWithMilkAndSugar() {
    let coffee = new SimpleCoffee();
    coffee = new MilkDecorator(coffee);
    coffee = new SugarDecorator(coffee);
    return coffee;
  }
  
  static createMochaCoffee() {
    let coffee = new SimpleCoffee();
    coffee = new MilkDecorator(coffee);
    coffee = new ChocolateDecorator(coffee);
    return coffee;
  }
}

// 客户端使用工厂
const mocha = CoffeeFactory.createMochaCoffee();
console.log(`${mocha.getDescription()} - ¥${mocha.getCost()}`);
```

总结：装饰器模式通过将功能封装在独立的装饰器类中，使得添加或修改功能时只需要添加或修改相应的装饰器类，而不需要创建和维护大量的组合子类，从而显著降低了修改成本和工作量。它特别适合于需要动态添加功能，且功能组合多样的场景。 