import { Globe, HardDrive } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface SourceToggleProps {
    isOnline: boolean
    onToggle: (value: boolean) => void
    className?: string
}

export function SourceToggle({ isOnline, onToggle, className = "" }: SourceToggleProps) {
    return (
        <div className={`flex items-center gap-6 ${className}`}>
            <div className="flex items-center gap-6 rounded-full bg-slate-100/80 backdrop-blur-sm px-6 py-2">
                <div className={`flex items-center gap-2 transition-colors ${!isOnline ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                    <HardDrive className="w-4 h-4" />
                    本地
                </div>
                <Switch
                    checked={isOnline}
                    onCheckedChange={onToggle}
                    className="data-[state=checked]:bg-indigo-600"
                />
                <div className={`flex items-center gap-2 transition-colors ${isOnline ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                    <Globe className="w-4 h-4" />
                    网络
                </div>
            </div>
        </div>
    )
} 