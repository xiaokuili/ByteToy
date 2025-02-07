"use client";
import { useOutline } from "@/hook/useOutline";
import { useInput } from "@/hook/useInput";
import { useEffect, useState } from "react";
import { OutlineItem } from "@/server/generateOutline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Table, BarChart, List, LucideIcon, FileIcon as File, ImageIcon as Image, PlusIcon, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function ReportTemplater() {
  const [outlines, setOutlines] = useState<OutlineItem[]>([]);

  const { title } = useInput();

  const { generate, generateMessage, isGenerating, error } = useOutline();

  useEffect(() => {
    if (!title.trim()) return;
    console.log('Effect triggered');  // 这个日志会打印两次

    const generateOutlines = async () => {
      try {
        const outlines = await generate({ title });
        setOutlines(outlines);
      } catch (error) {
        console.error(error);
      }
    };
    generateOutlines();
  }, [generate, title]);

  const onAdd = (item: OutlineItem) => {
    setOutlines(outlines => {
      const index = outlines.findIndex(outline => outline.id === item.id);
      const newOutlines = [...outlines];
      newOutlines.splice(index + 1, 0, {
        id: Math.random().toString(),
        title: "新章节",
        type: "text",
        level: item.level
      });
      return newOutlines;
    });
  }
  const onEdit = (item: OutlineItem) => {
    setOutlines(outlines => {
      return outlines.map(outline => {
        if (outline.id === item.id) {
          return item;
        }
        return outline;
      });
    });
  }
  const onDelete = (item: OutlineItem) => {
    setOutlines(outlines => outlines.filter(outline => outline.id !== item.id));
  }


  return <div className="flex flex-col gap-1 p-4">
    <div className="text-lg font-medium mb-2">大纲</div>
    {isGenerating ? (
      <div>生成中...{generateMessage}</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      outlines.map((item) => (
        <OutlineItemButton key={item.id} item={item} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      ))
    )}
  </div>;
}

const outlineTypeIcons: Record<string, LucideIcon> = {
  text: FileText,
  table: Table,
  chart: BarChart,
  image: Image,
  list: List,
  title: File,
  subtitle: FileText
} as const;




// 层级 icon表示类型  operator   
function OutlineItemButton({ item, onAdd, onEdit, onDelete }: {
  item: OutlineItem,
  onAdd: (item: OutlineItem) => void,
  onEdit: (item: OutlineItem) => void,
  onDelete: (item: OutlineItem) => void,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const Icon = outlineTypeIcons[item.type as keyof typeof outlineTypeIcons] || File;

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[rgba(0,0,0,0.04)] cursor-pointer relative',
        'text-[rgb(55,53,47)] text-sm min-h-[28px]'
      )}
      style={{
        paddingLeft: `${(item.level + 1) * 12}px`
      }}
    >
      <Icon className="w-4 h-4 opacity-60" />
      <div className="flex-1 truncate text-left">
        {item.title}
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <OutlineItemOperator item={item} onAdd={onAdd} onDelete={onDelete} setIsEditing={setIsEditing} />
      </div>

      {isEditing && (
        <div className="absolute left-[64px] right-2 top-full mt-1 z-50">
          <Input
            autoFocus
            defaultValue={item.title}
            className="w-full border-blue-500 ring-2 ring-blue-500 ring-opacity-50 shadow-sm bg-white text-xs py-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEdit({ ...item, title: e.currentTarget.value });
                setIsEditing(false);
              }
              if (e.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            onBlur={(e) => {
              onEdit({ ...item, title: e.currentTarget.value });
              setIsEditing(false);
            }}
          />
        </div>
      )}
    </div>
  );
}


function OutlineItemOperator(
  { item, onAdd, onDelete, setIsEditing }:
    {
      item: OutlineItem,
      onAdd: (item: OutlineItem) => void,
      onDelete: (item: OutlineItem) => void,
      setIsEditing: (isEditing: boolean) => void,
    }) {
  return <div>
    <div className="flex items-center ">
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAdd(item)}>
        <PlusIcon className="h-4 w-4  opacity-80" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4 opacity-80" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="truncate text-xs opacity-80" onClick={() => {
            setIsEditing(true);
            console.log("编辑", item)
          }}>
            <Pencil className="h-3 w-3 mr-2" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem className="truncate text-red-600 text-xs opacity-80" onClick={() => onDelete(item)}>
            <Trash className="h-3 w-3 mr-2" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
}
