"use client";

import { Button } from "@/components/ui/button";
import { createVisualization } from "@/lib/visualization-actions";
import { useVisualization } from "@/hook/use-visualization";
export function QuestionHeaderComponent() {
  const { datasourceId, sqlContent, viewMode, aiParams, sqlVariables } =
    useVisualization();
  return (
    <div className='flex items-center justify-between  px-16 h-full'>
      <h1 className='text-[18px] font-bold text-[rgb(105,110,123)]   antialiased'>
        查询
      </h1>
      <div className='flex items-center space-x-2'>
        <Button
          variant='ghost'
          className='text-blue-500 hover:text-blue-600 hover:bg-blue-50'
          onClick={async () => {
            const name = await new Promise<string>((resolve) => {
              const dialog = document.createElement("dialog");
              dialog.className =
                "fixed inset-0 z-50 flex items-center justify-center";

              const form = document.createElement("form");
              form.method = "dialog";
              form.className = "bg-background rounded-lg border shadow-lg w-[400px] p-6";

              const label = document.createElement("label");
              label.textContent = "可视化名称";
              label.className =
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

              const input = document.createElement("input");
              input.type = "text";
              input.className =
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
              input.required = true;

              const buttons = document.createElement("div");
              buttons.className = "flex justify-end space-x-2 mt-6";

              const cancelBtn = document.createElement("button");
              cancelBtn.textContent = "取消";
              cancelBtn.className =
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2";
              cancelBtn.onclick = () => {
                dialog.close();
                resolve("");
              };

              const submitBtn = document.createElement("button");
              submitBtn.textContent = "确定";
              submitBtn.className =
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2";
              submitBtn.type = "submit";

              buttons.append(cancelBtn, submitBtn);
              form.append(label, input, buttons);
              dialog.append(form);
              document.body.append(dialog);

              form.onsubmit = (e) => {
                e.preventDefault();
                dialog.close();
                resolve(input.value);
              };

              dialog.showModal();

              dialog.addEventListener("close", () => {
                dialog.remove();
              });
            });

            if (!name) return;

            try {
              await createVisualization({
                name,
                datasourceId,
                sqlContent,
                viewMode,
                viewParams: aiParams,
                sqlVariables,
              });
              alert("保存成功!");
            } catch (err) {
              console.error(err);
              alert("保存失败!");
            }
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
}
