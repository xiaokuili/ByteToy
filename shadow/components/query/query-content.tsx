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
      {/* query header */}
      <QuerySearchHeaderComponent
        onTonggleQuerySearchContent={onTonggleQuerySearchContent}
        onSelectDatabase={handleSelectDatabase}
      />
      {isQuerySearchContentVisible && (
        <QuerySearchSqlEditor databaseId={databaseId} />
      )}
      <div className='flex-1'>query table</div>
      <div className='h-16'>query footer</div>
    </div>
  );
}
