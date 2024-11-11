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
                "p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800";

              const form = document.createElement("form");
              form.method = "dialog";
              form.className = "space-y-4";

              const label = document.createElement("label");
              label.textContent = "可视化名称";
              label.className =
                "block text-sm font-medium text-gray-700 dark:text-gray-200";

              const input = document.createElement("input");
              input.type = "text";
              input.className =
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";
              input.required = true;

              const buttons = document.createElement("div");
              buttons.className = "flex justify-end space-x-2 mt-4";

              const cancelBtn = document.createElement("button");
              cancelBtn.textContent = "取消";
              cancelBtn.className =
                "px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50";
              cancelBtn.onclick = () => {
                dialog.close();
                resolve("");
              };

              const submitBtn = document.createElement("button");
              submitBtn.textContent = "确定";
              submitBtn.className =
                "px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600";
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
