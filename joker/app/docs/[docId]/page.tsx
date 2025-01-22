import React from 'react';
import Editor from './editor';


export default function DocPage() {
  return (
    <div className="h-full flex ">
      {/* 左侧可滚动区域 */}
        <Editor />
     
    </div>
  );
}

