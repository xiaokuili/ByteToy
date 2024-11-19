"use client";
import React, { useState, useEffect } from "react";
import { ViewType, viewComponents } from "./views";

export const ViewSwitcher = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.Table);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 根据视图类型生成不同的内容
  const generateContent = (type: ViewType): string => {
    switch (type) {
      case ViewType.Table:
        return "Table";
      case ViewType.Chart:
        return "Chart";
      case ViewType.Card:
        return "Card";
      default:
        return "Default content";
    }
  };

  // 使用 effect 在视图切换时获取内容
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // 模拟 3 秒延迟
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const newContent = generateContent(currentView);
        setContent(newContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentView]);

  // 获取当前要渲染的组件
  const ViewComponent = viewComponents[currentView];

  return (
    <div className='space-y-4'>
      {/* 视图切换按钮组 */}
      <div className='flex gap-2'>
        {Object.values(ViewType).map((type) => (
          <button
            key={type}
            onClick={() => setCurrentView(type)}
            className={`px-4 py-2 rounded ${
              currentView === type
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} View
          </button>
        ))}
      </div>

      {/* 视图内容区域 */}
      <div className='border rounded p-4'>
        {loading ? <div>Loading...</div> : <ViewComponent content={content} />}
      </div>
    </div>
  );
};
