"use client";

import { useState } from "react";
import { SQLWorkbenchHeader } from "./header/index";
import { QuerySearchSqlEditor } from "./editor";
import { useQueryAndViewState } from "@/hook/use-visualization";
import { QueryViewComponent } from "@/components/query/workspace/result/result";
export function SQLWorkbench() {
  // 查询
  const { setDatabaseId, variables, setVariables, sqlContent, setSqlContent } =
    useQueryAndViewState();

  const { isExecuting } = useQueryAndViewState();
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  return (
    <div className='flex flex-col h-full w-full '>
      {/* <div className='flex-none border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900'> */}
      {/* header */}
      <SQLWorkbenchHeader
        onToggleEditor={() => setIsEditorVisible(!isEditorVisible)}
        onSelectDatabase={setDatabaseId}
        onSetVariables={setVariables}
        variables={variables}
      />
      {/* sql editor */}
      {isEditorVisible && (
        <QuerySearchSqlEditor
          variables={variables}
          sqlContent={sqlContent}
          setVariables={setVariables}
          setSqlContent={setSqlContent}
        />
      )}

      {/* result */}
      <div className='flex-1'>
        <QueryViewComponent />
      </div>
    </div>
  );
}
