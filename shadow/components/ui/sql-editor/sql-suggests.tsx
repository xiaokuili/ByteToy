// 基础接口定义
export interface SQLContext {
  beforeText: string;
  currentWord: string;
  position: {
    lineNumber: number;
    column: number;
  };
  statementType?: "SELECT" | "FROM" | "WHERE" | "OTHER";
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
