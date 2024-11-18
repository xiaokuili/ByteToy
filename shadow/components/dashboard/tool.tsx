import { PlusSquare, Type, Heading, Variable } from "lucide-react";

interface DashboardToolbarProps {
  onAddBlock: () => void;
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
  return (
    <div className='flex gap-2'>
      <button
        className='p-2 hover:bg-blue-100 rounded-md bg-blue-50 hover:text-blue-700 text-blue-600 shadow-lg hover:bg-blue-200 transform hover:scale-105 transition-all duration-200'
        onClick={onAddBlock}
        title='Add Block'
      >
        <PlusSquare size={24} />
      </button>

      <button
        className='p-2 hover:bg-gray-100 rounded-md'
        onClick={onAddVariable}
        title='Add Variable'
      >
        <Variable size={20} />
      </button>

      <button
        className='p-2 hover:bg-gray-100 rounded-md'
        onClick={onAddHeader}
        title='Add Header'
      >
        <Heading size={20} />
      </button>

      <button
        className='p-2 hover:bg-gray-100 rounded-md'
        onClick={onAddText}
        title='Add Text'
      >
        <Type size={20} />
      </button>
    </div>
  );
};
