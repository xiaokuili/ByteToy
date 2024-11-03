"use client";

import { useState } from "react";
import { QuerySearchHeaderComponent } from "./query-search-header";
import { QuerySearchSqlEditor } from "./query-search-sql";
import { QueryViewComponent } from "./query-view";

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

  const queryResult = {
    rows: [
      {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        created_at: "2024-01-15T10:30:00Z",
        is_active: true,
      },
      {
        id: 2,
        username: "jane_smith",
        email: "jane@example.com",
        created_at: "2024-01-16T14:20:00Z",
        is_active: true,
      },
      {
        id: 3,
        username: "bob_wilson",
        email: "bob@example.com",
        created_at: "2024-01-17T09:15:00Z",
        is_active: false,
      },
    ],
    columns: [
      { name: "id", type: "integer" },
      { name: "username", type: "varchar" },
      { name: "email", type: "varchar" },
      { name: "created_at", type: "timestamp" },
      { name: "is_active", type: "boolean" },
    ],
    rowCount: 3,
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
      <div className='flex-1'>
        <QueryViewComponent data={queryResult} />
      </div>
      <div className='h-16'>query footer</div>
    </div>
  );
}
