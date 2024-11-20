import { useState, useEffect } from "react";
import { QueryResult } from "@/components/query/display/types";
import { getFinalSql } from "@/utils/variable-utils";
import { executeQuery as executeQueryAction } from "@/lib/datasource-action";
import { useCallback } from "react";
import { useQueryAndViewState } from "@/hook/use-visualization";
export function useQueryState() {
  const [queryResult, setQueryResult] = useState<QueryResult>({});
  const [queryError, setQueryError] = useState<string>("");
  const executeQuery = useCallback(async (params: SqlParams) => {
    let mounted = true;
    setQueryError("");
    setQueryResult({});
    try {
      const finalSql = getFinalSql(params.sqlContent, params.sqlVariables);
      const result = await executeQueryAction(params.databaseId, finalSql);
      if (mounted) {
        if (result.success) {
          setQueryResult(result.data);
          setQueryError("");
        } else {
          setQueryError(result.error || "Unknown error");
          setQueryResult({});
        }
      }
    } catch (error) {
      if (mounted) {
        setQueryError(error);
      }
    }
    return () => {
      mounted = false;
    };
  }, []);
  // Add reset function
  const reset = useCallback(() => {
    setQueryResult({});
    setQueryError("");
  }, []);
  return {
    queryResult,
    queryError,
    executeQuery,
    reset,
  };
}
export function useQueryExecution({
  sqlContent,
  sqlVariables,
  databaseId,
}: {
  sqlContent: string;
  sqlVariables: Variable[];
  databaseId: string;
}) {
  const { queryResult, queryError, executeQuery, reset } = useQueryState();
  const { isExecuting } = useQueryAndViewState();
  const [lifecycle, setLifecycle] = useState<
    "init" | "executing" | "completed"
  >("init");

  useEffect(() => {
    let mounted = true;
    const execute = async () => {
      console.log("isExecuting queryResult", queryResult);
      if (isExecuting) {
        if (mounted) {
          setLifecycle("executing");
        }

        await executeQuery({
          sqlContent,
          sqlVariables,
          databaseId,
        });

        if (mounted) {
          setLifecycle("completed");
        }
      }
    };

    execute();

    return () => {
      mounted = false;
    };
  }, [isExecuting, sqlContent, sqlVariables, databaseId, executeQuery]);

  return {
    queryResult,
    queryError,
    hasExecuted: isExecuting,
    lifecycle,
    reset,
  };
}
