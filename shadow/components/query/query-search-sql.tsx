"use client";

import { useState } from "react";
import { MonacoEditor } from "@/components/ui/monaco-editor";
import { Button } from "@/components/ui/button";
import { Play, Copy } from "lucide-react";

export function QuerySearchSqlEditor({ databaseId }: { databaseId: string }) {
  const [sql, setSql] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!sql.trim()) return;

    setIsExecuting(true);
    try {
      // 执行 SQL 的逻辑
    } catch (error) {
      console.error("Error executing SQL:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
  };

  return (
    <div className='flex gap-2'>
      <div className='flex-1'>
        <MonacoEditor value={sql} onChange={(value) => setSql(value || "")} />{" "}
      </div>
      <div className='flex flex-col gap-2 pr-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleExecute}
          disabled={isExecuting}
        >
          <Play className='h-4 w-4' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleCopy}>
          <Copy className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
