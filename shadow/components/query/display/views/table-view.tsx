import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  QueryResult,
  QueryResultView,
  ViewModeDefinition,
  ViewProcessor,
} from "../types";

const tableProcessor: ViewProcessor = {
  processData: (data: QueryResult) => {
    return { data: data, isValid: true };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateData(data: QueryResult) {
    // 表格视图的验证逻辑
    return { isValid: true };
  },
};

function TableViewComponent({ data }: { data: QueryResult }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {data.columns.map((column) => (
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
        {data.rows.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            className='hover:bg-muted/30 transition-colors'
          >
            {data.columns.map((column) => (
              <TableCell
                key={`${rowIndex}-${column.name}`}
                className='py-1.5 px-3 text-xs'
              >
                <div className='max-w-[300px] truncate'>
                  {formatCellValue(
                    row[column.name] as
                      | null
                      | undefined
                      | number
                      | boolean
                      | Date
                      | object
                      | string
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function createTableView(
  definition: ViewModeDefinition
): QueryResultView {
  return {
    Component: TableViewComponent,
    definition: definition,
    processor: tableProcessor,
  };
}

function formatCellValue(
  value: null | undefined | number | boolean | Date | object | string
): string {
  if (value === null) return "null";
  if (value === undefined) return "—";

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "Invalid number";
    if (Number.isInteger(value)) return value.toString();
    return Math.abs(value) < 0.01 ? value.toExponential(2) : value.toFixed(2);
  }

  if (typeof value === "boolean") return value ? "true" : "false";

  if (value instanceof Date) {
    return !isNaN(value.getTime())
      ? new Intl.DateTimeFormat("default", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(value)
      : "Invalid date";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value) || "[Object]";
    } catch {
      return "[Object]";
    }
  }

  return String(value || "");
}
