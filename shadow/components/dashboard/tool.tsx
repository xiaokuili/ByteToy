import { PlusSquare, Type, Heading, Variable } from "lucide-react";
import {
  useDashboardOperations,
  useDashboardActive,
} from "@/hook/use-dashboard";
import { DashboardSection } from "@/types/base";
import { createDashboardSection } from "@/hook/use-dashboard";

interface DashboardToolbarProps {
  onAddBlock: (block: DashboardSection) => void;
  onAddVariable: () => void;
  onAddHeader: () => void;
  onAddText: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  onAddBlock,
  onAddVariable,
  onAddHeader,
  onAddText,
}) => {
  const { setActiveId } = useDashboardActive();
  return (
    <div className='flex gap-2'>
      <button
        className='p-2 hover:bg-blue-100/30 rounded-md bg-blue-50/30 hover:text-blue-700/70 text-blue-600/70 shadow-lg hover:bg-blue-200/30 transform hover:scale-105 transition-all duration-200'
        onClick={() => {
          const section = createDashboardSection();
          onAddBlock(section);
          setActiveId(section.id);
        }}
        title='Add Block'
      >
        <PlusSquare size={24} />
      </button>

      <button
        className='p-2 hover:bg-gray-100/80 rounded-md'
        onClick={onAddVariable}
        title='Add Variable'
      >
        <Variable size={20} />
      </button>

      <button
        className='p-2 hover:bg-gray-100/80 rounded-md'
        onClick={onAddHeader}
        title='Add Header'
      >
        <Heading size={20} />
      </button>

      <button
        className='p-2 hover:bg-gray-100/80 rounded-md'
        onClick={onAddText}
        title='Add Text'
      >
        <Type size={20} />
      </button>
    </div>
  );
};
