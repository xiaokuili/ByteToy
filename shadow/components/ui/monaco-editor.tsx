"use client";

import { Editor, type EditorProps } from "@monaco-editor/react";
import { useTheme } from "next-themes"; // 如果你使用 next-themes
import { Loader2 } from "lucide-react";

interface MonacoEditorProps extends Partial<EditorProps> {
  value?: string;
  onChange?: (value: string | undefined) => void;
}

export function MonacoEditor({ value, onChange, ...props }: MonacoEditorProps) {
  // 如果使用 next-themes，可以同步主题
  const { theme: applicationTheme } = useTheme();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    const suggestions = [
      // 当输入 'S' 时会匹配这些
      { label: "SELECT", insertText: "SELECT" },
      { label: "SUM", insertText: "SUM" },

      // 当输入 'C' 时会匹配这些
      { label: "COUNT", insertText: "COUNT" },
      { label: "CREATE", insertText: "CREATE" },

      // 当输入 'F' 时会匹配这个
      { label: "FROM", insertText: "FROM" },
    ];

    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model, position) => {
        const wordUntilPosition = model.getWordUntilPosition(position);
        const word = wordUntilPosition.word;

        // 创建一个新的建议数组，根据当前位置调整 insertText
        const adjustedSuggestions = suggestions.map((s) => ({
          ...s,
          // 如果当前有输入中的单词，则替换它
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: wordUntilPosition.startColumn,
            endColumn: wordUntilPosition.endColumn,
          },
        }));

        if (word.toUpperCase().startsWith("S")) {
          return {
            suggestions: adjustedSuggestions.filter((s) =>
              s.label.toUpperCase().startsWith("S")
            ),
          };
        }

        if (word.toUpperCase().startsWith("F")) {
          return {
            suggestions: adjustedSuggestions.filter((s) =>
              s.label.toUpperCase().startsWith("F")
            ),
          };
        }

        return { suggestions: adjustedSuggestions };
      },
      triggerCharacters: [" ", ".", "S", "F", "W"], // 添加更多触发字符
    });
  };

  return (
    <Editor
      height='30vh'
      defaultLanguage='sql'
      defaultValue='SELECT * FROM'
      theme='vs-dark'
      onMount={handleEditorDidMount} // 添加这行
      loading={
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='h-6 w-6 animate-spin' />
        </div>
      }
      value={value}
      onChange={onChange}
      options={{
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
      }}
      {...props}
    />
  );
}
