"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditorStore } from '@/hook/useEditor';

export default function Editor() {
  const {setEditor} = useEditorStore()

  const editor = useEditor({
    onBeforeCreate({ editor }) {
      // Before the view is created.
      setEditor(editor)
    },
    onCreate({ editor }) {
      // The editor is ready.
      setEditor(editor)
    },
    onUpdate({ editor }) {
      // The content has changed.
      setEditor(editor)
    },
    onSelectionUpdate({ editor }) {
      // The selection has changed.
      setEditor(editor)
    },
    onTransaction({ editor }) {
      // The editor state has changed.
      setEditor(editor)
    },
    onFocus({ editor }) {
      // The editor is focused.
      setEditor(editor)
    },
    onBlur({ editor }) {
      // The editor isn't focused anymore.
      setEditor(editor)
    },
    onDestroy() {
      // The editor is being destroyed.
      setEditor(null)
    },

    onContentError({ editor }) {
      // The editor content does not match the schema.
      setEditor(editor)
    },
    extensions: [
      StarterKit,
      FontFamily,
      Placeholder.configure({
        placeholder: '请输入内容...',
      }),
    ],
    autofocus: 'end',
    content: `
      
    `,
    editorProps: {
      attributes: {
        class: 'p-8 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none  text-gray-700 leading-relaxed border rounded-lg  min-h-[297mm]',
      },
    },
    immediatelyRender: false,

  });

  return (
    <div className="h-full p-8 max-w-5xl mx-auto ">
        <EditorContent editor={editor}  />
    </div>
  );
}
