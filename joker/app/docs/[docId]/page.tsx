import React from 'react';
import Editor from './editor';
import Composer from './composer';


export default function DocPage() {
  return (
    <div className="h-full flex ">
      {/* 左侧可滚动区域 */}
      <div className="flex-1 border-r overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <Editor />
      </div>
      <div className="w-[600px] min-w-0 h-full border-l">
        <Composer />
      </div>
    </div>
  );
}

