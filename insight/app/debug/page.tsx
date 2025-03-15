'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ChartFactory from '@/components/search/charts/ChartFactory';

import { RunGenerateSQLQuery } from '@/actions/dataflow/index';
import { ChartConfig, DataRecord } from "@/lib/types";

// TODO：
// 1. 复制renderconfig很麻烦， 需要一个格式化
// 2. 复制sql 需要自动去除 \n 和 \t
export default function DebugChartPage() {
  const [config, setConfig] = useState<string>('');
  const [sql, setSql] = useState<string>('');
  const [data, setData] = useState<DataRecord[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleExecute = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Parse config

      const parsedConfig: ChartConfig = {options: JSON.parse(config)};
      setChartConfig(parsedConfig);
      
      // Execute SQL and get data
      const result = await RunGenerateSQLQuery(sql);
      
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">Chart Debug Tool</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Chart Configuration</h2>
            <Textarea
              placeholder="Enter chart configuration as JSON..."
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              rows={8}
              className="mb-4 font-mono text-sm"
            />
          </Card>
          
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">SQL Query</h2>
            <Textarea
              placeholder="Enter SQL query..."
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              rows={8}
              className="mb-4 font-mono text-sm"
            />
            
            <Button 
              onClick={handleExecute} 
              disabled={loading}
              size="lg"
              className="w-full mt-2"
              variant="default"
            >
              {loading ? 'Executing...' : 'Execute and Render Chart'}
            </Button>
          </Card>
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
              <p className="font-medium">Error:</p>
              <p className="mt-1">{error}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Chart Preview</h2>
            {data.length > 0 && chartConfig ? (
              <div className="min-h-[400px]">
                <ChartFactory config={chartConfig} chartData={data} />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-muted-foreground bg-muted/30 rounded-md">
                {loading ? 'Loading...' : 'Enter configuration and SQL, then click execute'}
              </div>
            )}
          </Card>
          
          {data.length > 0 && (
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Result Data</h2>
              <div className="overflow-auto max-h-[300px] bg-muted/30 p-4 rounded-md">
                <pre className="text-sm font-mono">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
