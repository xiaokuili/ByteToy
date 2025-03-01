import { displayFormats, formatIcons, DisplayFormat } from "@/config/filters";

interface DisplayFormatFilterProps {
    selectedFormat: DisplayFormat;
    onChange: (format: DisplayFormat) => void;
    className?: string;
}

export function DisplayFormatFilter({ selectedFormat, onChange, className = "" }: DisplayFormatFilterProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {displayFormats.map(format => (
                <button
                    key={format}
                    onClick={() => onChange(format)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
                        ${selectedFormat === format
                            ? 'bg-gradient-to-r from-[rgb(var(--gradient-start))] to-[rgb(var(--gradient-end))] text-white'
                            : 'bg-white border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] hover:border-[rgb(var(--primary-border))]'}`}
                >
                    {formatIcons[format]}
                    <span className="text-sm">{format}</span>
                </button>
            ))}
        </div>
    );
} 