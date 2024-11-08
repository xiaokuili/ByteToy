import { Variable } from "@/types/base";

export function parseVariables(sql: string): Variable[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables: Variable[] = [];
  let match;

  while ((match = regex.exec(sql)) !== null) {
    const varName = match[1].trim();
    if (!variables.find((v) => v.name === varName)) {
      variables.push({
        id: crypto.randomUUID(),
        name: varName,
        value: "",
        type: "string",
      });
    }
  }
  
  return variables;
}
export function getFinalSql(sql: string, variables: Variable[]): string {
  if (!sql) return '';
  
  // 替换所有变量
  let finalSql = sql;
  variables.forEach((variable) => {
    const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, "g");
    let value: string;

    switch (variable.type) {
      case "string":
        value = variable.value ? `${variable.value}` : "NULL";
        break;
      case "number":
        value = variable.value || "NULL";
        break;
      case "boolean":
        value = variable.value ? "TRUE" : "FALSE";
        break;
      case "date":
        value = variable.value ? `'${variable.value}'` : "NULL";
        break;
      default:
        value = variable.value ? `'${variable.value}'` : "NULL";
    }

    finalSql = finalSql.replace(regex, value);
  });

  return finalSql;
}
