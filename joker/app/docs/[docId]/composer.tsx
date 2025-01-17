"use client"

import React from "react"
import RequirementDesigner from "./requirement-designer"
import OutlineDesigner from "./outline-designer"
import DataCollector from "./data-collector"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"
import { ClipboardList, Database, ListTree } from "lucide-react"

interface Step {
  id: string
  title: string
  component: React.ReactNode
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    id: "requirements",
    title: "需求配置",
    component: <RequirementDesigner />,
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "outline",
    title: "大纲配置",
    component: <OutlineDesigner />,
    icon: <ListTree className="w-4 h-4" />,
  },
  {
    id: "data",
    title: "数据配置",
    component: <DataCollector />,
    icon: <Database className="w-4 h-4" />,
  },
]

export default function Composer() {
  const [currentStep, setCurrentStep] = React.useState("requirements")

  return (
    <div className="flex flex-col h-full">
      {/* 步骤导航 */}
      <nav className="px-6 py-4 border-b">
        <div className="flex items-center justify-between gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex items-center justify-center gap-3 px-4 py-2 rounded-lg transition-colors w-full",
                  currentStep === step.id
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* 步骤图标 */}
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-sm",
                  currentStep === step.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.icon}
                </span>
                {/* 步骤标题 */}
                <span className="font-medium text-sm 2xl:text-base">{step.title}</span>
              </button>
              {/* 添加连接线，最后一个步骤不需要 */}
              {index < steps.length - 1 && (
                <div className="h-[2px] flex-1 mx-2 bg-muted" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* 内容区域 */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {steps.find(step => step.id === currentStep)?.component}
        </div>
      </ScrollArea>
    </div>
  )
}