import { Variable } from "@/types/base";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface VariableCardProps {
  variable: Variable[];
  onUpdateVariable: (variables: Variable[]) => void;
  variables: Variable[];
}

export function VariableCard({
  variable,
  onUpdateVariable,
  variables,
}: VariableCardProps) {
  const handleValueChange = (newValue: string) => {
    // 直接创建新的变量数组并更新状态
    const updatedVariables = variables.map((v) =>
      v.id === variable.id ? { ...v, value: newValue } : v,
    );
    onUpdateVariable(updatedVariables);
  };

  return (
    <div className="flex items-center gap-3 bg-background rounded-lg p-3 border shadow-sm hover:shadow transition-all">
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{variable.name}</Label>
          <Badge
            variant="secondary"
            className="text-[10px] px-2 py-0.5 bg-muted"
          >
            {variable.type}
          </Badge>
        </div>
        <Input
          value={variable.value}
          placeholder={`Enter ${variable.name}`}
          className="h-8 text-sm bg-muted/30 focus:bg-background transition-colors"
          onChange={(e) => handleValueChange(e.target.value)}
        />
      </div>
    </div>
  );
}

interface VariablesSectionProps {
  variables: Variable[];
  onUpdateVariable: (variable: Variable) => void;
}

export function VariablesSection({
  variables = [], // 提供默认值
  onUpdateVariable,
}: VariablesSectionProps) {
  if (variables.length === 0) return null;

  return (
    <div className="flex flex-col space-y-2">
      <VariablesGrid
        variables={variables}
        onUpdateVariable={onUpdateVariable}
      />
    </div>
  );
}

function VariablesGrid({ variables, onUpdateVariable }: VariablesSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {variables.map((variable) => (
        <VariableCard
          key={variable.id}
          variable={variable}
          onUpdateVariable={onUpdateVariable}
          variables={variables}
        />
      ))}
    </div>
  );
}
