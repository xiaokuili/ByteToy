"use client";

import { SidebarComponent } from "./sidebar";
import { TopNavComponent } from "./top-nav";

export function MainNavComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Sidebar */}
      <SidebarComponent />

      {/* Main Content */}
      <div className='flex flex-col flex-1'>
        {/* Top Navigation */}
        <TopNavComponent />
        {/* <div className='h-16 border'>top</div> */}

        {/* Content Area */}
        <main className='flex-1 overflow-hidden'>
          <div className='h-full '>{children}</div>
        </main>
      </div>
    </div>
  );
}
