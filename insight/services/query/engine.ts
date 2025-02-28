import { SourceRegistry } from '../sources/registry';
import { QueryResult, QueryIntent } from '../sources/types';
import { NLPService } from './nlp.service';

export class QueryEngine {
    private nlpService: NLPService;

    constructor(
        private registry: SourceRegistry,
    ) {
        this.nlpService = new NLPService();
    }

    async executeQuery(query: string): Promise<QueryResult> {
        try {
            // 1. 分析用户意图
            const intent = await this.analyzeIntent(query);

            // 2. 查找相关数据源
            const relevantSources = this.findRelevantSources(intent);

            if (relevantSources.length === 0) {
                throw new Error('No relevant data sources found for the query');
            }

            // 3. 执行查询
            const results = await Promise.all(
                relevantSources.map(source =>
                    this.registry.querySource(source.id, query)
                )
            );

            // 4. 合并结果
            return this.mergeResults(results, intent);
        } catch (error) {
            throw new Error(`Query execution failed: ${error.message}`);
        }
    }

    private async analyzeIntent(query: string): Promise<QueryIntent> {
        return this.nlpService.analyzeIntent(query);
    }

    private findRelevantSources(intent: QueryIntent) {
        return this.registry.getAllSources().filter(source =>
            this.isSourceRelevant(source, intent)
        );
    }

    private isSourceRelevant(source: any, intent: QueryIntent) {
        // 基于意图和数据源元数据判断相关性
        if (intent.type === 'market_analysis') {
            return source.metadata?.category === 'market' ||
                source.name.includes('销售') ||
                source.name.includes('市场');
        }
        return true;
    }

    private mergeResults(results: QueryResult[], intent: QueryIntent): QueryResult {
        if (results.length === 1) {
            return results[0];
        }

        // 合并多个结果
        const mergedData = results.reduce((acc, curr) => {
            return Array.isArray(curr.data)
                ? [...acc, ...curr.data]
                : { ...acc, ...curr.data };
        }, Array.isArray(results[0].data) ? [] : {});

        return {
            data: mergedData,
            type: this.determineResultType(intent),
            metadata: {
                sources: results.map(r => r.metadata?.source),
                timestamp: new Date().toISOString()
            }
        };
    }

    private determineResultType(intent: QueryIntent): 'chart' | 'text' | 'table' {
        // 基于意图决定返回类型
        if (intent.aspects.includes('trends')) return 'chart';
        if (intent.aspects.includes('details')) return 'table';
        return 'text';
    }
} 