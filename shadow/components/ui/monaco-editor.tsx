"use client";

import { Editor, type OnMount } from "@monaco-editor/react"; // 添加 OnMount 导入
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

// 示例数据
export const EXAMPLE_DATABASE: DatabaseTable[] = [
  {
    name: "users",
    description: "User information table",
    columns: [
      {
        name: "id",
        type: "int",
        description: "User ID",
        isPrimary: true,
      },
      {
        name: "username",
        type: "varchar",
        description: "User's username",
      },
      {
        name: "email",
        type: "varchar",
        description: "User's email address",
      },
      {
        name: "created_at",
        type: "timestamp",
        description: "Account creation time",
      },
    ],
  },
  {
    name: "orders",
    description: "Order information table",
    columns: [
      {
        name: "id",
        type: "int",
        description: "Order ID",
        isPrimary: true,
      },
      {
        name: "user_id",
        type: "int",
        description: "User who placed the order",
        isForeign: true,
        foreignKey: {
          table: "users",
          column: "id",
        },
      },
      {
        name: "total_amount",
        type: "decimal",
        description: "Total order amount",
      },
      {
        name: "status",
        type: "varchar",
        description: "Order status",
      },
    ],
  },
];

// 1. 提取常量
const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
  "AND",
  "OR",
  "NOT",
  "IN",
  "LIKE",
  "BETWEEN",
  "COUNT",
  "SUM",
  "AVG",
  "MAX",
  "MIN",
] as const;

const SQL_FUNCTIONS = ["COUNT", "SUM", "AVG", "MAX", "MIN"] as const;

const SQL_OPERATORS = [
  "=",
  ">",
  "<",
  ">=",
  "<=",
  "<>",
  "!=",
  "+",
  "-",
  "*",
  "/",
] as const;

// 2. 类型定义优化
interface MonacoEditorProps extends Partial<EditorProps> {
  value?: string;
  onChange?: (value: string | undefined) => void;
  suggestions?: Monaco.languages.CompletionItem[];
}

// 3. 提取 SQL 语言配置
const SQL_LANGUAGE_CONFIG = {
  defaultToken: "",
  tokenPostfix: ".sql",
  ignoreCase: true,
  keywords: SQL_KEYWORDS,
  operators: SQL_OPERATORS,
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\d+/, "number"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/'/, { token: "string.quote", next: "@string" }],
      [/\s+/, "white"],
    ],
    string: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, { token: "string.quote", next: "@pop" }],
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/--.*$/, "comment"],
      [/\/\*/, { token: "comment.quote", next: "@comment" }],
    ],
    comment: [
      [/[^/*]+/, "comment"],
      [/\*\//, { token: "comment.quote", next: "@pop" }],
      [/[/*]/, "comment"],
    ],
  },
};

// 4. 提取编辑器默认配置
const EDITOR_DEFAULT_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: "on",
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: "on",
  padding: { top: 8 },
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  renderLineHighlight: "line",
  scrollbar: {
    vertical: "visible",
    horizontal: "visible",
    verticalScrollbarSize: 12,
    horizontalScrollbarSize: 12,
  },
} as const;

// 5. 优化 getSortText 函数
function getSortText(label: string, context: string): string {
  const contextMap = {
    select: label.includes("_") ? "2" : "1",
    from: label.includes("_") ? "1" : "2",
    where: label.includes("_") ? "2" : "1",
  };

  const matchedContext = Object.keys(contextMap).find((key) =>
    context.includes(key)
  );

  return matchedContext
    ? contextMap[matchedContext as keyof typeof contextMap] + label
    : "9" + label;
}

export function MonacoEditor({
  value,
  onChange,
  suggestions = [],
  ...props
}: MonacoEditorProps) {
  const { theme: applicationTheme } = useTheme();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // 注册 SQL 语言
    monaco.languages.register({ id: "sql" });
    monaco.languages.setMonarchTokensProvider("sql", SQL_LANGUAGE_CONFIG);

    // 修改提供程序代码
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const lineContent = model.getLineContent(position.lineNumber);
        const wordUntilPosition = lineContent
          .substring(0, position.column - 1)
          .toLowerCase();

        // 处理表名后面的点号情况
        const dotMatch = wordUntilPosition.match(/(\w+)\.$/);
        if (dotMatch) {
          const tableName = dotMatch[1];
          const table = EXAMPLE_DATABASE.find((t) => t.name === tableName);
          if (table) {
            return {
              suggestions: table.columns.map((column) => ({
                label: column.name,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: column.name,
                range,
                detail: `${column.type}${column.isPrimary ? " (Primary Key)" : ""}`,
                documentation: { value: column.description || "" },
              })),
            };
          }
        }

        // 基础建议（关键字和函数）
        const baseSuggestions = [
          // 关键字建议
          ...SQL_KEYWORDS.map((keyword) => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            range,
            detail: "SQL Keyword",
            documentation: { value: `**${keyword}** - Standard SQL keyword` },
          })),

          // 函数建议
          ...SQL_FUNCTIONS.map((func) => ({
            label: func,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `${func}()`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            detail: "SQL Function",
            documentation: { value: `**${func}** - Aggregate function` },
          })),

          // 表建议
          ...EXAMPLE_DATABASE.map((table) => ({
            label: table.name,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: table.name,
            range,
            detail: `Table - ${table.description || ""}`,
            documentation: {
              value: [
                `**Table: ${table.name}**`,
                table.description || "",
                "",
                "Columns:",
                ...table.columns.map(
                  (col) =>
                    `- ${col.name} (${col.type})${col.isPrimary ? " PRIMARY KEY" : ""}`
                ),
              ].join("\n"),
            },
          })),

          // 列建议
          ...EXAMPLE_DATABASE.flatMap((table) =>
            table.columns.map((column) => ({
              label: column.name,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: column.name,
              range,
              detail: `Column from ${table.name} - ${column.type}`,
              documentation: {
                value: [
                  `**${column.name}**`,
                  column.description || "",
                  `Type: ${column.type}`,
                  column.isPrimary ? "Primary Key" : "",
                  column.isForeign
                    ? `Foreign Key -> ${column.foreignKey?.table}.${column.foreignKey?.column}`
                    : "",
                ]
                  .filter(Boolean)
                  .join("\n"),
              },
            }))
          ),

          // 用户提供的额外建议
          ...suggestions.map((s) => ({
            ...s,
            range,
            kind:
              s.kind ||
              (s.label.includes("_")
                ? monaco.languages.CompletionItemKind.Class
                : monaco.languages.CompletionItemKind.Field),
            documentation: {
              value:
                s.documentation ||
                `**${s.label}** - ${s.detail || "Database object"}`,
            },
          })),
        ];

        // 根据上下文过滤和排序建议
        return {
          suggestions: baseSuggestions
            .filter((s) => {
              // FROM 后优先显示表
              if (wordUntilPosition.includes("from")) {
                return s.kind === monaco.languages.CompletionItemKind.Class;
              }
              // SELECT 后优先显示列和函数
              if (wordUntilPosition.includes("select")) {
                return (
                  s.kind === monaco.languages.CompletionItemKind.Field ||
                  s.kind === monaco.languages.CompletionItemKind.Function
                );
              }
              return true;
            })
            .map((s) => ({
              ...s,
              sortText: getSortText(s.label, wordUntilPosition),
            })),
        };
      },
      triggerCharacters: [" ", ".", "(", ","],
    });
  };

  return (
    <Editor
      height='30vh'
      defaultLanguage='sql'
      defaultValue='SELECT * FROM'
      theme={applicationTheme === "dark" ? "vs-dark" : "light"} // 根据应用主题调整
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
