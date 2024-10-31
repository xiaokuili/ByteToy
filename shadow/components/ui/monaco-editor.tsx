"use client";

import { Editor, type OnMount } from "@monaco-editor/react"; // 添加 OnMount 导入
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import { initializeMode } from "monaco-sql-languages";

// 定义提示类型
type SuggestionType = "keyword" | "table" | "column" | "function";

// 定义数据库表和字段的接口
interface TableColumn {
  name: string;
  type: string;
  description?: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

interface TableDefinition {
  name: string;
  description?: string;
  columns: TableColumn[];
}

// 示例数据库结构
const EXAMPLE_DATABASE: TableDefinition[] = [
  {
    name: "users",
    description: "User information table",
    columns: [
      {
        name: "id",
        type: "INT",
        description: "User unique identifier",
        isPrimary: true,
      },
      {
        name: "username",
        type: "VARCHAR(50)",
        description: "User's login name",
      },
      {
        name: "email",
        type: "VARCHAR(100)",
        description: "User's email address",
      },
      {
        name: "created_at",
        type: "TIMESTAMP",
        description: "Account creation time",
      },
      {
        name: "status",
        type: "ENUM('active','inactive')",
        description: "User account status",
      },
    ],
  },
  {
    name: "orders",
    description: "Order master table",
    columns: [
      {
        name: "id",
        type: "INT",
        description: "Order unique identifier",
        isPrimary: true,
      },
      {
        name: "user_id",
        type: "INT",
        description: "Reference to users table",
        isForeign: true,
        foreignKey: {
          table: "users",
          column: "id",
        },
      },
      {
        name: "total_amount",
        type: "DECIMAL(10,2)",
        description: "Total order amount",
      },
      {
        name: "status",
        type: "ENUM('pending','completed','cancelled')",
        description: "Order status",
      },
      {
        name: "created_at",
        type: "TIMESTAMP",
        description: "Order creation time",
      },
    ],
  },
  {
    name: "order_items",
    description: "Order details table",
    columns: [
      {
        name: "id",
        type: "INT",
        description: "Order item unique identifier",
        isPrimary: true,
      },
      {
        name: "order_id",
        type: "INT",
        description: "Reference to orders table",
        isForeign: true,
        foreignKey: {
          table: "orders",
          column: "id",
        },
      },
      {
        name: "product_id",
        type: "INT",
        description: "Reference to products table",
        isForeign: true,
        foreignKey: {
          table: "products",
          column: "id",
        },
      },
      {
        name: "quantity",
        type: "INT",
        description: "Product quantity",
      },
      {
        name: "unit_price",
        type: "DECIMAL(10,2)",
        description: "Product unit price",
      },
    ],
  },
  {
    name: "products",
    description: "Product information table",
    columns: [
      {
        name: "id",
        type: "INT",
        description: "Product unique identifier",
        isPrimary: true,
      },
      {
        name: "name",
        type: "VARCHAR(100)",
        description: "Product name",
      },
      {
        name: "description",
        type: "TEXT",
        description: "Product description",
      },
      {
        name: "price",
        type: "DECIMAL(10,2)",
        description: "Product price",
      },
      {
        name: "stock",
        type: "INT",
        description: "Current stock quantity",
      },
      {
        name: "category_id",
        type: "INT",
        description: "Reference to categories table",
        isForeign: true,
        foreignKey: {
          table: "categories",
          column: "id",
        },
      },
    ],
  },
  {
    name: "categories",
    description: "Product categories table",
    columns: [
      {
        name: "id",
        type: "INT",
        description: "Category unique identifier",
        isPrimary: true,
      },
      {
        name: "name",
        type: "VARCHAR(50)",
        description: "Category name",
      },
      {
        name: "parent_id",
        type: "INT",
        description: "Parent category reference",
        isForeign: true,
        foreignKey: {
          table: "categories",
          column: "id",
        },
      },
    ],
  },
];
const EDITOR_DEFAULT_OPTIONS: Monaco.editor.IStandaloneEditorConstructionOptions =
  {
    minimap: { enabled: false }, // 禁用右侧小地图
    scrollBeyondLastLine: false, // 禁止滚动到最后一行之后
    automaticLayout: true, // 自动调整布局
    scrollbar: {
      vertical: "auto", // 垂直滚动条
      horizontal: "auto", // 水平滚动条
    },
    fontSize: 14, // 字体大小
    lineNumbers: "on", // 显示行号
    folding: true, // 代码折叠
    wordWrap: "on", // 自动换行
    suggestOnTriggerCharacters: true, // 在触发字符时显示建议
    acceptSuggestionOnEnter: "on", // 按 Enter 接受建议
    tabSize: 2, // Tab 大小
    formatOnPaste: true, // 粘贴时格式化
    formatOnType: true, // 输入时格式化
    snippetSuggestions: "inline", // 代码片段建议
    wordBasedSuggestions: true, // 基于单词的建议
    quickSuggestions: {
      // 快速建议
      other: true,
      comments: false,
      strings: false,
    },
    renderLineHighlight: "all", // 当前行高亮
    roundedSelection: true, // 圆角选择
    cursorBlinking: "smooth", // 光标闪烁动画
    cursorStyle: "line", // 光标样式
    cursorWidth: 2, // 光标宽度
    links: true, // 启用链接
    mouseWheelZoom: true, // 鼠标滚轮缩放
  };
// SQL 关键字
const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "AND",
  "OR",
  "IN",
  "NOT",
  "LIKE",
  "IS NULL",
  "IS NOT NULL",
];

// SQL 函数
const SQL_FUNCTIONS = [
  "COUNT",
  "SUM",
  "AVG",
  "MAX",
  "MIN",
  "DISTINCT",
  "CONCAT",
  "SUBSTRING",
  "UPPER",
  "LOWER",
  "DATE",
];

export function MonacoEditor({ value, onChange, ...props }: MonacoEditorProps) {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // 创建提示项
    const createSuggestion = (
      label: string,
      type: SuggestionType,
      detail?: string,
      documentation?: string,
      insertText?: string,
      range?: Monaco.IRange
    ): Monaco.languages.CompletionItem => ({
      label,
      kind: {
        keyword: monaco.languages.CompletionItemKind.Keyword,
        table: monaco.languages.CompletionItemKind.Class,
        column: monaco.languages.CompletionItemKind.Field,
        function: monaco.languages.CompletionItemKind.Function,
      }[type],
      detail,
      documentation: documentation ? { value: documentation } : undefined,
      insertText: insertText || label,
      range,
    });

    // 获取所有已使用的表
    const getAllTables = (sql: string) => {
      const fromMatches = sql.match(/from\s+(\w+)/gi) || [];
      const joinMatches = sql.match(/join\s+(\w+)/gi) || [];

      return [...fromMatches, ...joinMatches]
        .map((match) => {
          // 提取表名
          const tableName = match.replace(/from\s+|join\s+/gi, "").trim();
          return tableName;
        })
        .filter(Boolean); // 过滤掉空值
    };

    // 分析 SQL 上下文
    const analyzeSQLContext = (lineContent: string, position: number) => {
      const beforeCursor = lineContent.substring(0, position).toLowerCase();
      return {
        isAfterFrom: /from\s+$/i.test(beforeCursor),
        isAfterJoin: /\b(left\s+join|right\s+join|inner\s+join|join)\s+$/i.test(
          beforeCursor
        ),
        isAfterOn: /\bon\s+$/i.test(beforeCursor),
        isInOnClause: /\bon\s+.*$/i.test(beforeCursor),
        isAfterWhere: /where\s+$/i.test(beforeCursor),
        isAfterSelect: /select\s+$/i.test(beforeCursor),
        isAfterDot: /\w+\.\s*$/.test(beforeCursor),
        tableName: beforeCursor.match(/(\w+)\.\s*$/)?.[1],
        isInWhereClause: /where.+$/i.test(beforeCursor),
        isAfterOperator: /^(and|or|where)$/i.test(lastToken),
        isAfterEquals: /[=<>]$/.test(beforeCursor),
        isInComparison: /\w+\.[^\s=<>]+$/.test(beforeCursor),

        // 获取当前已经使用的表
        currentTables: getAllTables(sql),
      };
    };
    // 获取表的外键关系建议
    const getJoinSuggestions = (
      currentTables: string[],
      range: Monaco.IRange
    ) => {
      const suggestions: Monaco.languages.CompletionItem[] = [];

      currentTables.forEach((tableName) => {
        const table = EXAMPLE_DATABASE.find((t) => t.name === tableName);
        if (!table) return;

        // 查找所有与当前表有外键关系的表
        EXAMPLE_DATABASE.forEach((relatedTable) => {
          // 检查外键关系
          const hasRelation =
            relatedTable.columns.some(
              (col) => col.foreignKey?.table === table.name
            ) ||
            table.columns.some(
              (col) => col.foreignKey?.table === relatedTable.name
            );

          if (hasRelation) {
            suggestions.push({
              label: `LEFT JOIN ${relatedTable.name} ON`,
              kind: monaco.languages.CompletionItemKind.Snippet,
              detail: `Join with ${relatedTable.name} table`,
              documentation: {
                value: [
                  `**Join with ${relatedTable.name}**`,
                  relatedTable.description || "",
                  "",
                  "Possible join conditions:",
                  ...getJoinConditions(table, relatedTable),
                ].join("\n"),
              },
              insertText: `LEFT JOIN ${relatedTable.name} ON `,
              sortText: "0",
              range,
            });
          }
        });
      });

      return suggestions;
    };

    // 获取可能的连接条件
    const getJoinConditions = (
      table1: TableDefinition,
      table2: TableDefinition
    ) => {
      const conditions: string[] = [];

      // 检查表1的外键指向表2
      table1.columns.forEach((col) => {
        if (col.foreignKey?.table === table2.name) {
          conditions.push(
            `- ${table1.name}.${col.name} = ${table2.name}.${col.foreignKey.column}`
          );
        }
      });

      // 检查表2的外键指向表1
      table2.columns.forEach((col) => {
        if (col.foreignKey?.table === table1.name) {
          conditions.push(
            `- ${table2.name}.${col.name} = ${table1.name}.${col.foreignKey.column}`
          );
        }
      });

      return conditions;
    };
    // 获取 ON 条件的提示
    const getOnConditionSuggestions = (
      currentTables: string[],
      range: Monaco.IRange
    ) => {
      const suggestions: Monaco.languages.CompletionItem[] = [];

      // 获取最后两个表
      const lastTwoTables = currentTables.slice(-2);
      console.log(lastTwoTables);
      if (lastTwoTables.length !== 2) return suggestions;

      const [table1Name, table2Name] = lastTwoTables;
      const table1 = EXAMPLE_DATABASE.find((t) => t.name === table1Name);
      const table2 = EXAMPLE_DATABASE.find((t) => t.name === table2Name);

      if (!table1 || !table2) return suggestions;

      // 添加可能的连接条件
      table1.columns.forEach((col1) => {
        if (col1.foreignKey?.table === table2.name) {
          suggestions.push({
            label: `${table1.name}.${col1.name} = ${table2.name}.${col1.foreignKey.column}`,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: "Join condition",
            documentation: {
              value: `Foreign key relationship between ${table1.name} and ${table2.name}`,
            },
            insertText: `${table1.name}.${col1.name} = ${table2.name}.${col1.foreignKey.column}`,
            range,
          });
        }
      });

      table2.columns.forEach((col2) => {
        if (col2.foreignKey?.table === table1.name) {
          suggestions.push({
            label: `${table2.name}.${col2.name} = ${table1.name}.${col2.foreignKey.column}`,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: "Join condition",
            documentation: {
              value: `Foreign key relationship between ${table2.name} and ${table1.name}`,
            },
            insertText: `${table2.name}.${col2.name} = ${table1.name}.${col2.foreignKey.column}`,
            range,
          });
        }
      });

      return suggestions;
    };

    // 注册提示提供者
    monaco.languages.registerCompletionItemProvider("sql", {
      triggerCharacters: [" ", ".", "("],
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const lineContent = model.getLineContent(position.lineNumber);
        const context = analyzeSQLContext(lineContent, position.column - 1);
        const suggestions: Monaco.languages.CompletionItem[] = [];

        // 1. 表字段提示
        if (context.isAfterDot && context.tableName) {
          const table = EXAMPLE_DATABASE.find(
            (t) => t.name.toLowerCase() === context.tableName?.toLowerCase()
          );

          if (table) {
            table.columns.forEach((column) => {
              suggestions.push(
                createSuggestion(
                  column.name,
                  "column",
                  `${column.type}${column.isPrimary ? " (PK)" : ""}${column.isForeign ? " (FK)" : ""}`,
                  column.description,
                  column.name,
                  range
                )
              );
            });
          }
          return { suggestions };
        }

        // 2. 表提示
        if (context.isAfterFrom || context.isAfterJoin) {
          EXAMPLE_DATABASE.forEach((table) => {
            suggestions.push(
              createSuggestion(
                table.name,
                "table",
                table.description,
                [
                  `**Table: ${table.name}**`,
                  table.description || "",
                  "",
                  "Columns:",
                  ...table.columns.map(
                    (col) =>
                      `- ${col.name} (${col.type})${col.isPrimary ? " PRIMARY KEY" : ""}`
                  ),
                ].join("\n"),
                table.name,
                range
              )
            );
          });
          return { suggestions };
        }

        // 3. SELECT 后的提示
        if (context.isAfterSelect) {
          suggestions.push(
            createSuggestion(
              "*",
              "keyword",
              "Select all columns",
              undefined,
              "*",
              range
            )
          );

          // 添加所有可用的列
          EXAMPLE_DATABASE.forEach((table) => {
            table.columns.forEach((column) => {
              suggestions.push(
                createSuggestion(
                  `${table.name}.${column.name}`,
                  "column",
                  `${column.type} (${table.name})`,
                  column.description,
                  `${table.name}.${column.name}`,
                  range
                )
              );
            });
          });
          return { suggestions };
        }

        // 在 provideCompletionItems 中的 WHERE 条件提示部分
        if (context.isAfterWhere || context.isInWhereClause) {
          const whereContext = analyzeWhereContext(beforeCursor);

          // 只在适当的时候提供列提示
          if (whereContext.isAfterOperator) {
            // WHERE, AND, OR 后提供列名
            EXAMPLE_DATABASE.forEach((table) => {
              table.columns.forEach((column) => {
                suggestions.push(
                  createSuggestion(
                    `${table.name}.${column.name}`,
                    "column",
                    `${column.type} (${table.name})`,
                    column.description,
                    `${table.name}.${column.name}`,
                    range
                  )
                );
              });
            });
          } else if (whereContext.isAfterEquals) {
            // 比较运算符后提供值的建议
            // 可以根据列的类型提供适当的值建议
            suggestions.push(
              createSuggestion(
                "NULL",
                "keyword",
                "NULL value",
                undefined,
                "NULL",
                range
              ),
              createSuggestion(
                "NOT NULL",
                "keyword",
                "NOT NULL value",
                undefined,
                "NOT NULL",
                range
              )
            );
          } else if (!whereContext.isInComparison) {
            // 在比较表达式之间提供 AND/OR
            suggestions.push(
              createSuggestion(
                "AND",
                "keyword",
                "Logical AND",
                undefined,
                "AND ",
                range
              ),
              createSuggestion(
                "OR",
                "keyword",
                "Logical OR",
                undefined,
                "OR ",
                range
              )
            );
          }
        }

        // 5. 函数提示
        SQL_FUNCTIONS.forEach((func) => {
          suggestions.push(
            createSuggestion(
              func,
              "function",
              "SQL Function",
              undefined,
              `${func}()`,
              range
            )
          );
        });

        // 6. 关键字提示
        SQL_KEYWORDS.forEach((keyword) => {
          suggestions.push(
            createSuggestion(
              keyword,
              "keyword",
              "SQL Keyword",
              undefined,
              keyword,
              range
            )
          );
        });
        // JOIN 提示
        if (context.isAfterJoin) {
          return {
            suggestions: getJoinSuggestions(context.currentTables, range),
          };
        }

        // ON 条件提示
        if (context.isAfterOn || context.isInOnClause) {
          const currentTables = context.currentTables;
          console.log("Current tables:", currentTables); // 调试用

          // 获取最后两个表
          const lastTwoTables = currentTables.slice(-2);
          if (lastTwoTables.length === 2) {
            const [table1Name, table2Name] = lastTwoTables;
            const table1 = EXAMPLE_DATABASE.find((t) => t.name === table1Name);
            const table2 = EXAMPLE_DATABASE.find((t) => t.name === table2Name);

            if (table1 && table2) {
              // 检查外键关系并提供建议
              table1.columns.forEach((col1) => {
                if (col1.foreignKey?.table === table2.name) {
                  suggestions.push(
                    createSuggestion(
                      `${table1.name}.${col1.name} = ${table2.name}.${col1.foreignKey.column}`,
                      "column",
                      "Join condition",
                      `Foreign key relationship between ${table1.name} and ${table2.name}`,
                      `${table1.name}.${col1.name} = ${table2.name}.${col1.foreignKey.column}`,
                      range
                    )
                  );
                }
              });

              table2.columns.forEach((col2) => {
                if (col2.foreignKey?.table === table1.name) {
                  suggestions.push(
                    createSuggestion(
                      `${table2.name}.${col2.name} = ${table1.name}.${col2.foreignKey.column}`,
                      "column",
                      "Join condition",
                      `Foreign key relationship between ${table2.name} and ${table1.name}`,
                      `${table2.name}.${col2.name} = ${table1.name}.${col2.foreignKey.column}`,
                      range
                    )
                  );
                }
              });
            }
          }
        }

        return { suggestions };
      },
    });
  };

  return (
    <Editor
      height='30vh'
      defaultLanguage='sql'
      defaultValue='SELECT * FROM'
      theme='dark'
      onMount={handleEditorDidMount}
      loading={
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='h-6 w-6 animate-spin' />
        </div>
      }
      value={value}
      onChange={onChange}
      options={EDITOR_DEFAULT_OPTIONS}
      {...props}
    />
  );
}
