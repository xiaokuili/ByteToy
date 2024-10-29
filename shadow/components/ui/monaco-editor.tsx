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

  return (
    <Editor
      height='30vh'
      defaultLanguage='sql'
      defaultValue='SELECT * FROM'
      theme='vs-dark'
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
