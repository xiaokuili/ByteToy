"use client";

import { useState } from "react";
import { QuerySearchHeaderComponent } from "./query-search-header";
import { QuerySearchSqlEditor } from "./query-search-sql";
export function QueryContentComponent() {
  const [isQuerySearchContentVisible, setIsQuerySearchContentVisible] =
    useState(false);
  const onTonggleQuerySearchContent = () => {
    setIsQuerySearchContentVisible(!isQuerySearchContentVisible);
  };
  return (
    <div className="flex flex-col h-full w-full">
      {/* query header */}
      <QuerySearchHeaderComponent
        onTonggleQuerySearchContent={onTonggleQuerySearchContent}
      />
      {isQuerySearchContentVisible && <QuerySearchSqlEditor />}
      <div className="flex-1">query table</div>
      <div className="h-16">query footer</div>
    </div>
  );
}
