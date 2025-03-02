import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | ByteToy Insight',
    default: 'ByteToy Insight - 智能搜索与知识管理平台',
  },
  description: 'ByteToy Insight 是一个现代化的智能搜索与知识管理平台，帮助您更高效地获取和组织信息。',
  keywords: ['智能搜索', '知识管理', 'AI', '人工智能', 'ByteToy'],
  authors: [{ name: '7788' }],
  creator: '7788',
  publisher: '7788',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
