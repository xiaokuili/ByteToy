"use client";

import { SidebarComponent } from "./sidebar";
import { TopNavComponent } from "./top-nav";

export function MainNavComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen flex overflow-hidden'>
      {/* Sidebar */}
      <div className='w-65 shrink-0 border-r overflow-auto'>
        {/* Sidebar content */}
        <SidebarComponent />
      </div>

      {/* Main Content */}
      <div className='flex flex-col flex-1'>
        {/* Top Navigation */}
        <TopNavComponent />
        {/* Content Area */}
        <div className='flex-1 overflow-auto min-h-0'>{children}</div>
      </div>
    </div>
  );
}
