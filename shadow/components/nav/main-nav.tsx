"use client";

import { SidebarComponent } from "./sidebar";
import { TopNavComponent } from "./top-nav";

export function MainNavComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Sidebar */}
      <SidebarComponent />

      {/* Main Content */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Top Navigation */}
        <TopNavComponent />

        {/* Content Area */}
        <main className='flex-1 overflow-y-auto  w-full'>
          <div className='h-full overflow-y-auto'>{children}</div>
        </main>
      </div>
    </div>
  );
}
