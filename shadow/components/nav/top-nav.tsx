"use client";

import React from "react";
import {
  Search,
  Plus,
  Settings,
  BarChart2,
  FileText,
  Table,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useQueryAndViewState } from "@/hook/use-visualization";
import { SidebarTrigger, useSidebar} from "@/components/ui/sidebar";

export function TopNavComponent() {
  const { setId } = useQueryAndViewState();
  const { setOpen, open } = useSidebar();
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex-grow max-w-xl px-4">
      <SidebarTrigger onClick={() => setOpen(!open)} />
       
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4" />
              创建
            </Button>
          </DropdownMenuTrigger>

                
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => {
                const id = crypto.randomUUID();
                window.location.href = `/dashboard/${id}`;
              }}
            >
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>报告</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const id = crypto.randomUUID();
                setId(id);
                window.location.href = `/queries/${id}`;
              }}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>指标</span>
              </div>
            </DropdownMenuItem>

            <Link href="/query/virtual-tables" passHref>
              <DropdownMenuItem asChild>
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  <span>虚拟表</span>
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

       
      </div>
    </nav>
  );
}
