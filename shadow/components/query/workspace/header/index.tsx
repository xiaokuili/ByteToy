import { DatabaseSelector } from "./database-selector";
import { VariablesSection } from "./variables-section";
import { ToggleButton } from "./toggle-button";
import { Variable } from "@/types/base";
import { BarChart2 } from "lucide-react";
import { useVisualizationOpen } from "@/hook/use-visualization";

interface SQLWorkbenchHeaderProps {
  onToggleEditor: () => void;
  onSelectDatabase: (databaseId: string) => void;
  onSetVariables: (variables: Variable[]) => void;
  variables: Variable[];
}
export function SQLWorkbenchHeader({
  onToggleEditor,
  onSelectDatabase,
  onSetVariables,
  variables,
}: SQLWorkbenchHeaderProps) {
  const { isOpen, setIsOpen } = useVisualizationOpen();

  return (
    <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm'>
      <div className='max-w-full px-4 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <DatabaseSelector onSelect={onSelectDatabase} />
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105'
            >
              <BarChart2 className='h-4 w-4 mr-2' />
              <span className='text-sm font-semibold'>可视化</span>
            </button>

            <div className='pl-2 border-l border-gray-200 dark:border-gray-700'>
              <ToggleButton onToggle={onToggleEditor} />
            </div>
          </div>
        </div>

        {variables && variables.length > 0 && (
          <div className='mt-4'>
            <VariablesSection
              variables={variables}
              onSetVariables={onSetVariables}
            />
          </div>
        )}
      </div>
    </div>
  );
}
