import React from 'react';
import Editor from './editor';
import Composer from './composer';


export default function DocPage() {
  return (
    <div className="h-full flex ">
      {/* 左侧可滚动区域 */}
      <div className="w-[75%] border-r ">
        <Editor />
      </div>
      <div className="w-[25%] min-w-0 h-full border-l">
        <Composer />
      </div>
    </div>
  );
}

