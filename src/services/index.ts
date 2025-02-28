import { SourceRegistry } from './sources/registry';
import { CSVSourceHandler } from './sources/handlers/csv';
import { QueryEngine } from './query/engine';
import { SourceType } from './sources/types';

// 初始化注册表
const registry = new SourceRegistry();

// 注册处理器
registry.registerHandler(new CSVSourceHandler());

// 注册数据源
registry.registerSource({
    id: 'sales-data',
    type: SourceType.CSV,
    name: '销售数据',
    path: 'insight/case/new_energy_vehicles/sales_data.csv',
    description: '新能源汽车销售数据'
});

// 创建查询引擎
const queryEngine = new QueryEngine(registry);

// 使用示例
async function main() {
    const result = await queryEngine.executeQuery(
        "分析2023年新能源汽车销量趋势"
    );
    console.log(result);
} 