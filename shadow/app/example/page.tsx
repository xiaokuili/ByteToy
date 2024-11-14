"use client";

export default function ExamplePage() {
  return (
    <div className='flex h-full w-full '>
      {/* Left Panel */}
      <div className='w-64 border-r border-gray-200 p-4'>
        <div className='h-full'>Left Sidebar Content</div>
      </div>

      {/* Right Panel */}
      <div className='flex-1 flex flex-col '>
        {/* Top Section */}
        <div className='h-48 border-b border-gray-200 p-4'>Top Content</div>

        {/* Bottom Section - Scrollable */}
        <div className='flex-1 overflow-y-auto p-4'>
          {/* Example content to demonstrate scroll */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className='mb-4 p-4 bg-gray-100 rounded'>
              Scrollable Content {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
