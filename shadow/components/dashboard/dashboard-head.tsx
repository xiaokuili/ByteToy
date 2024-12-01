"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, ShareIcon } from "lucide-react";
import { useDashboardOperations } from "@/hook/use-dashboard";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardHeaderProps {
  title?: string;
  dashboardId: string;
}

export function DashboardHeader({
  title = "未命名仪表盘",
  dashboardId,
}: DashboardHeaderProps) {
  const { save } = useDashboardOperations();
  const [saveLoading, setSaveLoading] = useState(false);
  const [title, setTitle] = useState(title);
  
  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between p-4 '>
        <div className='flex items-center gap-4'>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='text-lg font-semibold w-[300px]'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button 
            variant='outline' 
            size='sm'
            disabled={saveLoading}
            onClick={async () => {
              setSaveLoading(true);
              try {
                if (!dashboardId) {
                  toast.error('仪表盘ID不存在');
                  return;
                }
                await save(dashboardId);
                toast.success('保存成功');
              } catch (error) {
                toast.error('保存失败');
              } finally {
                setSaveLoading(false);
              }
            }}
          >
            <SaveIcon className='w-4 h-4 mr-2' />
            {saveLoading ? '保存中...' : '保存'}
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
