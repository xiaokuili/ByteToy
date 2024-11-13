"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { listVisualizations } from "@/lib/visualization-actions";
import { useEffect, useState } from "react";
import { Visualization } from "@/types/base";
import Link from "next/link";

export default function QueriesPage() {
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<Visualization[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchVisualizations = async () => {
      try {
        const data = await listVisualizations({
          page,
          pageSize: 10,
        });
        setQueries(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch visualizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisualizations();
  }, [page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto p-6'>
      {/* Header 部分 */}
      <div>
        <h1 className='text-3xl font-bold'>指标</h1>
      </div>
      <div className='flex flex-col min-h-[calc(100vh-200px)] justify-between mt-12'>
        {/* 查询列表 */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {queries.map((item) => (
            <Card key={item.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex justify-between items-center text-sm text-muted-foreground'>
                  <span>
                    创建时间: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant='ghost' size='sm' asChild>
                    <Link href={`/queries/${item.id}`}>查看详情</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 分页控件 */}
        <div className='mt-6 flex justify-center'>
          <div className='flex w-full justify-center'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    disabled={page <= 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < totalPages && setPage(page + 1)}
                    disabled={page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
