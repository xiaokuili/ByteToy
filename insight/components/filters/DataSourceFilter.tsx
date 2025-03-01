import { dataSources, sourceIcons, DataSource } from "@/config/filters";

interface DataSourceFilterProps {
    selectedSource: DataSource | null;
    onChange: (source: DataSource | null) => void;
    className?: string;
}

export function DataSourceFilter({ selectedSource, onChange, className = "" }: DataSourceFilterProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {dataSources.map(source => (
                <button
                    key={source}
                    onClick={() => {
                        const isSelected = selectedSource === source;
                        onChange(
                            isSelected
                                ? null
                                : source
                        );
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                        ${selectedSource === source
                            ? 'bg-[rgb(var(--primary-light))] text-[rgb(var(--primary))] border border-[rgb(var(--primary-border))]'
                            : 'bg-white border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] hover:border-[rgb(var(--primary-border))]'}`}
                >
                    {sourceIcons[source]}
                    <span>{source}</span>
                </button>
            ))}
        </div>
    );
} 