"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, ShareIcon } from "lucide-react";
import { useDashboardOperations } from "@/hook/use-dashboard";

interface DashboardHeaderProps {
  title?: string;
  section_id: string;
}

export function DashboardHeader({
  title = "未命名仪表盘",
  section_id,
}: DashboardHeaderProps) {
  const { save } = useDashboardOperations();

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between p-4 '>
        <div className='flex items-center gap-4'>
          <Input
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            className='text-lg font-semibold w-[300px]'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button 
            variant='outline' 
            size='sm' 
            onClick={() => save()}
          >
            <SaveIcon className='w-4 h-4 mr-2' />
            保存
          </Button>
          <Button variant='outline' size='sm'>
            <ShareIcon className='w-4 h-4 mr-2' />
            分享
          </Button>
        </div>
      </div>
    </div>
  );
}
