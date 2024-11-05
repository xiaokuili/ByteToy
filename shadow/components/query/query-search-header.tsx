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
    <div className='flex items-center justify-between p-3 border-b border-gray-200  border-y'>
      <Select defaultValue={databases[0]?.id} onValueChange={onSelectDatabase}>
        <SelectTrigger className='w-[180px]'>
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
      <div className='flex flex-wrap gap-2 p-2'>
        {variables.length > 0 &&
          variables.map((variable) => (
            <div
              key={variable.id}
              className='flex items-center gap-2 min-w-[200px] bg-muted/30 rounded-md p-2'
            >
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2'>
                  <Label className='text-xs font-medium'>{variable.name}</Label>
                  <Badge variant='secondary' className='text-[10px]'>
                    {variable.type}
                  </Badge>
                </div>
                <Input
                  value={variable.value}
                  placeholder={`Enter ${variable.name}`}
                  className='h-8 text-sm'
                />
              </div>
            </div>
          ))}
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='text-gray-500'
        onClick={handleClick}
      >
        <Maximize2 className='h-4 w-4' />
      </Button>
    </div>
  );
}
