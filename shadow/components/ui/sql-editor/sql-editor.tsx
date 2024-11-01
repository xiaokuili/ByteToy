"use client";

import { Editor, useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { BasicSQLCompletionProvider } from "./sql-suggests";
interface SQLEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  height?: string;
  columns?: string[];
  readOnly?: boolean;
  placeholder?: string;
}

export function SQLEditor({
  value = "",
  onChange,
  height = "200px",
}: SQLEditorProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    const completionProvider = new BasicSQLCompletionProvider();

    const provider = monaco.languages.registerCompletionItemProvider("sql", {
      triggerCharacters: [" ", "."], // 添加更多触发字符
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const context = completionProvider.analyzeContext(
          textUntilPosition,
          position
        );
        const suggestions = completionProvider.generateSuggestions(context);
        const range = completionProvider.calculateRange(context);

        return {
          suggestions: suggestions.map((suggestion) => ({
            ...suggestion,
            range,
          })),
        };
      },
    });

    return () => provider.dispose();
  }, [monaco]);

  return (
    <Editor
      height={height}
      language='sql'
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: false,
      }}
    />
  );
}
export default SQLEditor;
