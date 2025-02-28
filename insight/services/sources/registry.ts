import { Source, SourceHandler, SourceType } from './types';

export class SourceRegistry {
    private sources: Map<string, Source> = new Map();
    private handlers: Map<SourceType, SourceHandler> = new Map();

    registerSource(source: Source) {
        this.sources.set(source.id, source);
    }

    registerHandler(handler: SourceHandler) {
        this.handlers.set(handler.type, handler);
    }

    getSource(id: string): Source | undefined {
        return this.sources.get(id);
    }

    getAllSources(): Source[] {
        return Array.from(this.sources.values());
    }

    getSourcesByType(type: SourceType): Source[] {
        return this.getAllSources().filter(source => source.type === type);
    }

    getHandler(type: SourceType): SourceHandler | undefined {
        return this.handlers.get(type);
    }

    async querySource(sourceId: string, query: string) {
        const source = this.getSource(sourceId);
        if (!source) {
            throw new Error(`Source not found: ${sourceId}`);
        }

        const handler = this.getHandler(source.type);
        if (!handler) {
            throw new Error(`No handler registered for source type: ${source.type}`);
        }

        return handler.query(source, query);
    }
} 