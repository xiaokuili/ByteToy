# 工厂模式 (Factory Pattern)

## 问题场景

当我们需要创建不同类型的对象时，通常会使用条件语句（if-else 或 switch）来决定创建哪种类型的对象。这种方式会导致代码难以维护，尤其是当需要添加新的对象类型时。

### JavaScript 问题代码

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

// 基于条件语句创建对象
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

// 客户端代码
const circle = createShape("CIRCLE");
circle.draw();

const rectangle = createShape("RECTANGLE");
rectangle.draw();
```

### Python 问题代码

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

# 基于条件语句创建对象
def create_shape(shape_type):
    if shape_type == "CIRCLE":
        return Circle()
    elif shape_type == "RECTANGLE":
        return Rectangle()
    elif shape_type == "SQUARE":
        return Square()
    return None

# 客户端代码
circle = create_shape("CIRCLE")
circle.draw()

rectangle = create_shape("RECTANGLE")
rectangle.draw()
```

## 工厂模式解决方案

工厂模式通过将对象的创建委托给专门的工厂类，使得客户端代码与具体产品类解耦。

### JavaScript 解决方案

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

// 工厂类
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

// 客户端代码
const factory = new ShapeFactory();

const circle = factory.createCircle();
circle.draw();

const rectangle = factory.createRectangle();
rectangle.draw();
```

### Python 解决方案

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

# 工厂类
class ShapeFactory:
    def create_circle(self):
        return Circle()
    
    def create_rectangle(self):
        return Rectangle()
    
    def create_square(self):
        return Square()

# 客户端代码
factory = ShapeFactory()

circle = factory.create_circle()
circle.draw()

rectangle = factory.create_rectangle()
rectangle.draw()
```

## 优点
1. 将对象的创建与使用分离
2. 客户端无需知道具体产品类的类名，只需知道对应的工厂方法
3. 添加新产品时，只需添加新的产品类和对应的工厂方法，无需修改现有代码
4. 符合开闭原则

## 文件修改成本分析

### 添加新产品类型的修改成本对比

假设我们需要添加一个新的形状类型 `Triangle`：

#### 不使用工厂模式时：

需要修改的文件和代码：
1. 创建新的 `Triangle` 类
2. 修改 `createShape` 函数，添加新的条件分支

```javascript
// 需要修改的函数
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

这种修改方式存在以下问题：
- 需要修改现有代码，可能引入错误
- 如果 `createShape` 函数在多个地方被使用，所有使用它的地方都可能需要适应这个变化
- 违反了开闭原则（对扩展开放，对修改关闭）

#### 使用工厂模式时：

需要修改的文件和代码：
1. 创建新的 `Triangle` 类
2. 在 `ShapeFactory` 类中添加新的工厂方法

```javascript
// 只需在工厂类中添加新方法，不需要修改现有方法
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
  
  createTriangle() {  // 新增方法
    return new Triangle();
  }
}
```

工厂模式的优势：
- 无需修改现有代码，只需添加新代码
- 客户端代码不需要修改，可以直接使用新的工厂方法
- 降低了引入错误的风险
- 符合开闭原则

### 工作量减轻

使用工厂模式后，添加新产品类型的工作量显著减轻：
1. 不需要寻找和修改所有使用条件语句创建对象的地方
2. 不需要测试现有功能是否因修改而被破坏
3. 新增功能的代码隔离性更好，更容易进行单元测试
4. 在大型项目中，可以避免因修改共享代码而导致的合并冲突

总结：工厂模式通过将对象创建逻辑集中到专门的工厂类中，使得添加新产品类型时只需要关注工厂类的扩展，而不需要修改现有代码，从而显著降低了文件修改成本和工作量。 