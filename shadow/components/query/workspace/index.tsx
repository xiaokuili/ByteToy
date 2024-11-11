"use client";

import { useState } from "react";
import { SQLWorkbenchHeader } from "./header/index";
import { QuerySearchSqlEditor } from "./editor";
import { QueryViewComponent } from "./result/result";
import { Variable } from "@/types/base";
import { QueryFooterHeader } from "./footer";

export function SQLWorkbench() {
  // 数据库
  const [databaseId, setDatabaseId] = useState<string>("");

  // sql editor
  const [variables, setVariables] = useState<Variable[]>([]);
  const [sqlContent, setSqlContent] = useState<string>("");

  // result
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string>("");

  const [isEditorVisible, setIsEditorVisible] = useState(true);

  const handleSelectDatabase = (databaseId: string) => {
    setDatabaseId(databaseId);
  };

  return (
    <div className='flex flex-col h-full w-full '>
      <div className='flex-none border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900'>
        <SQLWorkbenchHeader
          onToggleEditor={() => setIsEditorVisible(!isEditorVisible)}
          onSelectDatabase={handleSelectDatabase}
          onSetVariables={setVariables}
          variables={variables}
        />
        {isEditorVisible && (
          <QuerySearchSqlEditor
            databaseId={databaseId}
            variables={variables}
            sqlContent={sqlContent}
            setQueryResult={setQueryResult}
            setQueryError={setQueryError}
            setVariables={setVariables}
            setSqlContent={setSqlContent}
          />
        )}
      </div>

      {/* result */}
      {(queryResult || queryError) && (
        <div className='flex-1 min-h-0'>
          <QueryViewComponent data={queryResult} error={queryError} />
        </div>
      )}
      {/* footer */}
      {queryResult && (
        <div className='h-16'>
          <QueryFooterHeader
            rowCount={queryResult?.rowCount}
            executionTime={queryResult?.executionTime}
          />
        </div>
      )}
    </div>
  );
}
