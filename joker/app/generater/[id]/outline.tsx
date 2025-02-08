"use client";
import { useOutline } from "@/hook/useOutline";
import { useInput } from "@/hook/useInput";
import { useEffect, useState } from "react";
import { OutlineBase } from "@/server/generateOutlineBase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Table, BarChart, List, LucideIcon, FileIcon as File, ImageIcon as Image, PlusIcon, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { OutlineItem } from "@/hook/useOutline";

export default function ReportOutline() {
  const {items, updateItem, addItem, deleteItem} = useOutline()
  const { title , report_id} = useInput();

  const { generate, initGenerateMessage: generateMessage, isInitGenerating: isGenerating, error } = useOutline();

  useEffect(() => {
    if (!title.trim()) return;

    const generateOutlines = async () => {
      try {
        const outlines = await generate({ report_title: title });
        outlines.forEach((outline: OutlineItem) => {
          updateItem(outline.outlineID, {
            reportID: report_id ,
          })
        })
        
      } catch (error) {
        console.error(error);
      }
    };
    generateOutlines();
  }, [generate, report_id, title, updateItem]);

  const onAdd = (item: OutlineBase) => {
    addItem({
      outlineID: Math.random().toString(),
      outlineTitle: "新章节",
      type: "text",
      level: item.level,
      reportID: title
    });
  }
  const onEdit = (item: OutlineBase) => {
    updateItem(item.outlineID, {
      outlineTitle: item.outlineTitle
    });
  }
  const onDelete = (item: OutlineBase) => {
    deleteItem(item.outlineID);
  }


  return <div className="flex flex-col gap-1 p-4">
    <div className="text-lg font-medium mb-2">大纲</div>
    {isGenerating ? (
      <div>生成中...{generateMessage}</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      items.map((item) => (
        <OutlineItemButton key={item.outlineID} item={item} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
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
  item: OutlineBase,
  onAdd: (item: OutlineBase) => void,
  onEdit: (item: OutlineBase) => void,
  onDelete: (item: OutlineBase) => void,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const {setCurrentOutline, currentOutline} = useOutline()
  const Icon = outlineTypeIcons[item.type as keyof typeof outlineTypeIcons] || File;

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[rgba(0,0,0,0.04)] cursor-pointer relative',
        'text-[rgb(55,53,47)] text-sm min-h-[28px]',
        currentOutline?.outlineID === item.outlineID && 'bg-[rgba(0,0,0,0.04)] '
      )}
      style={{
        paddingLeft: `${(item.level + 1) * 12}px`
      }}
    >
      <Icon className="w-4 h-4 opacity-60" />
      <button className="flex-1 truncate text-left" onClick={() => setCurrentOutline(item)}>
        {item.outlineTitle}
      </button>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <OutlineItemOperator item={item} onAdd={onAdd} onDelete={onDelete} setIsEditing={setIsEditing} />
      </div>

      {isEditing && (
        <div className="absolute left-[64px] right-2 top-full mt-1 z-50">
          <Input
            autoFocus
            defaultValue={item.outlineTitle}
            className="w-full border-blue-500 ring-2 ring-blue-500 ring-opacity-50 shadow-sm bg-white text-xs py-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEdit({ ...item, outlineTitle: e.currentTarget.value });
                setIsEditing(false);
              }
              if (e.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            onBlur={(e) => {
              onEdit({ ...item, outlineTitle: e.currentTarget.value });
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
      item: OutlineBase,
      onAdd: (item: OutlineBase) => void,
      onDelete: (item: OutlineBase) => void,
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
