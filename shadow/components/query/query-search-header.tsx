"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Variable } from "./tpyes";
import { getMetadatas } from "@/lib/datasource-action";
import { Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function QuerySearchHeaderComponent({
  onTonggleQuerySearchContent,
  onSelectDatabase,
  variables,
}: {
  onTonggleQuerySearchContent: () => void;
  onSelectDatabase: (databaseId: string) => void;
  variables: Variable[];
}) {
  const [databases, setDatabases] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    const fetchDatabases = async () => {
      const response = await getMetadatas();
      if (response.success) {
        setDatabases(
          response.data.map((db: any) => ({
            id: db.id,
            name: db.name || db.displayName,
          }))
        );
      } else {
        toast.error(response.error);
      }
    };

    fetchDatabases();
  }, []);
  const handleClick = () => {
    onTonggleQuerySearchContent();
  };
  return (
    <div className='border-y border-border bg-muted/5'>
      {/* 主容器 */}
      <div className='flex flex-col space-y-3 p-4'>
        {/* 顶部工具栏 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {/* 数据库选择器 */}
            <Select
              defaultValue={databases[0]?.id}
              onValueChange={onSelectDatabase}
            >
              <SelectTrigger className='w-[200px] bg-background'>
                <SelectValue placeholder='Select database' />
              </SelectTrigger>
              <SelectContent>
                {databases.map((db) => (
                  <SelectItem key={db.id} value={db.id}>
                    {db.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 可以添加其他工具按钮 */}
            <div className='flex items-center gap-2'>{/* 其他控件 */}</div>
          </div>

          {/* 右侧按钮 */}
          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-foreground transition-colors'
            onClick={handleClick}
          >
            <Maximize2 className='h-4 w-4' />
          </Button>
        </div>

        {/* 变量区域 - 只在有变量时显示 */}
        {variables.length > 0 && (
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center gap-2'>
              <Label className='text-sm text-muted-foreground'>Variables</Label>
              <Badge variant='secondary' className='text-xs'>
                {variables.length}
              </Badge>
            </div>

            {/* 变量网格 */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {variables.map((variable) => (
                <div
                  key={variable.id}
                  className='flex items-center gap-3 bg-background rounded-lg p-3 border shadow-sm hover:shadow transition-all'
                >
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm font-medium'>
                        {variable.name}
                      </Label>
                      <Badge
                        variant='secondary'
                        className='text-[10px] px-2 py-0.5 bg-muted'
                      >
                        {variable.type}
                      </Badge>
                    </div>
                    <Input
                      value={variable.value}
                      placeholder={`Enter ${variable.name}`}
                      className='h-8 text-sm bg-muted/30 focus:bg-background transition-colors'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
