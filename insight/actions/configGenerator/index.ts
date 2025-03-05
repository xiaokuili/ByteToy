
import { DisplayFormat, ConfigGenerator } from "@/lib/types";
import { SQLConfigGenerator } from "./sql";



export const ConfigGeneratorFactory = (format: DisplayFormat): ConfigGenerator => {
    if (format == "chart") {
        return SQLConfigGenerator;
    }
    throw new Error(`Unsupported format: ${format}`);
}