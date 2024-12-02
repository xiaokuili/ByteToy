"use client";
import Query from "@/components/query/index";
import { useQueryAndViewState } from "@/hook/use-visualization";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";


export default function Page({ params }: { params: { id: string } }) {
  const { setId, loadVisualization } = useQueryAndViewState();
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
    return () => {
      setOpen(false);
    };
  }, []);

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
