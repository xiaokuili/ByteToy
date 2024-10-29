"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRightFromSquare } from "lucide-react";

export function QuestionHeaderComponent() {
  return (
    <div className='flex items-center justify-between  px-16 h-full'>
      <h1 className='text-[18px] font-bold text-[rgb(105,110,123)]   antialiased'>
        查询
      </h1>
      <div className='flex items-center space-x-2'>
        <Button
          variant='ghost'
          className='text-blue-500 hover:text-blue-600 hover:bg-blue-50'
        >
          保存
        </Button>
      </div>
    </div>
  );
}
