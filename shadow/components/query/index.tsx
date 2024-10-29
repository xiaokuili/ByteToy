import { QuestionHeaderComponent } from "./query-header";
import { QueryContentComponent } from "@/components/query/query-content";

export default function Query() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-16">
        <QuestionHeaderComponent />
      </div>
      <div className="flex-1">
        <QueryContentComponent />
      </div>
    </div>
  );
}
