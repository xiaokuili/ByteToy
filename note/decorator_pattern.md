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
coffee = SimpleCoffee()
print(f"{coffee.get_description()} - ¥{coffee.get_cost()}")

# 用牛奶装饰
coffee = MilkDecorator(coffee)
print(f"{coffee.get_description()} - ¥{coffee.get_cost()}")

# 再用糖装饰
coffee = SugarDecorator(coffee)
print(f"{coffee.get_description()} - ¥{coffee.get_cost()}")

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

### 添加新配料的修改成本对比

假设我们需要添加一个新的配料 "肉桂"：

#### 不使用装饰器模式时：

需要修改的文件和代码：
1. 创建新的子类 `CoffeeWithCinnamon`
2. 为每种可能的组合创建新的子类，如 `CoffeeWithMilkAndCinnamon`、`CoffeeWithSugarAndCinnamon`、`CoffeeWithMilkAndSugarAndCinnamon` 等

```javascript
// 新增子类
class CoffeeWithCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 1.5;
  }
  
  getDescription() {
    return super.getDescription() + "，加肉桂";
  }
}

// 新增组合子类
class CoffeeWithMilkAndCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 3.5;  // 2 (牛奶) + 1.5 (肉桂)
  }
  
  getDescription() {
    return super.getDescription() + "，加奶和肉桂";
  }
}

// 更多组合...
class CoffeeWithMilkAndSugarAndCinnamon extends Coffee {
  getCost() {
    return super.getCost() + 4.5;  // 2 (牛奶) + 1 (糖) + 1.5 (肉桂)
  }
  
  getDescription() {
    return super.getDescription() + "，加奶、糖和肉桂";
  }
}
```

这种修改方式存在以下问题：
- 需要创建大量新的子类，类的数量会随着配料种类的增加呈指数级增长
- 每个组合都需要单独维护，代码重复
- 如果基础咖啡类的行为发生变化，所有子类都需要相应修改
- 难以支持在运行时动态添加或删除配料

#### 使用装饰器模式时：

需要修改的文件和代码：
1. 只需创建一个新的装饰器类 `CinnamonDecorator`

```javascript
// 只需添加一个新的装饰器类
class CinnamonDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 1.5;
  }
  
  getDescription() {
    return this.coffee.getDescription() + "，加肉桂";
  }
}

// 客户端代码可以自由组合
let coffeeWithCinnamon = new SimpleCoffee();
coffeeWithCinnamon = new CinnamonDecorator(coffeeWithCinnamon);
console.log(`${coffeeWithCinnamon.getDescription()} - ¥${coffeeWithCinnamon.getCost()}`);

// 加奶、糖和肉桂的组合
let complexCoffee = new SimpleCoffee();
complexCoffee = new MilkDecorator(complexCoffee);
complexCoffee = new SugarDecorator(complexCoffee);
complexCoffee = new CinnamonDecorator(complexCoffee);
console.log(`${complexCoffee.getDescription()} - ¥${complexCoffee.getCost()}`);
```

装饰器模式的优势：
- 只需创建一个新的装饰器类，而不是多个组合子类
- 可以在运行时动态组合不同的装饰器
- 装饰器可以嵌套使用，支持任意组合
- 符合开闭原则，不需要修改现有代码

### 修改配料价格的修改成本对比

假设我们需要将牛奶的价格从 2 元调整为 2.5 元：

#### 不使用装饰器模式时：

需要修改所有包含牛奶的子类：
1. `CoffeeWithMilk`
2. `CoffeeWithMilkAndSugar`
3. `CoffeeWithMilkAndCinnamon`
4. `CoffeeWithMilkAndSugarAndCinnamon`
5. 其他可能的组合...

```javascript
// 需要修改多个类
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

// 更多需要修改的类...
```

#### 使用装饰器模式时：

只需修改 `MilkDecorator` 类：

```javascript
// 只需修改一个类
class MilkDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 2.5;  // 从 2 改为 2.5
  }
  // ...
}
```

### 工作量减轻

使用装饰器模式后，添加或修改功能的工作量显著减轻：
1. 不需要创建和维护大量的组合子类
2. 添加新功能只需创建一个新的装饰器类
3. 修改现有功能只需修改对应的装饰器类
4. 可以独立开发和测试每个装饰器
5. 客户端代码可以灵活组合不同的装饰器，而不需要依赖预定义的组合类

### 实际应用中的文件修改成本

在实际项目中，如果咖啡店菜单经常变化（添加新配料、调整价格等），使用装饰器模式可以显著降低维护成本：

1. **添加新配料**：只需添加一个新文件，而不是多个组合类文件
2. **修改价格**：只需修改一个文件，而不是多个包含该配料的组合类文件
3. **添加新的基础咖啡**：只需添加一个新的具体组件类，所有现有装饰器都可以直接应用
4. **修改基础咖啡**：只需修改基础咖啡类，所有装饰器都会自动继承这些变化

总结：装饰器模式通过将功能封装在独立的装饰器类中，使得添加或修改功能时只需要添加或修改相应的装饰器类，而不需要创建和维护大量的组合子类，从而显著降低了文件修改成本和工作量。 