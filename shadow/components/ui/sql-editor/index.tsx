"use client";

import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
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
    <div>
      <Editor
        height={height}
        language='sql'
        value={value}
        theme='vs-dark'
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
          fontSize: 16,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
          lineNumbers: "off",
          folding: false,
          lineDecorationsWidth: 0,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "none",
          scrollbar: {
            vertical: "hidden",
            horizontal: "auto", // Allow horizontal scrolling
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          glyphMargin: false,
          contextmenu: false,
          wordWrap: "on", // Disable line wrapping
          wrappingIndent: "indent", // Indent wrapped lines
          autoIndent: "full", // Enable auto indentation
          formatOnType: true, // Format while typing
          formatOnPaste: true, // Format pasted content
          insertSpaces: true, // Use spaces for indentation
          tabSize: 2, // Set tab size to 2 spaces
        }}
      />
    </div>
  );
}
export default SQLEditor;
