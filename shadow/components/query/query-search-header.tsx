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
import { getMetadatas } from "@/lib/datasource-action";
import { Maximize2 } from "lucide-react";
import { toast } from "sonner";
export function QuerySearchHeaderComponent({
  onTonggleQuerySearchContent,
  onSelectDatabase,
}: {
  onTonggleQuerySearchContent: () => void;
  onSelectDatabase: (databaseId: string) => void;
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
    <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white border-y'>
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
