"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "sonner";
import { createMetadata, checkConnection } from "@/lib/datasource-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  type: z.string(),
  displayName: z.string().min(1, { message: "Display name is required" }),
  host: z.string().min(1, { message: "Host is required" }),
  port: z.number().int().positive(),
  databaseName: z.string().min(1, { message: "Database name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  schemas: z.union([z.literal("All"), z.array(z.string())]),
  useSSL: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function DatabaseConnectionFormComponent() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "PostgreSQL",
      port: 5432,
      schemas: "All",
      useSSL: true,
    },
  });

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        // 第一步：检查数据库连接
        const connectionResult = await checkConnection(values);

        if (!connectionResult.success) {
          toast.error(connectionResult.error || "数据库连接失败");
          return;
        }

        // 显示连接成功
        toast.success("数据库连接成功");

        // 第二步：创建元数据
        const metadataResult = await createMetadata({
          ...values,
          schemas: connectionResult.schemas, // 使用连接检查获取的 schemas
        });

        if (!metadataResult.success) {
          toast.error(metadataResult.error || "元数据创建失败");
          return;
        }

        // 全部成功，显示成功消息并跳转
        toast.success("数据源创建成功");
        router.push("/metadata");
        router.refresh();
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error(
          error instanceof Error
            ? `操作失败: ${error.message}`
            : "操作失败，请重试"
        );
      }
    });
  }
  return (
    <div className='max-w-2xl mx-auto py-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>数据库类型</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select database type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='PostgreSQL'>PostgreSQL</SelectItem>
                    <SelectItem value='MySQL'>MySQL</SelectItem>
                    <SelectItem value='Oracle'>Oracle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>展示名称</FormLabel>
                <FormControl>
                  <Input placeholder='Our PostgreSQL' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='host'
            render={({ field }) => (
              <FormItem>
                <FormLabel>主机</FormLabel>
                <FormControl>
                  <Input placeholder='name.database.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='port'
            render={({ field }) => (
              <FormItem>
                <FormLabel>端口</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='databaseName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>数据库名称</FormLabel>
                <FormControl>
                  <Input placeholder='birds_of_the_world' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input placeholder='username' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='••••••••' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isPending}>
            {isPending ? "保存中..." : "保存"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
