import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginationDemo } from "@/components/pagination-demo";

interface Query {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// 模拟数据 - 实际项目中应该从API获取
const mockQueries: Query[] = [
  {
    id: "1",
    title: "Monthly Sales Analysis",
    description: "Analysis of sales performance across all regions",
    createdAt: "2024-03-20",
  },
  // ... 更多查询数据
];

export default function QueriesPage() {
  return (
    <div className='container mx-auto p-6'>
      {/* Header 部分 */}
      <div>
        <h1 className='text-3xl font-bold'>指标</h1>
      </div>
      <div className='flex flex-col min-h-[calc(100vh-200px)] justify-between mt-12'>
        {/* 查询列表 */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {mockQueries.map((query) => (
            <Card key={query.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle>{query.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex justify-between items-center text-sm text-muted-foreground'>
                  <span>创建时间: {query.createdAt}</span>
                  <Button variant='ghost' size='sm'>
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 分页控件 */}
        <div className='mt-6 flex justify-center'>
          <PaginationDemo />
        </div>
      </div>
    </div>
  );
}
