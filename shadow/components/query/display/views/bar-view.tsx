import React from 'react';
import { QueryResult } from '../view-factory';

export function BarView({ rows, columns }: QueryResult) {
  return <div>this is bar</div>;
}

export class BarViewResult {
  Component = BarView;
} 