import { dataSources } from "@/app/api/query-builder/schema";
import { sourceIcons } from "@/app/query-builder/utils/icons";

interface DataSourceFilterProps {
    selectedSources: string[];
    onChange: (sources: string[]) => void;
    className?: string;
}

export function DataSourceFilter({ selectedSources, onChange, className = "" }: DataSourceFilterProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {dataSources.map(source => (
                <button
                    key={source}
                    onClick={() => {
                        const isSelected = selectedSources.includes(source);
                        onChange(
                            isSelected
                                ? selectedSources.filter(s => s !== source)
                                : [...selectedSources, source]
                        );
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                        ${selectedSources.includes(source)
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-100'}`}
                >
                    {sourceIcons[source]}
                    <span>{source}</span>
                </button>
            ))}
        </div>
    );
} 