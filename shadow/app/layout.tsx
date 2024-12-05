import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/nav/sidebar"
import { TopNavComponent } from "@/components/nav/top-nav"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <SidebarComponent />
            <main className="flex-1 w-full">
              <TooltipProvider>
                <div className="h-16 "><TopNavComponent /></div>
                <div className="w-full h-full">{children}</div>
                <Toaster />
              </TooltipProvider>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
