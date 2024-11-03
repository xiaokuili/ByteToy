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

export function QueryErrorView({
  error,
  title = "Query Error",
}: QueryErrorViewProps) {
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

export function QueryViewComponent({
  data,
  error,
}: {
  data: QueryViewProps;
  error: string;
}) {
  if (!data) {
    return null;
  }
  if (error) {
    return <QueryErrorView error={error} />;
  }
  const { rows, columns, rowCount } = data;

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <CardTitle className='text-sm font-medium'>Query Results</CardTitle>
        <Badge variant='secondary'>{rowCount} rows</Badge>
      </CardHeader>
      <CardContent className='p-0'>
        <ScrollArea className='h-full rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.name} className='bg-muted/50'>
                    <div className='flex flex-col'>
                      <span>{column.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        {column.type}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.name}`}>
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

// 格式化单元格值的辅助函数
function formatCellValue(value: any): string {
  if (value === null) return "NULL";
  if (value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
