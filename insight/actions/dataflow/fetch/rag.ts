import { Fetch, FetchConfig, FetchResult } from "@/lib/types";
import { Message } from "ai";

export const fetchFromRAG: Fetch = async (config: FetchConfig): Promise<{ result: FetchResult; messages?: Message[] }> => {

    // Mock data for testing
    const mockData = [
        { id: 1, name: "Test 1", value: 100 },
        { id: 2, name: "Test 2", value: 200 },
        { id: 3, name: "Test 3", value: 300 }
    ];

    return {
        result: {
            data: mockData,
            metadata: {
                total: mockData.length,
                query: config.query
            }
        },
        messages: []
    };
}   