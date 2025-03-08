
import { DisplayFormat, ConfigGenerator, DataRecord } from "@/lib/types";
import { SQLConfigGenerator } from "./sql";
import { Message } from "ai";




export const Generator: ConfigGenerator = async (data: DataRecord[], query: string, messages?: Message[]) => {
    return SQLConfigGenerator(data, query, messages);
}