import { DataSource, FetchSelector, FetchConfig } from "@/lib/types";


export const select: FetchSelector = (dataSource: DataSource, query: string) => {
    return {
        query: query,
        fetchType: dataSource.fetch_type || "sql",
        dataSource: dataSource
    } as FetchConfig;
}
