import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton-card";

interface SearchResultsProps {
    isLoading: boolean;
}

export function SearchResults({ isLoading }: SearchResultsProps) {
    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="animate-in fade-in duration-1000">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse-subtle mb-6">
                            <SkeletonCard />

                        </div>
                    ))}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {Array(6).fill(0).map((_, i) => (
                        <Card
                            key={i}
                            className="group hover:bg-gradient-to-r hover:from-white hover:to-slate-50/50 p-6 
                                     transition-all duration-500 hover:-translate-y-1 hover:shadow-lg 
                                     hover:border-indigo-100 cursor-pointer mb-6"
                            style={{
                                animationDelay: `${i * 100}ms`
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-800 group-hover:text-indigo-600 
                                                 mb-1 line-clamp-1">
                                        搜索结果 {i + 1}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200">
                                            学术论文
                                        </Badge>
                                        <span>•</span>
                                        <span>2024-03-15</span>
                                        <span>•</span>
                                        <span className="text-indigo-600">相关度: 95%</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-slate-600 leading-relaxed line-clamp-2">
                                这是一个示例搜索结果的预览内容，展示了相关的摘要信息。这里可以显示更多的内容描述，
                                包括来源、时间、相关度等信息。通过合理的布局和动画效果，提升用户体验。
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                                <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                                    AI
                                </Badge>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                    医疗
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 