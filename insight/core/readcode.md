# LangChain PromptTemplate 设计模式分析

本文档重点分析 LangChain 中 PromptTemplate 类的设计模式应用，展示这些模式如何减轻开发者工作量。

## 1. 工厂模式 (Factory Pattern)

### 设计模式
工厂模式提供了创建对象的统一接口，隐藏对象创建的复杂性。PromptTemplate 类实现了多个工厂方法，简化了模板实例的创建过程。

### 代码实现
```python
@classmethod
def from_template(
    cls,
    template: str,
    *,
    template_format: PromptTemplateFormat = "f-string",
    partial_variables: Optional[dict[str, Any]] = None,
    **kwargs: Any,
) -> PromptTemplate:
    """Load a prompt template from a template."""
    input_variables = get_template_variables(template, template_format)
    _partial_variables = partial_variables or {}

    if _partial_variables:
        input_variables = [
            var for var in input_variables if var not in _partial_variables
        ]

    return cls(
        input_variables=input_variables,
        template=template,
        template_format=template_format,
        partial_variables=_partial_variables,
        **kwargs,
    )
```

```python
@classmethod
def from_file(
    cls,
    template_file: Union[str, Path],
    input_variables: Optional[list[str]] = None,
    encoding: Optional[str] = None,
    **kwargs: Any,
) -> PromptTemplate:
    """Load a prompt from a file."""
    template = Path(template_file).read_text(encoding=encoding)
    return cls.from_template(template=template, **kwargs)
```

```python
@classmethod
def from_examples(
    cls,
    examples: list[str],
    suffix: str,
    input_variables: list[str],
    example_separator: str = "\n\n",
    prefix: str = "",
    **kwargs: Any,
) -> PromptTemplate:
    """Take examples in list format with prefix and suffix to create a prompt."""
    template = example_separator.join([prefix, *examples, suffix])
    return cls(input_variables=input_variables, template=template, **kwargs)
```

### 分析
工厂模式在这里显著减轻了开发者工作量：

1. **自动化参数推导**：通过 `get_template_variables` 函数自动分析模板字符串并提取变量名，开发者无需手动执行这一容易出错的步骤。
   ```python
   # 无需手动指定输入变量
   prompt = PromptTemplate.from_template("你好，{name}，今天是{date}") 
   # 自动推导出 input_variables = ["name", "date"]
   ```

2. **提供多种创建方式**：根据不同场景提供针对性的创建方法，使代码更加清晰。
   - 从字符串创建：适合简单模板或动态生成
   - 从文件创建：适合复杂或可重用模板
   - 从示例创建：简化了少样本学习（few-shot learning）提示的构建

3. **封装复杂性**：工厂方法封装了所有实例化、验证和变量提取的复杂逻辑，开发者只需关注业务需求。

## 2. 策略模式 (Strategy Pattern)

### 设计模式
策略模式定义了一系列算法，并使它们可以互相替换，同时保持客户代码不变。PromptTemplate 使用策略模式来处理不同的模板格式。

### 代码实现
```python
def format(self, **kwargs: Any) -> str:
    """Format the prompt with the inputs."""
    kwargs = self._merge_partial_and_user_variables(**kwargs)
    return DEFAULT_FORMATTER_MAPPING[self.template_format](self.template, **kwargs)
```

```python
# 在 langchain_core.prompts.string 中定义的格式化函数映射
DEFAULT_FORMATTER_MAPPING = {
    "f-string": format_string,
    "jinja2": format_jinja2,
    "mustache": format_mustache,
}
```

### 分析
策略模式在这里带来了多种好处：

1. **统一的接口，多种实现**：用户可以使用相同的 `format()` 方法，而底层会根据 `template_format` 选择不同的格式化策略。这大幅简化了开发者使用不同模板格式的难度。
   ```python
   # 创建不同格式的模板，但使用相同的接口
   f_prompt = PromptTemplate.from_template("Hello {name}", template_format="f-string")
   j_prompt = PromptTemplate.from_template("Hello {{name}}", template_format="jinja2")
   
   # 调用方式完全相同
   f_result = f_prompt.format(name="Alice")
   j_result = j_prompt.format(name="Bob")
   ```

2. **消除复杂的条件分支**：避免了大量的 if-else 语句，使用简单的字典查找代替，提高了代码的可维护性。
   ```python
   # 不需要这样的条件分支代码
   if template_format == "f-string":
       result = format_f_string(template, **kwargs)
   elif template_format == "jinja2":
       result = format_jinja2(template, **kwargs)
   # ...
   ```

3. **易于扩展**：添加新的模板格式只需：
   - 实现新的格式化函数
   - 将其添加到格式映射字典
   - 不需要修改任何现有代码

## 3. 组合模式 (Composite Pattern) 通过运算符重载

### 设计模式
组合模式将对象组合成树形结构，使单个对象和组合对象的使用方式一致。PromptTemplate 通过重载加法运算符，实现了模板的无缝组合。

### 代码实现
```python
def __add__(self, other: Any) -> PromptTemplate:
    """Override the + operator to allow for combining prompt templates."""
    # Allow for easy combining
    if isinstance(other, PromptTemplate):
        if self.template_format != "f-string":
            msg = "Adding prompt templates only supported for f-strings."
            raise ValueError(msg)
        if other.template_format != "f-string":
            msg = "Adding prompt templates only supported for f-strings."
            raise ValueError(msg)
        input_variables = list(
            set(self.input_variables) | set(other.input_variables)
        )
        template = self.template + other.template
        # If any do not want to validate, then don't
        validate_template = self.validate_template and other.validate_template
        partial_variables = dict(self.partial_variables.items())
        for k, v in other.partial_variables.items():
            if k in partial_variables:
                msg = "Cannot have same variable partialed twice."
                raise ValueError(msg)
            else:
                partial_variables[k] = v
        return PromptTemplate(
            template=template,
            input_variables=input_variables,
            partial_variables=partial_variables,
            template_format="f-string",
            validate_template=validate_template,
        )
    elif isinstance(other, str):
        prompt = PromptTemplate.from_template(other)
        return self + prompt
    else:
        msg = f"Unsupported operand type for +: {type(other)}"
        raise NotImplementedError(msg)
```

### 分析
组合模式（通过运算符重载）提供了以下优势：

1. **直观的语法**：使用 `+` 运算符组合模板非常直观，接近自然语言表达，大大提高了代码可读性。
   ```python
   # 非常接近自然语言的表达方式
   header = PromptTemplate.from_template("系统: {system}\n\n")
   user_input = PromptTemplate.from_template("用户: {query}\n")
   assistant = PromptTemplate.from_template("助手: ")
   
   full_prompt = header + user_input + assistant
   ```

2. **减少拼接错误**：自动处理模板拼接中容易出错的细节，如变量冲突、格式一致性等。
   ```python
   # 避免这样容易出错的代码
   template = f"{header_template}\n{user_template}\n{assistant_template}"
   ```

3. **智能变量管理**：加法运算符不只是简单地连接字符串，还处理了输入变量的合并，确保最终模板正确识别所有变量。
   ```python
   # 自动合并所有需要的输入变量
   input_variables = list(set(self.input_variables) | set(other.input_variables))
   ```

## 4. 模板方法模式 (Template Method Pattern)

### 设计模式
模板方法模式定义了算法的框架，将一些步骤延迟到子类中实现。PromptTemplate 继承自 StringPromptTemplate，后者定义了基本框架。

### 代码实现
```python
# 在 StringPromptTemplate 基类中
def _merge_partial_and_user_variables(self, **kwargs: Any) -> dict[str, Any]:
    # 基类实现的部分变量合并方法
    # ...

# 在 PromptTemplate 中
def format(self, **kwargs: Any) -> str:
    """Format the prompt with the inputs."""
    kwargs = self._merge_partial_and_user_variables(**kwargs)  # 调用基类方法
    return DEFAULT_FORMATTER_MAPPING[self.template_format](self.template, **kwargs)
```

### 分析
模板方法模式带来的好处：

1. **标准化流程**：基类定义了处理提示模板的标准步骤和流程，确保所有子类遵循一致的行为模式。这种一致性降低了使用不同类型模板的学习成本。
   - 基类处理：变量验证、部分变量合并、格式检查等通用步骤
   - 子类专注于：特定格式的处理逻辑

2. **代码重用**：通用功能集中在基类中实现，减少了子类中的重复代码，提高了代码的可维护性。子类只需要关注特定的实现细节，而不必重复实现通用逻辑。

3. **框架约束**：模板方法模式强制开发者遵循特定的步骤和接口，降低了实现错误的可能性，特别是在扩展系统创建新的模板类型时。

## 5. 集成验证机制

### 设计模式
虽然这不是传统的设计模式，但 PromptTemplate 集成的验证机制体现了"防御性编程"和"契约式设计"的原则。

### 代码实现
```python
@model_validator(mode="before")
@classmethod
def pre_init_validation(cls, values: dict) -> Any:
    """Check that template and input variables are consistent."""
    if values.get("template") is None:
        # Will let pydantic fail with a ValidationError if template
        # is not provided.
        return values

    # Set some default values based on the field defaults
    values.setdefault("template_format", "f-string")
    values.setdefault("partial_variables", {})

    if values.get("validate_template"):
        if values["template_format"] == "mustache":
            msg = "Mustache templates cannot be validated."
            raise ValueError(msg)

        if "input_variables" not in values:
            msg = "Input variables must be provided to validate the template."
            raise ValueError(msg)

        all_inputs = values["input_variables"] + list(values["partial_variables"])
        check_valid_template(
            values["template"], values["template_format"], all_inputs
        )

    if values["template_format"]:
        values["input_variables"] = [
            var
            for var in get_template_variables(
                values["template"], values["template_format"]
            )
            if var not in values["partial_variables"]
        ]

    return values
```

### 分析
集成验证机制的价值：

1. **提前发现错误**：在模板创建时就验证其有效性，而不是等到使用时才发现问题。这大大提高了开发效率，特别是在处理复杂模板时。
   ```python
   # 如果启用验证，会在创建时就发现问题，而不是运行时
   prompt = PromptTemplate(
       template="Hello {name} from {city}",
       input_variables=["name"],  # 缺少 "city"
       validate_template=True  # 会立即引发错误
   )
   ```

2. **智能变量检测**：自动从模板中提取变量并与指定的输入变量进行比较，确保两者匹配，减少了人为错误。
   ```python
   # 自动检测模板与输入变量是否匹配
   check_valid_template(values["template"], values["template_format"], all_inputs)
   ```

3. **清晰的错误信息**：验证失败时提供明确、有针对性的错误消息，而不是让开发者面对难以理解的运行时错误，大大提高了调试效率。

## 6. 设计模式协同效应

上述设计模式并不是孤立存在的，它们协同工作，相互增强，形成了一个功能强大且易用的系统。

### 协同作用分析

1. **工厂 + 策略模式**：这种组合让开发者能够在一行代码中同时指定创建方式和行为策略。
   ```python
   # 工厂方法创建对象，同时指定策略（模板格式）
   prompt = PromptTemplate.from_template("Hello {{name}}", template_format="jinja2")
   ```
   工厂方法负责对象创建，策略模式决定其行为，这种组合既简化了创建过程，又提供了运行时的灵活性。

2. **模板方法 + 组合模式**：基类定义的标准化流程与组合功能协同工作，使得复杂模板的构建既标准化又灵活。
   ```python
   # 组合的模板仍然遵循相同的处理流程
   combined = template1 + template2
   result = combined.format(name="World")  # 调用相同的格式化流程
   ```
   这种组合确保了即使在复杂的模板组合场景下，处理流程仍然保持一致和可预测。

3. **验证 + 工厂模式**：工厂方法创建对象时自动进行验证，确保创建的对象始终有效。
   ```python
   # 工厂方法内部自动调用验证逻辑
   prompt = PromptTemplate.from_template("{variable} 是未定义的变量")
   # 自动提取了变量 "variable"
   ```
   这种组合减少了无效对象导致的运行时错误，提高了系统的稳定性和可靠性。

通过这些设计模式的协同作用，`PromptTemplate` 类成功地将一个本应复杂的系统简化为直观易用的API，大幅减轻了开发者的认知负担和工作量。开发者可以专注于构建有效的提示模板，而不必担心底层的技术细节和潜在的错误。
