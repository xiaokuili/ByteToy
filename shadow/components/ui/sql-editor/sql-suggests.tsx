export type SQLStatementType =
  | "SELECT"
  | "FROM"
  | "WHERE"
  | "JOIN" // 基础 JOIN
  | "LEFT_JOIN"
  | "RIGHT_JOIN"
  | "INNER_JOIN"
  | "WITH" // CTE
  | "GROUP_BY"
  | "ORDER_BY"
  | "HAVING"
  | "UNION"
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "OTHER";

export type SQLClauseType =
  | "TABLE" // 表名上下文
  | "COLUMN" // 列名上下文
  | "ALIAS" // 别名上下文
  | "CTE" // WITH 子句名称
  | "FUNCTION" // 函数上下文
  | "OPERATOR" // 操作符上下文
  | "VALUE" // 值上下文
  | "NONE"; // 其他

export interface SQLContext {
  // 基础文本信息
  beforeText: string;
  currentWord: string;

  // 位置信息
  position: {
    lineNumber: number;
    column: number;
  };

  // SQL 语句类型
  statementType: SQLStatementType;

  // 当前子句类型
  clauseType: SQLClauseType;

  // 上下文元数据
  metadata?: {
    currentTable?: string; // 当前表名
    currentAlias?: string; // 当前别名
    availableAliases?: Map<string, string>; // 可用的别名映射
    cteTables?: string[]; // WITH 子句定义的临时表
    joinCondition?: boolean; // 是否在 JOIN ON 条件中
    subquery?: boolean; // 是否在子查询中
    parentContext?: SQLContext; // 父查询上下文
  };
}
export interface SQLSuggestion {
  label: string;
  kind: "keyword" | "table" | "column";
  insertText: string;
  detail?: string;
}

export interface SQLRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

// 抽象类定义
export abstract class SQLCompletionProvider {
  abstract analyzeContext(text: string, position: any): SQLContext;
  abstract generateSuggestions(context: SQLContext): SQLSuggestion[];
  abstract calculateRange(context: SQLContext): SQLRange;
}

export class BasicSQLCompletionProvider extends SQLCompletionProvider {
  private tables: string[];

  constructor(tables: string[] = ["users", "posts"]) {
    super();
    this.tables = tables;
  }

  analyzeContext(text: string, position: any): SQLContext {
    const beforeText = text.trim().toUpperCase();

    return {
      beforeText: text,
      currentWord: "",
      position: {
        lineNumber: position.lineNumber,
        column: position.column,
      },
      statementType: beforeText.endsWith("FROM ") ? "FROM" : "FROM",
    };
  }

  generateSuggestions(context: SQLContext): SQLSuggestion[] {
    console.log("Generating suggestions for", context.statementType);
    if (context.statementType === "FROM") {
      console.log("Generating suggestions for FROM");
      return this.tables.map((table) => ({
        label: table,
        kind: "table",
        insertText: table,
        detail: `Table: ${table}`,
      }));
    }

    return [];
  }

  calculateRange(context: SQLContext): SQLRange {
    return {
      startLineNumber: context.position.lineNumber,
      startColumn: context.position.column,
      endLineNumber: context.position.lineNumber,
      endColumn: context.position.column,
    };
  }
}
