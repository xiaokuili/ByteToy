"use client";
import { useOutline } from "@/hook/useOutline";
import { useInput } from "@/hook/useInput";
import { useEffect, useState } from "react";
import { OutlineItem } from "@/server/generateOutline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Table, BarChart, List, LucideIcon, FileIcon as File, ImageIcon as Image, PlusIcon, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ReportTemplater() {
  const [outlines, setOutlines] = useState<OutlineItem[]>([]);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const { title } = useInput();

  const { generate, generateMessage, isGenerating, error } = useOutline();

  useEffect(() => {
    const generateOutlines = async () => {
      const outlines = await generate({ title: title });
      setOutlines(outlines);
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
    console.log("修改", item)
    setIsEditingId(item.id);
  }
  const onDelete = (item: OutlineItem) => {
    setOutlines(outlines => outlines.filter(outline => outline.id !== item.id));
  }
  return <div className="flex flex-col gap-1 p-4">
    {isGenerating ? (
      <div>生成中...{generateMessage}</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      outlines.map((item) => (
        <OutlineItemButton key={item.id} item={item} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} isEditing={isEditingId === item.id}/>
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
function OutlineItemButton({ item, onAdd, onEdit, onDelete, isEditing }: { 
    item: OutlineItem, 
    onAdd: (item: OutlineItem) => void, 
    onEdit: (item: OutlineItem) => void, 
    onDelete: (item: OutlineItem) => void,
    isEditing: boolean
  }) {
  const Icon = outlineTypeIcons[item.type as keyof typeof outlineTypeIcons] || File;
  if (isEditing) {
    console.log("修改", item)
  }
  return (
    <button
      className={cn(
        'group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[rgba(0,0,0,0.04)] cursor-pointer',
        'text-[rgb(55,53,47)] text-sm min-h-[28px]'
      )}
      style={{
        paddingLeft: `${(item.level + 1) * 12}px`
      }}
      onClick={() => {
        console.log(item);
      }}
    >
      <Icon className="w-4 h-4 opacity-60" />

      {isEditing ? (
        <input
          className="flex-1 bg-transparent border-none outline-none" 
          defaultValue={item.title}
          autoFocus
        />
      ) : (
        <div className="flex-1 truncate text-left">
          {item.title}
        </div>
      )}

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <OutlineItemOperator item={item} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </button>
  );
}


function OutlineItemOperator(
  { item, onAdd, onEdit, onDelete }: 
  {
    item: OutlineItem,
    onAdd: (item: OutlineItem) => void,
    onEdit: (item: OutlineItem) => void,
    onDelete: (item: OutlineItem) => void
  }) {
  return <div>
    <div className="flex items-center ">
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAdd( item )}>
        <PlusIcon className="h-4 w-4  opacity-80" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4 opacity-80" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="truncate text-xs opacity-80" onClick={() => onEdit( item )}>
            <Pencil className="h-3 w-3 mr-2" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem className="truncate text-red-600 text-xs opacity-80" onClick={() => onDelete( item )}>
            <Trash className="h-3 w-3 mr-2" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
}
