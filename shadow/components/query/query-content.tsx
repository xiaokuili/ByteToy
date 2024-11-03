"use client";

import { useState } from "react";
import { QuerySearchHeaderComponent } from "./query-search-header";
import { QuerySearchSqlEditor } from "./query-search-sql";
export function QueryContentComponent() {
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
    <div className='flex flex-col h-full w-full'>
      <div
        className='
        border border-gray-200 
        dark:border-gray-700 
        rounded-lg 
        overflow-hidden
        bg-gray-50
        dark:bg-gray-900
      '
      >
        <QuerySearchHeaderComponent
          onTonggleQuerySearchContent={onTonggleQuerySearchContent}
          onSelectDatabase={handleSelectDatabase}
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
            className='
              bg-gray-50/50
              dark:bg-gray-900/50
              shadow-inner
            '
          />
        )}
      </div>
      <div className='flex-1'>query table</div>
      <div className='h-16'>query footer</div>
    </div>
  );
}
