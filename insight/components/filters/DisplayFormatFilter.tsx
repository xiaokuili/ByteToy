import { displayFormats } from "@/app/api/query-builder/schema";
import { formatIcons } from "@/app/query-builder/utils/icons";

interface DisplayFormatFilterProps {
    selectedFormat: string;
    onChange: (format: string) => void;
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
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-100'}`}
                >
                    {formatIcons[format]}
                    <span className="text-sm">{format}</span>
                </button>
            ))}
        </div>
    );
} 