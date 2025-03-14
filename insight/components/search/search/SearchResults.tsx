import { Render, RenderConfig } from "@/lib/types";

const SearchResultsComponent: Render = {
    content: (config: RenderConfig): React.ReactNode => {
        return (
            <div className="space-y-4">
                {config.data.map((item, index) => (
                    <div key={index} className="p-4 border rounded">
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                    </div>
                ))}
            </div>
        );
    },
    error: (config: RenderConfig): React.ReactNode => {
        return (
            <div className="text-red-500">
                Error: {config.errorMessage}
            </div>
        );
    },
    loading: (config: RenderConfig): React.ReactNode => {
        console.log(config)
        return (
            <div className="animate-pulse">
                Loading search results...
            </div>
        );
    }
};

export default SearchResultsComponent;