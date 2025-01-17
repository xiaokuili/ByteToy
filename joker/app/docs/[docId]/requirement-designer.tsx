"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useOutlineStore } from "@/hook/useOutlineGenerator"
import { toast } from "sonner"
import { useParams } from 'next/navigation';
import { useTextStore } from "@/hook/useText"
import { useEditorStore } from "@/hook/useEditor"
import { OutlineItem } from "@/server/generateOutline"

const formSchema = z.object({
    title: z.string().min(1, {
        message: "报告名称不能为空",
    }),
})
export default function RequirementDesigner() {
    const docId = useParams().docId as string

    const { editor, saveDoc } = useEditorStore()
    const { generateText } = useTextStore()
    const { title, setTitle, isLoading, generateOutline, outline } = useOutlineStore()




    const insertTitle = () => {
        // 插入标题
        editor?.commands.insertContent([
            {
                type: 'heading',
                attrs: { level: 1 },
                content: [
                    {
                        type: 'text',
                        text: title,
                    },
                ],
            }

        ])
        editor?.commands.enter()

    }
    const insertContent = async (items: OutlineItem[]) => {
        try {
            for (const item of items) {
                const generatedText = await generateText(item)
                editor?.commands.insertContent([
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: generatedText,
                            },
                        ],
                    }
                ])
            }
        } catch (error) {
            toast.error("生成内容失败，请重试")
        }
        finally {
            toast.success("内容生成成功！")
        }
    }

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
            insertTitle()
            await insertContent(outline)
            saveDoc(docId, editor?.getHTML() || '')
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

                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                生成
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}