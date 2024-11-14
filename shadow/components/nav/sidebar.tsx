"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  ChevronLeft,
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

function NavLink({
  href,
  icon,
  label,
  collapsed,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100",
        "transition-colors duration-200",
        className
      )}
    >
      <span>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export function SidebarComponent() {
  const [openCollections, setOpenCollections] = useState(true);
  const [openBrowse, setOpenBrowse] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const handleAddDatabase = () => {
    router.push("/metadata/new");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-gray-50 border-r border-gray-200",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Header Section */}
      <div className='h-16 flex items-center justify-between px-4 border-b'>
        {!isCollapsed && (
          <div className='flex items-center'>
            <FolderOpen className='h-6 w-6 text-blue-500' />
            <span className='ml-2 font-semibold'>shadow</span>
          </div>
        )}
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-gray-200 transition-colors'
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRight className='h-5 w-5' />
          ) : (
            <ChevronLeft className='h-5 w-5' />
          )}
        </Button>
      </div>

      {/* Navigation Links */}
      <div className='flex flex-col flex-1 p-4 space-y-4'>
        <NavLink
          href='/'
          icon={<Home className='h-5 w-5' />}
          label='首页'
          collapsed={isCollapsed}
        />

        <Collapsible open={openCollections} onOpenChange={setOpenCollections}>
          <CollapsibleTrigger asChild>
            <Button
              variant='ghost'
              className={cn(
                "w-full justify-between",
                isCollapsed && "justify-center px-0"
              )}
            >
              <span className='flex items-center'>
                <FolderOpen className='h-5 w-5' />
                {!isCollapsed && (
                  <span className='ml-2 text-sm font-medium'>报告</span>
                )}
              </span>
              {!isCollapsed && (
                <ChevronDown className='h-4 w-4 transition-transform duration-200' />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-1'>
            {!isCollapsed && (
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
                isCollapsed && "justify-center px-0"
              )}
            >
              <span className='flex items-center'>
                <Box className='h-5 w-5' />
                {!isCollapsed && (
                  <span className='ml-2 text-sm font-medium'>浏览</span>
                )}
              </span>
              {!isCollapsed && (
                <ChevronDown className='h-4 w-4 transition-transform duration-200' />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-1'>
            {!isCollapsed && (
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
                <Link href='/queries'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start pl-9 text-sm'
                  >
                    <BarChart2 className='mr-2 h-4 w-4' />
                    指标
                  </Button>
                </Link>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Button
          variant='ghost'
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Trash2 className='h-5 w-5' />
          {!isCollapsed && <span className='ml-2'>回收站</span>}
        </Button>
      </div>

      {/* Bottom section */}
      <div className='p-4 border-t'>
        {!isCollapsed && (
          <div className='text-sm text-gray-600 mb-2'>
            开始连接您的数据库或添加csv文件
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='w-full'>
              <Plus className='h-4 w-4' />
              {!isCollapsed && <span className='ml-2'>添加数据</span>}
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
