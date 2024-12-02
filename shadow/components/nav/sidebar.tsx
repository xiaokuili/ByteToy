"use client";

import React, { useState , useEffect} from "react";
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
  FilePlus,
  Calendar,
  Inbox,
    Search,
    Settings,
    FileText,
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
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  
} from "@/components/ui/sidebar"

const favorites = [
  {
    title: "报告1",
    url: "/dashbaord",
    icon: FileText,
  },
]

const resources = [
  {
    title: "报告",
    url: "/dashboard",
    icon: BarChart2,
  },
  {
    title: "指标",
    url: "/queries",
    icon: FileText,
  },
  {
    title: "数据库",
    url: "/database",
    icon: Database,
  },
]
export function SidebarComponent() {
  

  const handleAddDatabase = () => {
    // Handle database addition
  }

  return (
    <Sidebar>
      <SidebarContent>
      <Collapsible defaultOpen className="group/collapsible">
        

        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              收藏
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {favorites.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                资源
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                {resources.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
       
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <Plus className="h-4 w-4" />
              <span className="ml-2">添加数据</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={handleAddDatabase}>
                添加数据库
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      
      </SidebarFooter>
    </Sidebar>
  )
}
