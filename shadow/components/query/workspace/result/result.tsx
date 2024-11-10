"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { cn } from "@/lib/utils";
import { useVisualization } from "@/hook/use-visualization";
import { QueryResult } from "../../display/types";
import { Visualization } from "@/components/query/display/visualization";

export function ScrollCard({
  children,
  className,
  contentClassName,
  minWidth = "min-w-full",
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  minWidth?: string;
}) {
  return (
    <ScrollArea className='flex-1 h-full'>
      <div
        className={cn(
          "min-h-0 w-full h-full border rounded-lg bg-white",
          minWidth,
          className,
          contentClassName
        )}
      >
        {children}
      </div>
      <ScrollBar orientation='horizontal' />
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
}

interface QueryErrorViewProps {
  error: string;
  title?: string;
}

function QueryErrorView({ error, title = "Query Error" }: QueryErrorViewProps) {
  return (
    <Card className='w-full border-destructive/50'>
      <CardHeader className='flex flex-row items-center gap-2 pb-2'>
        <AlertCircle className='h-4 w-4 text-destructive' />
        <CardTitle className='text-sm font-medium text-destructive'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className='mt-2 font-mono text-sm'>
            {error}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export function EmptyViewComponet() {
  return (
    <Card className='h-full w-full flex items-center justify-center text-muted-foreground'>
      <div className='text-center'>
        <p className='text-sm'>No query results to display</p>
        <p className='text-xs mt-1'>Execute a query to see results</p>
      </div>
    </Card>
  );
}


export function QueryViewComponent({
  data,
  error,
}: {
  data: QueryResult;
  error?: string;
}) {
  const { viewMode } = useVisualization();
  // 1. 添加空状态处理
  if (!data && !error) {
    return <EmptyViewComponet />;
  }

  if (error) {
    return <QueryErrorView error={error} />;
  }
  const { rows } = data;
  // 2. 添加空结果处理
  if (rows.length === 0) {
    return (
      <Card className='h-full flex items-center justify-center text-muted-foreground'>
        <div className='text-center'>
          <p className='text-sm'>Query returned no results</p>
          <p className='text-xs mt-1'>Try modifying your query</p>
        </div>
      </Card>
    );
  }
  

  return (
    <ScrollCard>
      <Visualization 
        viewId={viewMode} 
        queryResult={data} 
      />
    </ScrollCard>
  );
}


