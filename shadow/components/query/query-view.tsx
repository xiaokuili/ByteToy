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
  console.log(data, error);
  if (!data && !error) {
    return null;
  }
  if (error) {
    return <QueryErrorView error={error} />;
  }
  const { rows, columns, rowCount } = data;

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex-none flex flex-row items-center justify-between space-y-0 py-3'>
        {" "}
        {/* 减小头部高度 */}
        <CardTitle className='text-sm font-medium'>Query Results</CardTitle>
        <Badge variant='secondary' className='text-xs'>
          {rowCount} rows
        </Badge>
      </CardHeader>
      <CardContent className='flex-1 min-h-0 p-0'>
        <ScrollArea className='h-full w-full rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                {" "}
                {/* 禁用hover效果 */}
                {columns.map((column) => (
                  <TableHead
                    key={column.name}
                    className='bg-muted/50 py-2 h-8' // 减小表头高度
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
                      className='py-1.5 px-3 text-xs' // 减小单元格内边距
                    >
                      {formatCellValue(row[column.name])}
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

// 优化格式化函数
function formatCellValue(value: any): string {
  if (value === null) return "null"; // 小写的 null
  if (value === undefined) return "";

  // 处理数字
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(2); // 限制小数位数
  }

  // 处理布尔值
  if (typeof value === "boolean") {
    return value ? "true" : "false"; // 小写的布尔值
  }

  // 处理日期
  if (value instanceof Date) {
    return value.toISOString();
  }

  // 处理对象
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "[Object]";
    }
  }

  return String(value);
}
