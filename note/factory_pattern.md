# 工厂模式 (Factory Pattern)

## 代码实现对比

### JavaScript 实现

```javascript
// 产品类
class Circle {
  draw() {
    console.log("画一个圆形");
  }
}

class Rectangle {
  draw() {
    console.log("画一个矩形");
  }
}

class Square {
  draw() {
    console.log("画一个正方形");
  }
}

// 问题代码：基于条件语句创建对象
function createShape(shapeType) {
  if (shapeType === "CIRCLE") {
    return new Circle();
  } else if (shapeType === "RECTANGLE") {
    return new Rectangle();
  } else if (shapeType === "SQUARE") {
    return new Square();
  }
  return null;
}

// 客户端使用问题代码
const circle = createShape("CIRCLE");
circle.draw();
const rectangle = createShape("RECTANGLE");
rectangle.draw();

// 工厂模式解决方案
class ShapeFactory {
  createCircle() {
    return new Circle();
  }
  
  createRectangle() {
    return new Rectangle();
  }
  
  createSquare() {
    return new Square();
  }
}

// 客户端使用工厂模式
const factory = new ShapeFactory();
const betterCircle = factory.createCircle();
betterCircle.draw();
const betterRectangle = factory.createRectangle();
betterRectangle.draw();
```

### Python 实现

```python
# 产品类
class Circle:
    def draw(self):
        print("画一个圆形")

class Rectangle:
    def draw(self):
        print("画一个矩形")

class Square:
    def draw(self):
        print("画一个正方形")

# 问题代码：基于条件语句创建对象
def create_shape(shape_type):
    if shape_type == "CIRCLE":
        return Circle()
    elif shape_type == "RECTANGLE":
        return Rectangle()
    elif shape_type == "SQUARE":
        return Square()
    return None

# 客户端使用问题代码
circle = create_shape("CIRCLE")
circle.draw()
rectangle = create_shape("RECTANGLE")
rectangle.draw()

# 工厂模式解决方案
class ShapeFactory:
    def create_circle(self):
        return Circle()
    
    def create_rectangle(self):
        return Rectangle()
    
    def create_square(self):
        return Square()

# 客户端使用工厂模式
factory = ShapeFactory()
better_circle = factory.create_circle()
better_circle.draw()
better_rectangle = factory.create_rectangle()
better_rectangle.draw()
```

## 修改成本分析

### 设计原则分析

工厂模式遵循以下设计原则：

1. **开闭原则 (Open/Closed Principle)**：
   - 问题代码：添加新形状需要修改 `createShape` 函数，违反了"对修改关闭"的原则
   - 工厂模式：只需在 `ShapeFactory` 类中添加新方法，不需要修改现有代码，符合"对扩展开放，对修改关闭"的原则

2. **单一职责原则 (Single Responsibility Principle)**：
   - 问题代码：`createShape` 函数承担了所有形状创建的职责
   - 工厂模式：每个工厂方法只负责创建一种特定类型的对象，职责更加单一

3. **依赖倒置原则 (Dependency Inversion Principle)**：
   - 问题代码：客户端代码直接依赖于具体产品类和创建逻辑
   - 工厂模式：客户端代码依赖于工厂接口，而不是具体产品类，降低了耦合度

4. **接口隔离原则 (Interface Segregation Principle)**：
   - 工厂模式：为每种产品提供专门的创建方法，客户端只需使用它需要的方法

### 添加新形状的修改成本对比

假设需要添加一个新的形状类型 `Triangle`：

#### 问题代码的修改：

```javascript
// 需要修改现有函数
function createShape(shapeType) {
  if (shapeType === "CIRCLE") {
    return new Circle();
  } else if (shapeType === "RECTANGLE") {
    return new Rectangle();
  } else if (shapeType === "SQUARE") {
    return new Square();
  } else if (shapeType === "TRIANGLE") {  // 新增条件分支
    return new Triangle();
  }
  return null;
}
```

修改成本：
- 需要修改现有代码，可能引入错误
- 需要重新测试整个函数
- 如果 `createShape` 在多个地方使用，修改风险更高
- 违反开闭原则

#### 工厂模式的修改：

```javascript
// 只需添加新方法，不修改现有代码
class ShapeFactory {
  createCircle() { return new Circle(); }
  createRectangle() { return new Rectangle(); }
  createSquare() { return new Square(); }
  createTriangle() { return new Triangle(); } // 新增方法
}
```

修改成本：
- 只需添加新代码，不需要修改现有代码
- 只需测试新添加的方法
- 现有客户端代码不受影响
- 符合开闭原则

### 工作量减轻分析

工厂模式通过以下方式减轻工作量：

1. **隔离变化点**：
   - 将对象创建逻辑集中在工厂类中，使变化被限制在一个地方
   - 当需要修改创建逻辑时，只需修改工厂类，而不是分散在多处的条件语句

2. **简化客户端代码**：
   - 客户端不需要知道如何创建对象，只需调用相应的工厂方法
   - 减少了客户端代码的复杂性和维护成本

3. **提高代码可测试性**：
   - 可以单独测试工厂类和产品类
   - 可以更容易地模拟或替换工厂，便于单元测试

4. **支持并行开发**：
   - 工厂类和产品类可以由不同的开发人员并行开发
   - 只要接口保持一致，各部分可以独立演化

### 实际应用案例

在实际项目中，工厂模式特别适用于以下场景：

1. **UI组件库**：根据配置创建不同类型的按钮、表单元素等
2. **数据库连接**：根据配置创建不同类型的数据库连接
3. **API客户端**：根据需求创建不同类型的API请求
4. **插件系统**：动态加载和创建不同类型的插件

总结：工厂模式通过将对象创建逻辑封装在专门的工厂类中，使系统更容易扩展和维护。它符合开闭原则，允许在不修改现有代码的情况下添加新的产品类型，从而显著降低了修改成本和工作量。 