"use client";
import { useOutline } from "@/hook/useOutline";
import { useInput } from "@/hook/useInput";
import { useEffect, useState } from "react";
import { OutlineItem } from "@/server/generateOutline";

export default function ReportTemplater() {
  const [outlines, setOutlines] = useState<OutlineItem[]>([]);
  const { title } = useInput();

  const {  generate , generateMessage,isGenerating, error } = useOutline();

  useEffect(() => {
    const generateOutlines = async () => {
      const outlines = await generate({title: title});
      setOutlines(outlines);
    };
    generateOutlines();
  }, [generate, title]);

  return <div>
    {isGenerating ? (
      <div>生成中...{generateMessage}</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      outlines.map((item) => (
        <OutlineItemButton key={item.id} item={item} />
      ))
    )}
  </div>;
}

function OutlineItemButton({item}: {item: OutlineItem}) {
  return <div>{item.title}</div>;
}
