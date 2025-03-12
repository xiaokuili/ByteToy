import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { SessionProvider } from "next-auth/react"


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Inseen Chat',
    default: 'Inseen Chat - 与数据对话，轻松可视化',
  },
  description: 'Inseen Chat 是一个现代化的智能搜索与知识管理平台，帮助您更高效地获取和组织信息。',
  keywords: ['数据可视化', '数据分析', 'AI', '人工智能', 'Inseen', "AI数据可视化", "AI生成图片"],
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
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
