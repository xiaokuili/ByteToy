"use client";

import { useState } from "react";
import { QuerySearchHeaderComponent } from "./query-search-header";
import { QuerySearchSqlEditor } from "./query-search-sql";
import { QueryViewComponent } from "./query-view";
import { Variable } from "@/types/base";

export function QueryContentComponent() {
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string>("");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [sqlContent, setSqlContent] = useState<string>("");

  const [isQuerySearchContentVisible, setIsQuerySearchContentVisible] =
    useState(true);
  const [databaseId, setDatabaseId] = useState<string>("");

  const onTonggleQuerySearchContent = () => {
    setIsQuerySearchContentVisible(!isQuerySearchContentVisible);
  };

  const handleSelectDatabase = (databaseId: string) => {
    setDatabaseId(databaseId);
    console.log(databaseId);
  };

  return (
    <div className='flex flex-col h-full w-full '>
      <div className='flex-none border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900'>
        <QuerySearchHeaderComponent
          onTonggleQuerySearchContent={onTonggleQuerySearchContent}
          onSelectDatabase={handleSelectDatabase}
          onUpdateVariable={setVariables}
          variables={variables}
          className='
            border-b 
            border-gray-200 
            dark:border-gray-700
            dark:bg-gray-800
          '
        />
        {isQuerySearchContentVisible && (
          <QuerySearchSqlEditor
            databaseId={databaseId}
            variables={variables}
            setQueryResult={setQueryResult}
            setQueryError={setQueryError}
            setVariables={setVariables}
            setSqlContent={setSqlContent}
            sqlContent={sqlContent}
            className='
              bg-gray-50/50
              dark:bg-gray-900/50
              shadow-inner
            '
          />
        )}
      </div>
      <div className='flex-1 min-h-0 overflow-hidden mt-4'>
        <QueryViewComponent data={queryResult} error={queryError} />
      </div>
      <div className='h-16'>query footer</div>
    </div>
  );
}
