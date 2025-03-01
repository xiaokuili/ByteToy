import { aiModels, AIModel } from "@/config/filters";
import { Sparkles } from "lucide-react";

interface ModelSelectorProps {
    selectedModel: AIModel;
    onChange: (model: AIModel) => void;
    className?: string;
}

export function ModelSelector({ selectedModel, onChange, className = "" }: ModelSelectorProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {aiModels.map(model => (
                <button
                    key={model}
                    onClick={() => onChange(model)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                        ${selectedModel === model
                            ? 'bg-gradient-to-r from-[rgb(var(--gradient-start))] to-[rgb(var(--gradient-end))] text-white'
                            : 'bg-white border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] hover:border-[rgb(var(--primary-border))]'}`}
                >
                    <Sparkles className="w-4 h-4" />
                    <span>{model}</span>
                </button>
            ))}
        </div>
    );
} 