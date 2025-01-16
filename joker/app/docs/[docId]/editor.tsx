"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      <h1>杭州市2025年8月生物医药产业报告</h1>
      
      <h2>产业概况</h2>
      <p>2025年8月，杭州市生物医药产业持续保持快速增长态势，产业规模突破2000亿元，同比增长15.3%。创新药研发能力显著提升，产业集群效应进一步增强。在政府的大力支持下，生物医药产业已成为杭州市重点发展的战略性新兴产业之一。产业链条不断完善，从基础研究、临床试验到产业化转化的全链条创新体系逐步形成。此外，杭州市积极推进产学研深度融合，建立了多个省级以上重点实验室和工程技术研究中心，为产业发展提供了强有力的科技支撑。随着国际合作的深入开展，杭州市生物医药产业的国际影响力和竞争力也在不断提升，已经吸引了众多跨国制药企业在此设立研发中心和生产基地。</p>
      
      <h2>重点领域发展</h2>
      <ul>
        <li>创新药物研发：新增在研新药项目32个，其中First-in-Class项目8个</li>
        <li>医疗器械：高端医疗器械本地化率提升至65%</li>
        <li>生物技术：基因测序和细胞治疗领域取得突破性进展</li>
      </ul>

      <h2>产业集群分布</h2>
      <p>目前形成了以下三大产业集群：</p>
      <ol>
        <li>滨江医药港：重点发展创新药物研发</li>
        <li>钱塘生物医药谷：专注高端医疗器械制造</li>
        <li>余杭生命科学园：聚焦生物技术研发</li>
      </ol>

      <h2>存在问题与建议</h2>
      <blockquote>
        人才供给仍显不足，建议加大产学研合作力度，完善人才引进机制。创新资源有待进一步整合，可考虑建立跨区域协同创新平台。
      </blockquote>


      <div></div>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none h-full text-gray-700 leading-relaxed ',
      },
    },
    immediatelyRender: false,

  });

  return (
    <ScrollArea className="h-full p-8">
      <div className=" max-w-5xl mx-auto rounded-lg border bg-background/50 shadow-sm p-8 sm:p-16">
        <EditorContent editor={editor} />
      </div>
    </ScrollArea>
  );
}
