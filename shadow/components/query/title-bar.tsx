"use client";

import { Button } from "@/components/ui/button";
import { createVisualization } from "@/lib/visualization-actions";
import { useVisualization } from "@/hook/use-visualization";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function QuestionHeaderComponent() {
  const {
    datasourceId,
    sqlContent,
    viewMode,
    sqlVariables,
    id,
    name,
    setName,
  } = useVisualization();
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    if (!name) return;

    setIsSaving(true);
    try {
      await createVisualization({
        id,
        name,
        datasourceId,
        sqlContent,
        viewMode,
        viewParams: {},
        sqlVariables,
      });

      toast.success("保存成功", {
        description: "可以在查询列表中查看",
      });
      setIsOpen(false);
      setName("");
    } catch (err) {
      console.error(err);
      toast.error("保存失败", {
        description: "请稍后重试",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='flex items-center justify-between px-16 h-full'>
      <h1 className='text-[18px] font-bold text-[rgb(105,110,123)] antialiased'>
        查询
      </h1>
      <div className='flex items-center space-x-2'>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              className='text-blue-500 hover:text-blue-600 hover:bg-blue-50'
            >
              保存
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>保存可视化</AlertDialogTitle>
              <AlertDialogDescription>
                请输入可视化名称以保存当前查询
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='py-4'>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='可视化名称'
                className='w-full'
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSave}
                disabled={isSaving || !name}
              >
                {isSaving ? "保存中..." : "确定"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
