export function SkeletonCard() {
    return (
        <div className="rounded-lg border bg-white p-6 transition-all duration-1000 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="space-y-2">
                    <div className="h-5 w-48 bg-slate-200 rounded" />
                    <div className="flex gap-2">
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                    </div>
                </div>
                <div className="h-8 w-8 bg-slate-200 rounded" />
            </div>
            <div className="space-y-2 mt-4">
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-4/5 bg-slate-200 rounded" />
            </div>
            <div className="flex gap-2 mt-4">
                <div className="h-6 w-12 bg-slate-200 rounded" />
                <div className="h-6 w-16 bg-slate-200 rounded" />
            </div>
        </div>
    );
} 