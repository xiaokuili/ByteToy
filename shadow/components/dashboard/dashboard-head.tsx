"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, ShareIcon } from "lucide-react";
import { useState } from "react";
import { Variable } from "@/types/base";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
    title?: string;
    onTitleChange?: (title: string) => void;
    onSave?: () => void;
    onShare?: () => void;
}

export function DashboardHeader({
    title = "未命名仪表盘",
    onTitleChange,
    onSave,
    onShare
}: DashboardHeaderProps) {
    const [variables, setVariables] = useState<Variable[]>([]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <Input
                        value={title}
                        onChange={(e) => onTitleChange?.(e.target.value)}
                        className="text-lg font-semibold w-[300px]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onSave}
                    >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        保存
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onShare}
                    >
                        <ShareIcon className="w-4 h-4 mr-2" />
                        分享
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {

                            // Add a new variable when clicking the button
                            const newVariable = {
                                id: crypto.randomUUID(),
                                name: `variable${variables.length + 1}`,
                                value: "",
                                type: "string" as const
                            };
                            setVariables([...variables, newVariable]);

                        }}
                    >
                        <span className="mr-2">+</span>
                        变量
                    </Button>
                </div>
            </div>

            <div className="p-4 border-b">
                <div className="grid grid-cols-3 gap-4">
                    {variables.map((variable) => (
                        <div key={variable.id} className="flex items-center gap-3 bg-background rounded-lg p-3 border shadow-sm">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Input
                                        value={variable.name}
                                        className="w-[120px] h-6 text-sm font-medium"
                                        onChange={(e) => {
                                            const updatedVariables = variables.map(v =>
                                                v.id === variable.id ? { ...v, name: e.target.value } : v
                                            );
                                            setVariables(updatedVariables);
                                        }}
                                    />
                                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted">
                                        {variable.type}
                                    </Badge>
                                </div>
                                <Input
                                    value={variable.value}
                                    placeholder={`Enter ${variable.name}`}
                                    className="h-8 text-sm bg-muted/30 focus:bg-background transition-colors"
                                    onChange={(e) => {
                                        const updatedVariables = variables.map(v =>
                                            v.id === variable.id ? { ...v, value: e.target.value } : v
                                        );
                                        setVariables(updatedVariables);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
