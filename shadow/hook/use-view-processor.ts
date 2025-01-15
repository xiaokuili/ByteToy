import { useState, useEffect } from "react";
import { QueryResult } from "@/components/query/display/types";
import { views } from "@/components/query/display/view-base";

export function useViewProcessor(
  viewId: string,
  queryResult: QueryResult,
  llmConfig?: unknown
) {
  const [lifecycle, setLifecycle] = useState<
    "init" | "executing" | "completed"
  >("init");
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;

    // Update lifecycle state immediately
    setLifecycle("executing");
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
          ? await view.processor.processData(queryResult, llmConfig)
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
          setLifecycle("completed");
        }
      }
    };

    processData();

    return () => {
      mounted = false;
      setProcessedData(null);
      setError(null);
    };
  }, [viewId, queryResult, llmConfig]);

  return { processedData, error, lifecycle };
}
