"use client";
import Query from "@/components/query/index";
import { useVisualization } from "@/hook/use-visualization";

import { useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { setId, loadVisualization } = useVisualization();

  useEffect(() => {
    async function load() {
      if (params.id) {
        setId(params.id);
        try {
          await loadVisualization(params.id);
        } catch (error) {
          console.log(error);
        }
      }
    }

    load();
    // 清理函数
    return () => {
      useVisualization.getState().reset();
    };
  }, [params.id, setId, loadVisualization]);

  return <Query />;
}
