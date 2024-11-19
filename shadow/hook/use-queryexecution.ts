import { useState, useEffect } from "react";
import { QueryResult } from "@/components/query/display/types";
import { getFinalSql } from "@/utils/variable-utils";
import { executeQuery } from "@/lib/datasource-action";
import { DashboardSection } from "@/types/base";
import { useMemo } from "react";
export function useQueryExecution(section: DashboardSection) {
  const [queryResult, setQueryResult] = useState<QueryResult>({});
  const [queryError, setQueryError] = useState<string>("");

  // 使用 useMemo 缓存 SQL 相关的参数
  const sqlParams = useMemo(() => {
    return {
      sqlContent: section.visualization?.sqlContent,
      sqlVariables: section.visualization?.sqlVariables,
      datasourceId: section.visualization?.datasourceId,
    };
  }, [
    section.visualization?.sqlContent,
    section.visualization?.sqlVariables,
    section.visualization?.datasourceId,
  ]);

  useEffect(() => {
    let isMounted = true;

    async function executeQueries() {
      if (!section.visualization?.id) {
        setQueryError("请选择合适的数据和内容生成进行展示");
        return;
      }

      try {
        const finalSql = getFinalSql(
          sqlParams.sqlContent,
          sqlParams.sqlVariables
        );
        const result = await executeQuery(sqlParams.datasourceId, finalSql);

        if (!isMounted) return;

        if (result.success) {
          setQueryResult(result.data);
          setQueryError("");
        } else {
          setQueryError(result.error || "Unknown error");
          setQueryResult({});
        }
      } catch (error) {
        if (!isMounted) return;
        console.error(`Error executing query for block ${section.id}:`, error);
        setQueryError("Failed to execute query");
      }
    }

    executeQueries();
    return () => {
      isMounted = false;
    };
  }, [sqlParams]); // 只依赖 sqlParams

  // 缓存返回值
  return useMemo(
    () => ({ queryResult, queryError }),
    [queryResult, queryError]
  );
}
