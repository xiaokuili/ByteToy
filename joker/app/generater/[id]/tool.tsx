"use client";

import {  Download, FileText, LucideIcon } from "lucide-react";

export default function ReportTool() {
  const tools = [
    { Icon: FileText, label: "预览", onClick: () => {}, disabled: false },
    { Icon: Download, label: "导出", onClick: () => {}, disabled: false },
  ]

  return (
    <div className="flex items-center gap-2 px-4 h-full">
      {tools.map((tool, index) => (
        <ToolButton
          key={index}
          Icon={tool.Icon}
          label={tool.label}
          onClick={tool.onClick}
          disabled={tool.disabled}
        />
      ))}
    </div>
  );
}

interface ToolButtonProps {
  Icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

function ToolButton({ Icon, label, onClick, disabled = false }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}
