"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Maximize2 } from "lucide-react";

export function QuerySearchHeaderComponent({
  onTonggleQuerySearchContent,
}: {
  onTonggleQuerySearchContent: () => void;
}) {
  const handleClick = () => {
    onTonggleQuerySearchContent();
  };
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white border-y">
      <Select defaultValue="db">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select database" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="db">Db</SelectItem>
          <SelectItem value="mysql">MySQL</SelectItem>
          <SelectItem value="postgres">PostgreSQL</SelectItem>
          <SelectItem value="mongodb">MongoDB</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-500"
        onClick={handleClick}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
