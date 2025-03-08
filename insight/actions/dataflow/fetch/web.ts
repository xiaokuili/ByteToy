import { FetchConfig, FetchResult } from "@/lib/types";

export const fetchFromWeb = async (config: FetchConfig) => {
    // Mock data for testing
    const mockData = [
        { id: 1, name: "Test 1", value: 100 },
        { id: 2, name: "Test 2", value: 200 },
        { id: 3, name: "Test 3", value: 300 }
    ];

    return {
        data: mockData,
        metadata: {
            total: mockData.length,
            query: config.query
        }
    };
}

