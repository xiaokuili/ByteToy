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
import {
  QueryViewFactory,
  QueryResult,
} from "@/components/query/display/view-factory";
import { cn } from "@/lib/utils";
import { queryViewFactory } from "@/components/query/display/view-factory";
import { useVisualization } from "@/hook/use-visualization";

export function ScrollCard({
  children,
  className,
  contentClassName,
  minWidth = "min-w-full",
}: ScrollCardProps) {
  return (
    <ScrollArea className='flex-1 h-full'>
      <div className={cn("min-h-0", minWidth, className)}>
        <div
          className={cn(
            "w-full h-full border rounded-lg bg-white",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
      <ScrollBar orientation='horizontal' />
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
}

function QueryErrorView({ error, title = "Query Error" }: QueryErrorViewProps) {
  return (
    <Card className='w-full border-destructive/50'>
      <CardHeader className='flex flex-row items-center gap-2 pb-2'>
        <AlertCircle className='h-4 w-4 text-destructive' /> {/* 修复这里 */}
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
  error: string;
}) {
  const { chartType, viewMode } = useVisualization();
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
  const View = queryViewFactory.getView(viewMode);

  return (
    <ScrollCard>
      <View className='min-h-full min-w-full' data={data} />
    </ScrollCard>
  );
}
