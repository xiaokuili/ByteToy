"use client";

import ReportOutline from "./outline";
import ReportTool from "./tool";
import ReportSetting from "./setting";
import ReportEditor from "./editor";

export default function Page() {

  return <div className="flex gap-4 p-4 h-full">
    <div className="min-w-[256px]  max-w-[300px] truncate bg-[rgb(247,247,246)] rounded-[12px] h-full">
      <ReportOutline />
    </div>
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-[48px] bg-[rgb(247,247,246)] rounded-[12px]">      
        <ReportTool />
      </div>
      <ReportEditor />
    </div>
    <div className="w-[256px] h-full ">
      <ReportSetting />
    </div>

  </div>;
}


