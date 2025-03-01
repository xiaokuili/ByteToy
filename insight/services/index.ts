import { SourceRegistry } from './sources/registry';
import { CSVSourceHandler } from './sources/handlers/csv';
import { QueryEngine } from './query/engine';
import { SourceType } from './sources/types';

export class InsightService {
    private registry: SourceRegistry;
    private queryEngine: QueryEngine;

    constructor() {
        this.registry = new SourceRegistry();
        this.setupHandlers();
        this.setupSources();
        this.queryEngine = new QueryEngine(this.registry);
    }

    private setupHandlers() {
        this.registry.registerHandler(new CSVSourceHandler());
    }

    private setupSources() {
        // 注册所有数据源
        const sources = [
            {
                id: 'sales-data',
                type: SourceType.CSV,
                name: '销售数据',
                path: 'case/new_energy_vehicles/sales_data.csv',
                description: '新能源汽车销售数据',
                metadata: {
                    category: 'market',
                    updateFrequency: 'monthly'
                }
            },
            {
                id: 'price-analysis',
                type: SourceType.CSV,
                name: '价格分析',
                path: 'case/new_energy_vehicles/price_analysis.csv',
                description: '价格区间分析数据',
                metadata: {
                    category: 'market',
                    updateFrequency: 'monthly'
                }
            },
            {
                id: 'market-share',
                type: SourceType.CSV,
                name: '市场份额',
                path: 'case/new_energy_vehicles/market_share.csv',
                description: '各品牌市场占有率数据',
                metadata: {
                    category: 'market',
                    updateFrequency: 'monthly'
                }
            },
            {
                id: 'consumer-survey',
                type: SourceType.CSV,
                name: '消费者调研',
                path: 'case/new_energy_vehicles/consumer_survey.csv',
                description: '消费者购买意向与满意度调查',
                metadata: {
                    category: 'consumer',
                    updateFrequency: 'quarterly'
                }
            },
            {
                id: 'charging-stations',
                type: SourceType.CSV,
                name: '充电设施',
                path: 'case/new_energy_vehicles/charging_stations.csv',
                description: '充电桩分布与使用情况',
                metadata: {
                    category: 'infrastructure',
                    updateFrequency: 'weekly'
                }
            }
        ];

        sources.forEach(source => this.registry.registerSource(source));
    }

    async query(query: string) {
        return this.queryEngine.executeQuery(query);
    }

    getAvailableSources() {
        return this.registry.getAllSources();
    }
}

// 导出服务实例
export const insightService = new InsightService(); 