"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, ShareIcon, X } from "lucide-react";
import { useState } from "react";
import { Variable } from "@/types/base";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title?: string;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function DashboardHeader({
  title = "未命名仪表盘",
  onTitleChange,
  onSave,
  onShare,
}: DashboardHeaderProps) {
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
          <Button variant='outline' size='sm' onClick={onSave}>
            <SaveIcon className='w-4 h-4 mr-2' />
            保存
          </Button>
          <Button variant='outline' size='sm' onClick={onShare}>
            <ShareIcon className='w-4 h-4 mr-2' />
            分享
          </Button>
        </div>
      </div>
    </div>
  );
}
