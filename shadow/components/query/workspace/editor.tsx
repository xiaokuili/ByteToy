"use client";

import { useState, useEffect, useRef } from "react";
import { Variable } from "@/types/base";
import { executeQuery } from "@/lib/datasource-action";
import { Button } from "@/components/ui/button";
import { Play, Eye, Loader2 } from "lucide-react";
import { parseVariables, getFinalSql } from "@/utils/variable-utils";
import { SQLEditor } from "@/components/ui/sql-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Types
interface DatabaseProps {
  databaseId: string;
}

interface QueryState {
  sqlContent: string;
  variables: Variable[];
}

interface QueryActions {
  setQueryResult: (result: QueryResult) => void;
  setQueryError: (error: string) => void;
  setVariables: (variables: Variable[]) => void;
  setSqlContent: (sqlContent: string) => void;
}

interface SQLEditorProps extends DatabaseProps, QueryState, QueryActions {}

// Main Component
export function QuerySearchSqlEditor({
  databaseId,
  variables,
  sqlContent,
  setQueryResult,
  setQueryError,
  setVariables,
  setSqlContent,
}: SQLEditorProps) {
  // UI States
  const [isExecuting, setIsExecuting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // Execute query on initial load if SQL exists
  const initialLoadRef = useRef(false);

  useEffect(() => {
    const executeSqlOnLoad = async () => {
      // 如果已经执行过，则直接返回
      if (initialLoadRef.current) return;
      // 如果验证不通过，也直接返回
      if (!validateQuery()) return;

      initialLoadRef.current = true;
      setIsExecuting(true);
      setQueryResult(null);
      setQueryError("");

      try {
        const finalSql = getFinalSql(sqlContent, variables);
        const result = await executeQuery(databaseId, finalSql);

        if (result.success) {
          setQueryResult(result.data);
        } else {
          setQueryError(result.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error executing initial SQL:", error);
      } finally {
        setIsExecuting(false);
      }
    };

    executeSqlOnLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseId, sqlContent, variables, setQueryResult, setQueryError]);
  // SQL Content Handlers
  const handleSqlChange = (value: string) => {
    setSqlContent(value);
    const newVariables = parseVariables(value);
    setVariables(newVariables.length > 0 ? newVariables : []);
  };

  // Query Execution
  const handleExecute = async () => {
    if (!validateQuery()) return;

    try {
      await executeQueryWithVariables();
    } catch (error) {
      handleQueryError(error);
    }
  };

  // Query Validation
  const validateQuery = (): boolean => {
    if (!sqlContent.trim()) return false;
    if (!databaseId) {
      setQueryError("Please select a database first.");
      return false;
    }
    return true;
  };

  // Query Execution Logic
  const executeQueryWithVariables = async () => {
    setIsExecuting(true);
    setQueryResult(null);
    setQueryError("");

    const finalSql = getFinalSql(sqlContent, variables);
    const result = await executeQuery(databaseId, finalSql);

    if (result.success) {
      setQueryResult(result.data);
    } else {
      setQueryError(result.error || "Unknown error");
    }

    setIsExecuting(false);
  };

  const handleQueryError = (error: string) => {
    console.error("Error executing SQL:", error);
    setIsExecuting(false);
  };

  // Preview Logic
  const getPreviewSql = () => getFinalSql(sqlContent, variables);
  return (
    <div className='flex'>
      <SQLEditorUI
        isExecuting={isExecuting}
        onExecute={handleExecute}
        onShowPreview={() => setShowPreview(true)}
        sqlContent={sqlContent}
        onSqlChange={handleSqlChange}
      />

      <PreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        content={getPreviewSql()}
      />
    </div>
  );
}

interface SQLEditorUIProps {
  isExecuting: boolean;
  onExecute: () => void;
  onShowPreview: () => void;
  sqlContent: string;
  onSqlChange: (value: string) => void;
}

export function SQLEditorUI({
  isExecuting,
  onExecute,
  onShowPreview,
  sqlContent,
  onSqlChange,
}: SQLEditorUIProps) {
  return (
    <div className='flex w-full gap-4'>
      <div className='flex flex-col gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onExecute}
          disabled={isExecuting}
          className='text-blue-600 hover:text-blue-600 hover:bg-blue-50'
        >
          {isExecuting ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Play className='h-4 w-4' />
          )}
        </Button>

        <Button variant='ghost' size='icon' onClick={onShowPreview}>
          <Eye className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex-1 w-full'>
        <SQLEditor
          value={sqlContent}
          onChange={(value: string | undefined) => onSqlChange(value || "")}
          height='200px'
          placeholder='SELECT * FROM users WHERE...'
        />
      </div>
    </div>
  );
}

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  icon?: React.ReactNode;
}

export function PreviewDialog({
  open,
  onOpenChange,
  content,
  icon = <Eye className='h-4 w-4' />, // 默认图标
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {icon}
            Preview
          </DialogTitle>
          <DialogDescription>Preview content with formatting</DialogDescription>
        </DialogHeader>
        <div className='relative'>
          <pre className='p-4 rounded-lg bg-muted text-sm overflow-auto max-h-[400px] font-mono'>
            <code className='text-foreground'>{content}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
