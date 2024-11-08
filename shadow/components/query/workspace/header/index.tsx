import { DatabaseSelector } from "./database-selector";
import { VariablesSection } from "./variables-section";
import { ToggleButton } from "./toggle-button";

interface SQLWorkbenchHeaderProps {
  onToggleEditor: () => void; // 更清晰的命名
  onSelectDatabase: (databaseId: string) => void;
  onUpdateVariable: (variable: Variable) => void;
  variables: Variable[];
}

export function SQLWorkbenchHeader({
  onToggleEditor,
  onSelectDatabase,
  onUpdateVariable,
  variables,
}: SQLWorkbenchHeaderProps) {
  return (
    <div className='border-y border-border bg-muted/5'>
      <div className='flex flex-col space-y-3 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <DatabaseSelector onSelect={onSelectDatabase} />
          </div>
          <ToggleButton onToggle={onToggleEditor} />
        </div>
        <VariablesSection
          variables={variables}
          onUpdateVariable={onUpdateVariable}
        />
      </div>
    </div>
  );
}
