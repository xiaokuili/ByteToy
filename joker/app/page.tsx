"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send,  Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInput } from "@/hook/useInput";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { parseTemplate } from "@/actions";
import { nanoid } from 'nanoid'
import { useEffect } from "react";
import { useState } from "react";


export default function Home() {

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">智能报告生成器</h1>
        <p className="text-muted-foreground">输入报告主题，AI将为您生成专业的商业报告</p>
      </div>

      <InputCard  />

    </div>
  );
}


function InputCard() {
  const { title, setTitle, setHistory: setTemplate, setReportId } = useInput()
  const router = useRouter();
  const [id, setId] = useState<string>('')

  useEffect(() => {
    setId(nanoid(16))
  }, [])

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

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="px-6 py-2.5 rounded-lg border border-input
                       hover:bg-accent
                       transition duration-200 ease-in-out"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  上传模板
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>上传模板</DialogTitle>
                  <DialogDescription>
                    上传您的报告模板，AI将根据模板生成大纲
                  </DialogDescription>
                </DialogHeader>
                <form action={async (formData: FormData) => {
                  const result = await parseTemplate(formData);
                  if (result.success) {
                    setTemplate(result.data);
                  }
                }}>
                    <Input
                      id="template" 
                      type="file"
                      name="file"
                      accept=".txt,.doc,.docx"
                      className="cursor-pointer w-full h-12 file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90"
                    />
                  <DialogFooter className="mt-4 flex justify-end gap-4">
                    <Button type="submit" className="w-32">确认上传</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
              onClick={() => {
                router.push(`/generater/${id}`);
                setReportId(id)
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              开始生成
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}

