"use client";


export default function ReportSetting() {

  return <div className="flex flex-col gap-1 ">
    <div className="rounded-[12px] bg-[rgb(247,247,246)] p-4 gap-4 flex flex-col">
      <div>数据设置</div>
      {/* <DataSetting /> */}
    </div>
    <div className="rounded-[12px] bg-[rgb(247,247,246)] p-4 gap-4 flex flex-col">
      <div>生成设置</div>
      {/* <GenerateSetting /> */}
    </div>
  </div>;
}

