import React from 'react';
import Editor from './editor';
import Composer from './composer';


export default function DocPage() {
  return (
    <div className="flex w-full h-full">
      <div className="flex-1 max-w-[75%] h-full ">
        <Editor />
      </div>
      <div className="w-[350px] max-w-[25%] border-l border-gray-200 h-screen">
        <Composer />
      </div>
    </div>
  );
}
