"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, GripVertical, Loader2, Pencil, Send, Settings, Trash2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useOutline } from "@/hook/useOutline";
import { OutlineItem } from "@/server/generateOutline";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function Home() {
  const { title, setTitle, generate, isGenerating, error, items } = useOutline();

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">智能报告生成器</h1>
        <p className="text-muted-foreground">输入报告主题，AI将为您生成专业的商业报告</p>
      </div>

      <InputCard title={title} setTitle={setTitle} generate={generate} />

      {/* 大纲展示区域 */}
      {isGenerating && (
        <div className="mt-8 flex justify-center items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">正在生成大纲...</span>
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 rounded-lg bg-destructive/10 text-destructive">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isGenerating && !error && items.length > 0 && (
        <div className="space-y-4">
          <OutlineCard items={items} />
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full"
          >
            <Button
              className="w-full px-6 py-2.5 rounded-lg shadow-sm
                   transition duration-200 ease-in-out
                   disabled:opacity-50 disabled:cursor-not-allowed"

            >
              <FileText className="h-4 w-4 mr-2" />
              生成报告正文
            </Button>
          </motion.div>
        </div>
      )}

    </div>
  );
}


function InputCard({ title, setTitle, generate }: {
  title: string;
  setTitle: (title: string) => void;
  generate: () => void;
}) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/80 backdrop-blur-sm">
      <CardContent className="p-8">
        {/* 输入区域 */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative group flex-1">
              <Input
                placeholder="请输入报告标题，如：杭州市2025年生物医药产业研究报告"
                className="w-full p-5 text-base bg-background 
                     rounded-lg border border-input 
                     focus:ring-2 focus:ring-ring/20 focus:border-ring
                     transition-all
                     shadow-sm hover:shadow-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              className="px-6 py-2.5 rounded-lg border border-input
                   hover:bg-accent
                   transition duration-200 ease-in-out"
            >
              <Upload className="h-4 w-4 mr-2" />
              上传模板
            </Button>
          </div>

          {/* 提交按钮 */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full"
          >
            <Button
              className="w-full px-6 py-2.5 rounded-lg shadow-sm
                   transition duration-200 ease-in-out
                   disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => generate()}
            >
              <Send className="h-4 w-4 mr-2" />
              开始生成...
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}


interface OutlineCardProps {
  items: OutlineItem[]
}

function OutlineCard({ items }: OutlineCardProps) {
  return (
    <Card className="mt-8 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-3 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 cursor-move" />
                  <h3 className="text-lg font-medium">{item.title}</h3>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {item.children && (
                <div className="pl-6 space-y-2">
                  {item.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover/item:opacity-100 cursor-move" />
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">{child.title}</p>
                      </div>
                      <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <Settings className="h-3 w-3" />
                              <span className="text-xs">数据配置</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>数据配置</DialogTitle>
                              <DialogDescription>
                                配置此节点的数据来源和展示方式
                              </DialogDescription>
                            </DialogHeader>

                            <ReportDataConfigDialog item={child} />

                            <DialogFooter>
                              <Button type="submit">保存更改</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


interface ReportDataConfigDialogProps {
  item: OutlineItem

}



function ReportDataConfigDialog({ item }: ReportDataConfigDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="搜索数据源..."
          className="flex-1"
        />
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1" />
          添加数据源
        </Button>
      </div>

      <div className="space-y-2">
        {item.data?.map((data, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50"
          >
            <div>
              <p className="font-medium">{data.name}</p>
              <p className="text-sm text-muted-foreground">{data.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}