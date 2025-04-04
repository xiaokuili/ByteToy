import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMetadatas } from "@/lib/datasource-action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Database as DatabaseIcon, Server } from "lucide-react";
import { SelectItem } from "@/components/ui/select";
import { useQueryAndViewState } from "@/hook/use-visualization";
import { Datasource } from "@/types/base";
interface Database {
  id: string;
  name: string;
}

interface DatabaseOptionProps {
  database: Database;
}

function DatabaseOption({ database }: DatabaseOptionProps) {
  return (
    <SelectItem value={database.id} className='group'>
      <div className='flex items-center gap-2 py-1'>
        <Server className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
        <span className='font-medium group-hover:text-primary transition-colors'>
          {database.name}
        </span>
      </div>
    </SelectItem>
  );
}

interface DatabaseSelectorProps {
  onSelect: (id: string) => void;
}

export function DatabaseSelector({ onSelect }: DatabaseSelectorProps) {
  const [databases, setDatabases] = useState<{ id: string; name: string }[]>(
    []
  );
  const { databaseId } = useQueryAndViewState();
  useEffect(() => {
    const fetchDatabases = async () => {
      const response = await getMetadatas();
      if (response.success) {
        setDatabases(
          response.data.map((db: Datasource) => ({
            id: db.id,
            name: db.displayName,
          }))
        );
      } else {
        toast.error(response.error);
      }
    };

    fetchDatabases();
  }, []);

  return (
    <Select value={databaseId || ""} onValueChange={onSelect}>
      <SelectTrigger
        className={cn(
          "w-[250px]",
          "bg-background",
          "border-muted",
          "hover:bg-muted/50",
          "transition-colors"
        )}
      >
        <div className='flex items-center gap-2'>
          <DatabaseIcon className='h-4 w-4 text-muted-foreground' />
          <SelectValue placeholder='选择数据库'>
            {databases.find((db) => db.id === databaseId)?.name || "选择数据库"}
          </SelectValue>
        </div>
        <ChevronDown className='h-4 w-4 text-muted-foreground' />
      </SelectTrigger>
      <SelectContent>
        {databases.map((db) => (
          <DatabaseOption key={db.id} database={db} />
        ))}
      </SelectContent>
    </Select>
  );
}
