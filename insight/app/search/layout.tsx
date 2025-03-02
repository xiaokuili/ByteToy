import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '搜索 - ByteToy Insight',
    description: '使用 ByteToy Insight 智能搜索引擎查找您需要的信息',
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
