"use client"
import React from 'react';
import { QueryResult } from './types';
import { viewFactory } from './view-factory';

export const Visualization: React.FC<{ 
  viewId: string;
  queryResult: QueryResult;
}> = ({ viewId, queryResult }) => {

  // 创建并返回选中的视图
  return viewFactory.createView(viewId, queryResult);
}; 