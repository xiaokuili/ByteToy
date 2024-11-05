"use client";

import { useState, useEffect } from "react";
import SQLEditor from "@/components/ui/sql-editor/sql-editor";
import { Button } from "@/components/ui/button";
import { Play, Copy } from "lucide-react";
import { executeQuery } from "@/lib/datasource-action";
import { AlertTitle } from "../ui/alert";
import { Loader2 } from "lucide-react";
import { Variable } from "./tpyes";

export function QuerySearchSqlEditor({
  databaseId,
  setQueryResult,
  setQueryError,
  setVariables,
}: {
  databaseId: string;
  setQueryResult: (result: any) => void;
  setQueryError: (error: string) => void;
  setVariables: (variables: Variable[]) => void;
}) {
  const [sql, setSql] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const fetchDatabaseStructure = async () => {
      if (!databaseId) return;
    };

    if (databaseId) {
      fetchDatabaseStructure();
    }
  }, [databaseId]);

  const handleExecute = async () => {
    if (!sql.trim()) return;
    if (!databaseId) {
      setQueryError("Please select a database first.");
      return;
    }
    setIsExecuting(true);
    try {
      const result = await executeQuery(databaseId, sql);
      console.log(result);
      if (result.success) {
        setQueryResult(result.data);
      } else {
        setSqlError(result.error);
      }
    } catch (error) {
      console.error("Error executing SQL:", error);
    } finally {
      setIsExecuting(false);
    }
  };
  const parseVariables = (sql: string) => {
    // 匹配 {{变量名}} 格式
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: Variable[] = [];
    let match;

    // 查找所有匹配项
    while ((match = regex.exec(sql)) !== null) {
      const varName = match[1].trim();
      // 避免重复添加
      if (!variables.find((v) => v.name === varName)) {
        variables.push({
          id: crypto.randomUUID(),
          name: varName,
          value: "",
          type: "string", // 默认类型
        });
      }
    }
    console.log(variables);
    return variables;
  };
  // 在SQL改变时更新变量
  const handleSqlChange = (value: string) => {
    setSql(value);
    const newVariables = parseVariables(value);
    if (newVariables.length > 0) {
      setVariables(newVariables);
    } else {
      setVariables([]);
    }
  };

  const handleCopy = () => {};
  return (
    <div className='flex '>
      <div className='flex flex-col gap-2 '>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleExecute}
          disabled={isExecuting}
        >
          {isExecuting ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Play className='h-4 w-4' />
          )}
        </Button>
        <Button variant='ghost' size='icon' onClick={handleCopy}>
          <Copy className='h-4 w-4' />
        </Button>
      </div>
      <div className='flex-1'>
        <SQLEditor
          value={sql}
          onChange={handleSqlChange}
          height='200px'
          placeholder='SELECT * FROM users WHERE...'
        />
      </div>
    </div>
  );
}
