"use client";

import { useState, useEffect } from "react";
import { MonacoEditor } from "@/components/ui/monaco-editor";
import { Button } from "@/components/ui/button";
import { Play, Copy } from "lucide-react";
import { getMetadata, checkConnection } from "@/lib/datasource-action";
import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api"; // 正确的导入方式

export function QuerySearchSqlEditor({ databaseId }: { databaseId: string }) {
  const [sql, setSql] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Monaco.languages.CompletionItem[]
  >([]);

  useEffect(() => {
    const fetchDatabaseStructure = async () => {
      if (!databaseId) return;
      try {
        // 1. 获取数据库元数据
        // const metadataResponse = await getMetadata(databaseId);
        // if (!metadataResponse.success) {
        //   console.error("Failed to get metadata:", metadataResponse.error);
        //   return;
        // }
        // const metadata = metadataResponse.data;
        // // 2. 获取数据库结构
        // const dbStructure = await checkConnection(metadata);
        // console.log(dbStructure);
        // // 3. 构建suggestions
        // const newSuggestions: Monaco.languages.CompletionItem[] = [];
        // // 添加表和列的建议
        // Object.values(dbStructure.schemas).forEach((schema) => {
        //   schema.tables.forEach((table) => {
        //     // 添加表名建议
        //     newSuggestions.push({
        //       label: table.name,
        //       kind: Monaco.languages.CompletionItemKind.Class,
        //       insertText: table.name,
        //       detail: `Table in ${schema.name}`,
        //       documentation: {
        //         value: `**Table**: ${table.name}\n\nColumns:\n${table.columns
        //           .map((col) => `- ${col.name} (${col.type})`)
        //           .join("\n")}`,
        //       },
        //     });
        //     // 添加列名建议
        //     table.columns.forEach((column) => {
        //       newSuggestions.push({
        //         label: `${table.name}.${column.name}`,
        //         kind: Monaco.languages.CompletionItemKind.Field,
        //         insertText: column.name,
        //         detail: `Column (${column.type})`,
        //         documentation: {
        //           value: `**Column**: ${column.name}\n**Type**: ${column.type}\n**Table**: ${table.name}`,
        //         },
        //       });
        //     });
        //   });
        // });
        // setSuggestions(newSuggestions);
      } catch (error) {
        console.error("Error fetching database structure:", error);
      }
    };

    if (databaseId) {
      fetchDatabaseStructure();
    }
  }, [databaseId]);

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
        <MonacoEditor
          value={sql}
          onChange={(value) => setSql(value || "")}
        />
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
