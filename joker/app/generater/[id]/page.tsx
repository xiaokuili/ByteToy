"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, GripVertical, Settings, Trash2 } from "lucide-react";
import { FullLoading } from "@/components/full-loading";
import { useOutline } from "@/hook/useOutline";
import { useInput } from "@/hook/useInput";
import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { cn } from "@/lib/utils";

interface OutlineItem {
  id: string;
  title: string;
  type?: 'title' | 'ai-text' | 'line-chart';
  children?: OutlineItem[];
  data?: Array<{
    name: string;
    description: string;
  }>;
}

export default function Page() {
  const { title, template } = useInput()
  const { generate, isGenerating, items, updateItem, deleteItem, addItem, reorderItems } = useOutline()

  const startDemo = () => {
    const driverObj = driver({
      showProgress: true,
      onHighlighted: (element) => {
        element?.classList.add('demo-highlight');
      },
     onDestroyed: () => {
      // 清除所有带有 demo-highlight 类的元素
      document.querySelectorAll('.demo-highlight').forEach(element => {
        element.classList.remove('demo-highlight');
      });
    },
      steps: [
        {
          // 首先高亮整个操作区域
          element: '[data-demo="actions-container"]',
          popover: {
            title: '操作区域',
            description: '选择对应的框架项',
            nextBtnText: '下一步',
            prevBtnText: '上一步'
          }
        },
        {
          element: '[data-demo="config-button"]',
          popover: {
            title: '第二步：数据配置',
            description: '点击这里可以配置节点的数据来源和展示方式',
            nextBtnText: '下一步',
            prevBtnText: '上一步'
          }
        },
        {
          element: '[data-demo="preview-button"]',
          popover: {
            title: '第三步：预览效果',
            description: '配置完成后，可以点击这里预览生成效果',
            nextBtnText: '完成',
            prevBtnText: '上一步'
          }
        }
      ]
    });

    driverObj.drive();
  };
  // 处理生成逻辑
  useEffect(() => {
    if (title || template) {
      generate({ title, template });
    }
  }, [title, template, generate]);

  // 单独处理演示逻辑
  useEffect(() => {
    // 确保：
    // 1. 有标题或模板
    // 2. 不在生成中
    // 3. 已经有items数据
    if ((title || template) && !isGenerating && items.length > 0) {
      const hasShownDemo = localStorage.getItem('has-shown-demo') === 'true';

      if (!hasShownDemo) {
        setTimeout(() => {
          startDemo();
          localStorage.setItem('has-shown-demo', 'true');
        }, 1000);
      }
    }
  }, [isGenerating, title, template, items]); // 添加 items 作为依赖

  return (
    <div className="max-w-3xl mx-auto">
      {!title && !template ? (
        <div className="container mx-auto max-w-3xl p-6 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-4">请先设置报告标题和模板</h2>
              <p className="text-muted-foreground mb-6">
                您需要先返回首页设置报告标题和上传模板，才能开始生成报告大纲
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2.5"
              >
                返回首页设置
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <FullLoading show={isGenerating} message="生成大纲中..." />
          <OutlineCard
            items={items}
            updateItem={updateItem}
            deleteItem={deleteItem}
            addItem={addItem}
            reorderItems={reorderItems}
          />
        </>
      )}
    </div>
  );
}

interface OutlineCardProps {
  items: OutlineItem[];
  updateItem: (id: string, updates: Partial<OutlineItem>) => void;
  deleteItem: (id: string) => void;
  addItem: (item: OutlineItem) => void;
  reorderItems: (newItems: OutlineItem[]) => void;
}

function OutlineCard({ items, updateItem, deleteItem }: OutlineCardProps) {


  return (
    <Card className="mt-8 border-0 shadow-lg min-h-[200px]">
      <CardContent className="p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <OutlineItem
              key={item.id}
              item={item}
              updateItem={updateItem}
              deleteItem={deleteItem}
              level={0}
              items={items}
            />
          ))}

        </div>
      </CardContent>
    </Card>
  );
}

function OutlineItem({ item, updateItem, deleteItem, level = 0, items }: {
  item: OutlineItem;
  updateItem: (id: string, updates: Partial<OutlineItem>) => void;
  deleteItem: (id: string) => void;
  level?: number;
  items: OutlineItem[];
}) {
  console.log(`Rendering OutlineItem "${item.title}" with level ${level}`);

  return (
    <div className="space-y-3">
      <div className={` group flex items-center justify-between ${item.children ? 'bg-muted/20 p-3' : 'p-2'
        } rounded-lg`} >
        <ItemTitle item={item} />
        <ItemActions
          item={item}
          items={items}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />
      </div>

      {item.children && (
        <div className="pl-6 space-y-2"  >
          {item.children.map((child) => {
            const nextLevel = level + 1;
            return (
              <OutlineItem
                key={child.id}
                item={child}
                updateItem={updateItem}
                deleteItem={deleteItem}
                level={nextLevel}
                items={items} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ItemTitle({ item }: {
  item: OutlineItem;
}) {

  return (
    <div className="flex items-center gap-2">
      <GripVertical className={`h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 cursor-move`} />
      {item.children ? (
        <h3 className="text-lg font-medium text-primary">{item.title}</h3>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{item.title}</p>
        </div>
      )}
    </div>
  );
}

function ItemActions({ item, items}: {
  item: OutlineItem;
  items: OutlineItem[];
  onUpdate: (id: string, updates: Partial<OutlineItem>) => void;
  onDelete: (id: string) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  return (
    <div 
      className="opacity-0 flex items-center gap-2 group-hover:opacity-100 [&.demo-highlight]:opacity-100"
      {...(items[0]?.children?.[0]?.id === item.id ? { 'data-demo': 'actions-container' } : {})}
    >
      {!item.children && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1",
            )}
            {...(items[0]?.children?.[0]?.id === item.id ? { 'data-demo': 'config-button' } : {})}
            onClick={() => setIsDialogOpen(true)}
          >
            <Settings className="h-3 w-3" />
            <span className="text-xs">数据配置</span>
          </Button>

          <Button
            variant="ghost" 
            size="sm"
            className={cn(
              "flex items-center gap-1",
            )}
            {...(items[0]?.children?.[0]?.id === item.id ? { 'data-demo': 'preview-button' } : {})}
          >
            <Eye className="h-3 w-3" />
            <span className="text-xs">预览</span>
          </Button>
        </>
      )}



      <ConfigDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        item={item}
      />
    </div>
  );
}

interface ConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: OutlineItem;
}

function ConfigDialog({ isOpen, onClose, item }: ConfigDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>数据配置</DialogTitle>
          <DialogDescription>
            配置此节点的数据来源和展示方式
          </DialogDescription>
        </DialogHeader>

        <DataList data={item.data} />

        <DialogFooter>
          <Button onClick={onClose}>
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DataList({ data }: { data?: Array<{ name: string; description: string }> }) {
  if (!data?.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        暂无数据配置
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
        >
          <div>
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}