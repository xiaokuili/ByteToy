"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useOutlineStore } from "@/hook/useOutlineGenerator"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

const formSchema = z.object({
    title: z.string().min(1, {
        message: "报告名称不能为空",
    }),
})
export default function RequirementDesigner() {
    const [open, setOpen] = useState(false)

    const { title, setTitle, isLoading, generateOutline, error } = useOutlineStore()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const success = await generateOutline(values.title)
        if (success) {
            toast.success("大纲生成成功！")
            setOpen(false)
        } else {
            toast.error("生成大纲失败，请重试")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">报告需求配置</h3>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>配置报告的基本信息</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} >
                        <form id="outline-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>报告名称</FormLabel>
                                        <FormControl>
                                            <Input placeholder="请输入报告名称" {...field} onChange={(e) => {
                                                field.onChange(e)
                                                setTitle(e.target.value)
                                            }} />
                                        </FormControl>
                                        <FormDescription>
                                            这将作为您的报告标题显示
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                           
                           <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button">
                                        保存
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>确认保存</DialogTitle>
                                        <DialogDescription>
                                            您确定要保存这些更改吗？
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    {error && (
                                        <div className="text-red-500 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <DialogFooter className="sm:justify-end">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setOpen(false)}
                                            disabled={isLoading}
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            type="submit"
                                            form="outline-form"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    大纲生成中...
                                                </>
                                            ) : (
                                                "确认"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}