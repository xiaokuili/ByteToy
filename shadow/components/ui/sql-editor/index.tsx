"use client";

import { Editor, useMonaco } from "@monaco-editor/react";
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
          wordBasedSuggestions: "allDocuments",
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
