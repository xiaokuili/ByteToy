import { useState, useEffect } from "react";
import { QueryResult } from "../types";
import { views } from "../components/query/display/view-base";

interface ProcessorState {
  processedData: unknown;
  error: string | null;
  loading: boolean;
}
export function useViewProcessor(
  viewId: string,
  queryResult: QueryResult,
  config?: unknown
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;

    // 立即更新 loading 状态
    setLoading(true);
    setProcessedData(null);
    setError(null);

    const processData = async () => {
      try {
        const view = views.get(viewId);

        if (!view) {
          if (mounted) {
            setError(`View ${viewId} not found`);
            setProcessedData(null);
          }
          return;
        }
        const processedResult = view.processor.processData
          ? await view.processor.processData(queryResult, config)
          : { isValid: true, data: queryResult };

        if (!mounted) return;

        if (!processedResult?.isValid || !processedResult?.data) {
          setError(processedResult?.error || "Invalid data");
          setProcessedData(null);
          return;
        }

        const validation = view.processor.validateData
          ? view.processor.validateData(processedResult.data)
          : { isValid: true };

        if (!mounted) return;

        if (!validation?.isValid) {
          setError(validation?.error || "Data validation failed");
          setProcessedData(null);
          return;
        }

        setError(null);
        setProcessedData(processedResult.data);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setProcessedData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    processData();

    return () => {
      mounted = false;
      setProcessedData(null);
      setError(null);
    };
  }, [viewId, queryResult, config]);

  return { processedData, error, loading };
}
