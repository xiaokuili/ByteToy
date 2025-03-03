
// 导入所有图表组件
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
import RadarChart from './RadarChart';


// 图表注册系统
class ChartRegistry {
    private static instance: ChartRegistry;
    private registry: Record<string, React.ComponentType<any>> = {};

    private constructor() {
        // 私有构造函数，确保单例模式
    }

    public static getInstance(): ChartRegistry {
        if (!ChartRegistry.instance) {
            ChartRegistry.instance = new ChartRegistry();
        }
        return ChartRegistry.instance;
    }

    public register(type: string, component: React.ComponentType<any>): void {
        this.registry[type] = component;
    }

    public getComponent(type: string): React.ComponentType<any> | undefined {
        return this.registry[type];
    }

    public hasComponent(type: string): boolean {
        return !!this.registry[type];
    }

    public getAllRegisteredTypes(): string[] {
        return Object.keys(this.registry);
    }
}

// 导出单例实例
export const chartRegistry = ChartRegistry.getInstance();

// 注册图表组件的函数
export function registerChart(type: string, component: React.ComponentType<any>): void {
    chartRegistry.register(type, component);
}


/**
 * 注册所有内置图表组件
 * 这个函数应该在应用启动时调用一次
 */
export function registerBuiltinCharts(): void {
    // 注册基础图表
    registerChart('bar', BarChart);
    registerChart('line', LineChart);
    registerChart('pie', PieChart);

    // 注册高级图表
    registerChart('scatter', ScatterChart);
    registerChart('radar', RadarChart);

    // 未来可以在这里添加更多图表类型

}

// 自动注册所有内置图表
registerBuiltinCharts(); 