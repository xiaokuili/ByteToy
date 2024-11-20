"use client";

import { useState } from "react";
import { Variable } from "@/types/base";
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
import { useQueryAndViewState } from "@/hook/use-visualization";
import { toast } from "sonner";

interface SQLEditorProps {
  variables: Variable[];
  sqlContent: string;
  setVariables: (variables: Variable[]) => void;
  setSqlContent: (sql: string) => void;
}

// Main Component
export function QuerySearchSqlEditor({
  variables,
  sqlContent,
  setVariables,
  setSqlContent,
}: SQLEditorProps) {
  const { isExecuting, setIsExecuting } = useQueryAndViewState();
  // UI States
  const [showPreview, setShowPreview] = useState(false);
  const { databaseId } = useQueryAndViewState();

  // SQL Content Handlers
  const handleSqlChange = (value: string) => {
    setSqlContent(value);
    const newVariables = parseVariables(value);
    setVariables(newVariables.length > 0 ? newVariables : []);
  };

  // Query Execution
  const handleExecute = async () => {
    if (!validateQuery()) return;
    setIsExecuting(true);
  };

  // Query Validation
  const validateQuery = (): boolean => {
    if (!sqlContent.trim()) {
      toast.error("请输入SQL语句");
      return false;
    }
    if (!databaseId) {
      toast.error("请选择数据库");
      return false;
    }
    return true;
  };

  // Preview Logic
  const getPreviewSql = () => getFinalSql(sqlContent, variables);
  return (
    <div className='flex'>
      <SQLEditorUI
        onExecute={handleExecute}
        onShowPreview={() => setShowPreview(true)}
        sqlContent={sqlContent}
        onSqlChange={handleSqlChange}
        isExecuting={isExecuting}
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
  onExecute: () => void;
  onShowPreview: () => void;
  sqlContent: string;
  onSqlChange: (value: string) => void;
  isExecuting: boolean;
}

export function SQLEditorUI({
  onExecute,
  onShowPreview,
  sqlContent,
  onSqlChange,
  isExecuting,
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
