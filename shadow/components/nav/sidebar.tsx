"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // 注意是从 'next/navigation' 导入
import Link from "next/link"; // 添加这个导入

import {
  Home,
  FolderOpen,
  ChevronDown,
  Box,
  Database,
  BarChart2,
  Trash2,
  Plus,
  ChevronsRight,
  AlignJustify,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SidebarComponent() {
  const [openCollections, setOpenCollections] = useState(true);
  const [openBrowse, setOpenBrowse] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleAddDatabase = () => {
    router.push("/metadata/new"); // 跳转到新建页面
  };

  return (
    <aside
      className={cn(
        "bg-gray-50 border-r border-gray-200 flex flex-col h-full sticky left-0 top-16 bottom-0 overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center p-4 border-gray-200",
          isSidebarCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isSidebarCollapsed && (
          <div className='flex items-center'>
            <FolderOpen className='h-6 w-6 text-blue-500' />
            <span className='ml-2 font-semibold'>shadow</span>
          </div>
        )}
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-gray-200 transition-colors'
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <ChevronsRight className='h-5 w-5' />
          ) : (
            <AlignJustify className='h-5 w-5' />
          )}
        </Button>
      </div>
      <div className='flex-grow overflow-y-auto p-4 space-y-4'>
        <Button
          variant='ghost'
          className={cn(
            "w-full justify-start",
            isSidebarCollapsed && "justify-center px-0"
          )}
          asChild
        >
          <Link href='/'>
            <Home className='h-5 w-5' />
            {!isSidebarCollapsed && <span className='ml-2'>首页</span>}
          </Link>
        </Button>

        <Collapsible open={openCollections} onOpenChange={setOpenCollections}>
          <CollapsibleTrigger asChild>
            <Button
              variant='ghost'
              className={cn(
                "w-full justify-between",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <span className='flex items-center'>
                <FolderOpen className='h-5 w-5' />
                {!isSidebarCollapsed && (
                  <span className='ml-2 text-sm font-medium'>报告</span>
                )}
              </span>
              {!isSidebarCollapsed && (
                <ChevronDown className='h-4 w-4 transition-transform duration-200' />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-1'>
            {!isSidebarCollapsed && (
              <>
                <Button
                  variant='ghost'
                  className='w-full justify-start pl-9 text-sm'
                >
                  报告1
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start pl-9 text-sm'
                >
                  报告2
                </Button>
                <Button
                  variant='secondary'
                  className='w-full justify-start pl-9 text-sm'
                >
                  报告3
                </Button>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openBrowse} onOpenChange={setOpenBrowse}>
          <CollapsibleTrigger asChild>
            <Button
              variant='ghost'
              className={cn(
                "w-full justify-between",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <span className='flex items-center'>
                <Box className='h-5 w-5' />
                {!isSidebarCollapsed && (
                  <span className='ml-2 text-sm font-medium'>浏览</span>
                )}
              </span>
              {!isSidebarCollapsed && (
                <ChevronDown className='h-4 w-4 transition-transform duration-200' />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-1'>
            {!isSidebarCollapsed && (
              <>
                <Button
                  variant='ghost'
                  className='w-full justify-start pl-9 text-sm'
                >
                  <Database className='mr-2 h-4 w-4' />
                  虚拟表
                </Button>
                <Link href='/metadata'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start pl-9 text-sm'
                  >
                    <Database className='mr-2 h-4 w-4' />
                    数据库
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  className='w-full justify-start pl-9 text-sm'
                >
                  <BarChart2 className='mr-2 h-4 w-4' />
                  指标
                </Button>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Button
          variant='ghost'
          className={cn(
            "w-full justify-start",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <Trash2 className='h-5 w-5' />
          {!isSidebarCollapsed && <span className='ml-2'>回收站</span>}
        </Button>
      </div>

      <div className='p-4 border-t border-gray-200'>
        {!isSidebarCollapsed && (
          <div className='text-sm text-gray-600 mb-2'>
            开始连接您的数据库或添加csv文件
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='w-full'>
              <Plus className='h-4 w-4' />
              {!isSidebarCollapsed && <span className='ml-2'>添加数据</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuItem asChild>
              <button
                onClick={handleAddDatabase}
                className='w-full text-left cursor-pointer'
              >
                添加数据库
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
