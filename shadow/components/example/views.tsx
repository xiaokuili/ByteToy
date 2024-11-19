import React from "react";

// 定义不同类型视图的组件
export const TableView = ({ content }: { content: string }) => {
  return <div className='p-4 border rounded'>{content}</div>;
};

export const ChartView = ({ content }: { content: string }) => {
  return <div className='p-4 border rounded'>{content}</div>;
};

export const CardView = ({ content }: { content: string }) => {
  return <div className='p-4 border rounded'>{content}</div>;
};

// 视图类型枚举
export enum ViewType {
  Table = "table",
  Chart = "chart",
  Card = "card",
}

// 视图映射配置
export const viewComponents = {
  [ViewType.Table]: TableView,
  [ViewType.Chart]: ChartView,
  [ViewType.Card]: CardView,
};
