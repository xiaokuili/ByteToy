import { DisplayFormat, displayFormats, formatIcons } from "@/config/filters";

interface DisplayFormatFilterProps {
    selectedFormat: DisplayFormat;
    onChange: (format: DisplayFormat) => void;
    className?: string;
}

export function DisplayFormatFilter({ selectedFormat, onChange, className = "" }: DisplayFormatFilterProps) {
    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayFormats.map(format => (
                    <button
                        key={format}
                        onClick={() => onChange(format)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all
                            ${selectedFormat === format
                                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50'}`}
                    >
                        <div className={`${selectedFormat === format ? 'text-white' : 'text-indigo-500'}`}>
                            {formatIcons[format]}
                        </div>
                        <span className="text-sm font-medium">{format}</span>
                    </button>
                ))}
            </div>
        </div>
    );
} 