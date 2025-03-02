import { useState } from "react";
import { Search, MessageSquare, Send } from "lucide-react";

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [answer, setAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setAnswer(
                "这是一个示例回答。在实际应用中，这里将显示基于搜索词的真实回答内容。这个回答可能包含多个段落，以及各种格式的文本内容。根据需要，这里可以包含丰富的信息，帮助用户理解他们的查询结果。"
            );
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen relative bg-slate-50">
            {/* Main content area with search term and answer */}
            <div className="flex-1 overflow-auto pb-24">
                {/* Search term display */}
                {searchTerm && (
                    <div className="bg-white p-4 border-b border-slate-200">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Search className="w-4 h-4" />
                                <span>搜索词</span>
                            </div>
                            <p className="mt-1 text-lg font-medium text-slate-800">{searchTerm}</p>
                        </div>
                    </div>
                )}

                {/* Answer section */}
                {answer && (
                    <div className="p-4">
                        <div className="max-w-3xl mx-auto">
                            {/* Answer header */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-[rgb(var(--primary-light))] p-2 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-[rgb(var(--primary))]" />
                                </div>
                                <h2 className="font-medium text-slate-800">回答</h2>
                            </div>

                            {/* Answer content */}
                            <div className="bg-white border border-[rgb(var(--slate-200))] rounded-lg p-4 shadow-sm">
                                <div className="prose prose-slate max-w-none">
                                    {answer.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-3 last:mb-0 text-slate-700">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!searchTerm && !answer && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <div className="bg-[rgb(var(--primary-light))] p-4 rounded-full mb-4">
                            <Search className="w-8 h-8 text-[rgb(var(--primary))]" />
                        </div>
                        <h2 className="text-xl font-medium text-slate-800 mb-2">开始您的搜索</h2>
                        <p className="text-slate-500 max-w-md">
                            在下方输入框中输入您的问题或关键词，获取相关信息和答案。
                        </p>
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div className="p-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-[rgb(var(--primary-light))] p-2 rounded-lg animate-pulse">
                                    <MessageSquare className="w-5 h-5 text-[rgb(var(--primary))]" />
                                </div>
                                <h2 className="font-medium text-slate-800">正在思考...</h2>
                            </div>
                            <div className="bg-white border border-[rgb(var(--slate-200))] rounded-lg p-4 shadow-sm">
                                <div className="h-4 bg-slate-100 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-slate-100 rounded animate-pulse mb-2 w-3/4"></div>
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating input at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
                <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="输入您的问题或关键词..."
                            className="w-full pl-4 pr-12 py-3 rounded-lg border border-[rgb(var(--slate-200))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-light))] focus:border-[rgb(var(--primary-border))]"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !searchTerm.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-[rgb(var(--primary))] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 