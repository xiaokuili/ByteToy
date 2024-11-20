"use client";
import Query from "@/components/query/index";
import { useQueryAndViewState } from "@/hook/use-visualization";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { setId, loadVisualization } = useQueryAndViewState();

  useEffect(() => {
    async function load() {
      if (params.id) {
        setId(params.id);
        try {
          // 如果需要加载可视化数据，应该调用 loadVisualization
          await loadVisualization(params.id);
        } catch (error) {
          console.log(error);
        }
      }
    }

    load();
  }, [params.id, setId, loadVisualization]);

  return <Query />;
}
