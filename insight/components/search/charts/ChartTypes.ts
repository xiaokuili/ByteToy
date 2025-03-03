// 基础数据点类型
export interface DataPoint {
    label: string;
    value: number;
}

// 基础数据集类型
export interface DataSet {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}

// 柱状图数据类型
export interface BarChartData {
    labels: string[];
    datasets: DataSet[];
}

// 折线图数据类型
export interface LineChartData {
    labels: string[];
    datasets: DataSet[];
    showArea?: boolean;
    tension?: number; // 曲线平滑度 (0-1)
}

// 饼图/环形图数据类型
export interface PieChartData {
    labels: string[];
    datasets: [{
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
        borderWidth?: number;
        hoverOffset?: number;
    }];
    isDonut?: boolean; // 是否为环形图
}




// 散点图数据类型
export interface ScatterChartData {
    datasets: Array<{
        label: string;
        data: Array<{ x: number; y: number }>;
        backgroundColor?: string;
        pointRadius?: number;
    }>;
}



// 雷达图数据类型
export interface RadarChartData {
    labels: string[];
    datasets: DataSet[];
}




// 所有图表数据类型的联合类型
export type ChartData =
    | { type: 'bar'; data: BarChartData }
    | { type: 'line'; data: LineChartData }
    | { type: 'pie'; data: PieChartData }
    | { type: 'scatter'; data: ScatterChartData }
    | { type: 'radar'; data: RadarChartData };

// 图表配置选项
export interface ChartOptions {
    title?: string;
    subtitle?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    legendPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none';
    aspectRatio?: number; // 宽高比
    animation?: boolean;
    responsive?: boolean;
    theme?: 'light' | 'dark' | 'auto';
}

// 完整图表配置
export interface ChartConfig {
    chartData: ChartData;
    options?: ChartOptions;
} 