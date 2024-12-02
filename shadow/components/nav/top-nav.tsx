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

export function TopNavComponent() {
  const { setId } = useQueryAndViewState();
  return (
    <nav className="flex h-16 items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex-grow max-w-xl px-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input type="search" placeholder="Search" className="pl-8 w-full" />
        </div>
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

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
