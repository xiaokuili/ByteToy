"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, ShareIcon, X } from "lucide-react";
import { useState } from "react";
import { Variable } from "@/types/base";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface VariableCardProps {
    variable: Variable;
    variables: Variable[];
    onVariablesChange: (variables: Variable[]) => void;
}

function VariableCard({ variable, variables, onVariablesChange }: VariableCardProps) {
    const handleDelete = () => {
        const updatedVariables = variables.filter(v => v.id !== variable.id);
        onVariablesChange(updatedVariables);
    };

    const handleUpdate = (updates: Partial<Variable>) => {
        const updatedVariables = variables.map(v => 
            v.id === variable.id ? { ...v, ...updates } : v
        );
        onVariablesChange(updatedVariables);
    };

    return (
        <div className="flex items-center gap-3 bg-background rounded-lg p-3 border shadow-sm">
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <Input
                        value={variable.name}
                        className="w-[120px] h-6 text-sm font-medium"
                        onChange={(e) => handleUpdate({ name: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted">
                            {variable.type}
                        </Badge>
                        <Button
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                            onClick={handleDelete}
                        >
                            <X className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>
                <Input
                    value={variable.value}
                    placeholder={`Enter ${variable.name}`}
                    className="h-8 text-sm bg-muted/30 focus:bg-background transition-colors"
                    onChange={(e) => handleUpdate({ value: e.target.value })}
                />
            </div>
        </div>
    );
}

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

    const handleVariableChange = (updatedVariable: Variable) => {
        const updatedVariables = variables.map(v =>
            v.id === updatedVariable.id ? updatedVariable : v
        );
        setVariables(updatedVariables);
    };

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

            {variables.length > 0 && (
                <div className="p-4 border-b">
                    <div className="grid grid-cols-3 gap-4">
                        {variables.map((variable) => (
                            <VariableCard
                                key={variable.id}
                                variable={variable}
                                variables={variables}
                                onVariablesChange={setVariables}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
