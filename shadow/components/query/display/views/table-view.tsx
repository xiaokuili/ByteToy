import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { QueryResult } from "@/components/query/display/view-factory";

export class TableView implements QueryResultView {
  Component: React.ComponentType<QueryResult> = ({ data }) => {
    const { rows, columns } = data;

    return (
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
    );
  };
}

export function formatCellValue(value: any): string {
  // 首先处理 null 和 undefined
  if (value === null) return "null";
  if (value === undefined) return "—";

  // 数字处理
  if (typeof value === "number") {
    // 确保值不是 null 或 undefined
    if (!Number.isFinite(value)) return "Invalid number";

    if (Number.isInteger(value)) {
      return value.toString();
    }
    // 根据数值大小动态调整精度
    return Math.abs(value) < 0.01 ? value.toExponential(2) : value.toFixed(2);
  }

  // 布尔值处理
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  // 日期处理
  if (value instanceof Date) {
    if (!isNaN(value.getTime())) {
      // 确保是有效日期
      return new Intl.DateTimeFormat("default", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(value);
    }
    return "Invalid date";
  }

  // 对象处理
  if (typeof value === "object") {
    try {
      return JSON.stringify(value) || "[Object]";
    } catch {
      return "[Object]";
    }
  }

  // 其他类型转字符串
  return String(value || "");
}
