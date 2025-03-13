"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/home/SearchInput"
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { useDatasource } from "@/hook/useDatasource";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const {saveDatasource}= useDatasource()
  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const flowId = crypto.randomUUID();
    const params = new URLSearchParams({
      q: searchQuery,
      source: selectedSource || "",
      flowId: flowId
    });

    router.push(`/search?${params.toString()}`);
  };

  const handleFileUpload = async (file: File) => {
    const result = await saveDatasource(file);
    setSelectedSource(result.dataSource?.name || "");
    console.log(result.dataSource?.name);
    return result;
  };




  return (
    <>
      <Head>
        <title>Inseen - 与数据对话，轻松可视化</title>
        <meta name="description" content="Inseen 是一个现代化的智能搜索与知识管理平台，帮助您更高效地获取和组织信息。" />
        <meta name="keywords" content="智能搜索,知识管理,AI,人工智能,Inseen" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header variant="minimal" />

        <main className="flex-1 flex items-center justify-center relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
          {/* 背景装饰元素 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-[20%] left-[20%] w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
            {/* Logo 和标题 */}
            <div className="text-center mb-12">
              <div className="mb-6 relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">IC</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Inseen Chat
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                与数据对话，轻松可视化
              </p>
            </div>

            {/* 搜索区域 */}
            <div className="w-full max-w-4xl mx-auto">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onFileUpload={handleFileUpload}
                onSearch={handleSearch}
             
              />

             

           
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
