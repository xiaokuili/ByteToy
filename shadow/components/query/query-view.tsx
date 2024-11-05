"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface QueryViewProps {
  data: {
    rows: any[];
    columns: Array<{
      name: string;
      type: string;
    }>;
    rowCount: number;
  };
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

export function QueryViewComponent({
  data,
  error,
}: {
  data: QueryViewProps;
  error: string;
}) {
  // 1. 添加空状态处理
  if (!data && !error) {
    return (
      <Card className='h-full flex items-center justify-center text-muted-foreground'>
        <div className='text-center'>
          <p className='text-sm'>No query results to display</p>
          <p className='text-xs mt-1'>Execute a query to see results</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return <QueryErrorView error={error} />;
  }

  const { rows, columns, rowCount } = data;

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
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex-none flex flex-row items-center justify-between space-y-0 py-3'>
        <div className='flex items-center gap-2'>
          <CardTitle className='text-sm font-medium'>Query Results</CardTitle>
          <Badge variant='secondary' className='text-xs'>
            {rowCount} {rowCount === 1 ? "row" : "rows"}
          </Badge>
        </div>

        {/* 3. 添加执行时间和其他元数据 */}
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <span>{columns.length} columns</span>
          {data.executionTime && <span>· {data.executionTime}ms</span>}
        </div>
      </CardHeader>

      <CardContent className='flex-1 min-h-0 p-0'>
        <ScrollArea className='h-full w-full rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.name}
                    className='bg-muted/50 py-2 h-8 whitespace-nowrap'
                  >
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-xs font-medium'>{column.name}</span>
                      <span className='text-[10px] text-muted-foreground font-normal'>
                        {column.type}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className='hover:bg-muted/30 transition-colors'
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${rowIndex}-${column.name}`}
                      className='py-1.5 px-3 text-xs'
                    >
                      <div className='max-w-[300px] truncate'>
                        {formatCellValue(row[column.name])}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// 4. 改进格式化函数
function formatCellValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "—"; // 使用破折号表示空值

  if (typeof value === "number") {
    if (Number.isInteger(value)) return value.toString();
    // 根据数值大小动态调整精度
    return Math.abs(value) < 0.01 ? value.toExponential(2) : value.toFixed(2);
  }

  if (typeof value === "boolean") return value ? "true" : "false";

  if (value instanceof Date) {
    return new Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(value);
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Object]";
    }
  }

  return String(value);
}
