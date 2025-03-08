import { Fetch, FetchConfig, FetchType, FetchResult } from "@/lib/types";
import { fetchFromSQL } from "./sql";
import { fetchFromRAG } from "./rag";
import { fetchFromWeb } from "./web";
import { Message } from "ai";


// 策略映射表
const fetchStrategies: Record<FetchType, Fetch> = {
    "sql": fetchFromSQL,
    "rag": fetchFromRAG,
    "web": fetchFromWeb
};

// 统一的数据获取函数，根据配置选择合适的策略
export const FetchData: Fetch = async (config: FetchConfig): Promise<{ result: FetchResult; messages?: Message[] }> => {
    const fetchType = config.fetchType;

    if (!fetchType) {
        throw new Error("Fetch type not specified in config");
    }

    const fetchStrategy = fetchStrategies[fetchType];

    if (!fetchStrategy) {
        throw new Error(`Unsupported fetch type: ${fetchType}`);
    }

    return fetchStrategy(config);
}

// 也可以单独导出各个策略，以便直接使用
export { fetchFromSQL, fetchFromRAG, fetchFromWeb };