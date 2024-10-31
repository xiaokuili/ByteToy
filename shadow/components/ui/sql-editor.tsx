"use client";

import { Editor, useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { editor } from "monaco-editor";

interface SQLEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  height?: string;
  columns?: string[];
  readOnly?: boolean;
  placeholder?: string;
}

const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "DROP",
  "CREATE",
  "TABLE",
  "INDEX",
  "VIEW",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "ON",
  "AS",
  "DISTINCT",
  "COUNT",
  "MAX",
  "MIN",
  "AVG",
  "SUM",
];

function shouldTriggerAutocomplete(text: string): boolean {
  const trimmedText = text.trim();
  const textSplit = trimmedText.split(/\s+/);
  const lastSignificantWord = trimmedText.split(/\s+/).pop()?.toUpperCase();
  const triggerKeywords = ["SELECT", "WHERE", "AND", "OR", "FROM"];

  if (textSplit.length == 2 && textSplit[0].toUpperCase() == "WHERE") {
    return true;
  }

  return (
    triggerKeywords.includes(lastSignificantWord || "") ||
    triggerKeywords.some((keyword) => trimmedText.endsWith(keyword + " "))
  );
}

export function SQLEditor({
  value = "",
  onChange,
  height = "60px",
  columns = [],
  readOnly = false,
  placeholder = "Enter your SQL query here...",
}: SQLEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monaco = useMonaco();

  // 设置自动完成
  useEffect(() => {
    if (monaco) {
      const provider = monaco.languages.registerCompletionItemProvider("sql", {
        triggerCharacters: [" ", "."],
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          if (!shouldTriggerAutocomplete(textUntilPosition)) {
            return { suggestions: [] };
          }

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: word.endColumn,
          };

          const suggestions = [
            // 列建议
            ...columns.map((name) => ({
              label: name,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: name,
              range: range,
              detail: "Column",
            })),
            // SQL 关键字建议
            ...SQL_KEYWORDS.map((keyword) => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              range: range,
              detail: "Keyword",
            })),
          ];

          return { suggestions };
        },
      });

      return () => provider.dispose();
    }
  }, [monaco, columns]);

  // 编辑器选项
  const editorOptions = {
    minimap: { enabled: false },
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: readOnly,
    renderLineHighlight: "none" as const,
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    lineNumbers: !value || value == "" ? ("off" as const) : ("on" as const),
    automaticLayout: true,
    fontSize: 14,
    tabSize: 2,
    wordWrap: "on" as const,
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
  };

  // 处理编辑器挂载
  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;

    if (!value && !readOnly) {
      // 使用正确的事件监听方法
      const focusDisposable = editor.onDidFocusEditorText(() => {
        if (editor.getValue() === placeholder) {
          editor.setValue("");
        }
      });

      const blurDisposable = editor.onDidBlurEditorText(() => {
        if (editor.getValue() === "") {
          editor.setValue(placeholder);
        }
      });

      // 返回清理函数
      return () => {
        focusDisposable.dispose();
        blurDisposable.dispose();
      };
    }
  }

  // 处理值的变化
  useEffect(() => {
    if (
      editorRef.current &&
      value !== undefined &&
      value !== editorRef.current.getValue()
    ) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div className='flex flex-col items-center justify-between border dark:border-gray-700 p-3 shadow-sm'>
      <Editor
        height={height}
        width='100%'
        language='sql'
        value={value || placeholder}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        onChange={onChange}
        options={editorOptions}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default SQLEditor;
