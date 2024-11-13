"use client";

import { useState } from "react";
import { SQLWorkbenchHeader } from "./header/index";
import { QuerySearchSqlEditor } from "./editor";
import { QueryViewComponent } from "./result/result";
import { useVisualization } from "@/hook/use-visualization";
import { QueryFooterHeader } from "./footer";

export function SQLWorkbench() {
  // 数据库
  const { datasourceId: databaseId, setDatasourceId: setDatabaseId } =
    useVisualization();

  // sql editor
  const { sqlVariables: variables, setSqlVariables: setVariables } =
    useVisualization();
  const { sqlContent, setSqlContent } = useVisualization();

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
        {/* header */}
        <SQLWorkbenchHeader
          onToggleEditor={() => setIsEditorVisible(!isEditorVisible)}
          onSelectDatabase={handleSelectDatabase}
          onSetVariables={setVariables}
          variables={variables}
        />
        {/* sql editor */}
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
