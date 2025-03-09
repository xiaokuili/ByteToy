
import { DisplayFormat, ConfigGenerator, DataRecord } from "@/lib/types";
import { generateChartConfig } from "./sql";
import { Message } from "ai";




export const Generator: ConfigGenerator = async (data: DataRecord[], query: string, messages?: Message[]) => {
    return generateChartConfig(data, query, messages);
}