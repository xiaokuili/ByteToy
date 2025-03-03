/**
 * 图表工具函数
 * 提供图表组件中常用的功能
 */

// 默认图表颜色
export const CHART_COLORS = [
    '#4361ee', '#3a0ca3', '#7209b7', '#f72585',
    '#4cc9f0', '#4895ef', '#560bad', '#f15bb5',
    '#fee440', '#00bbf9', '#00f5d4', '#9b5de5'
];

/**
 * 获取默认颜色
 * @param index 颜色索引
 * @returns 对应的颜色
 */
export function getDefaultColor(index: number): string {
    return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * 解析颜色值
 * 处理可能是数组或字符串的颜色值
 * @param color 颜色值或颜色数组
 * @param index 如果是数组，使用的索引
 * @param defaultColor 默认颜色
 * @returns 解析后的颜色
 */
export function parseColor(
    color: string | string[] | undefined,
    index: number = 0,
    defaultColor?: string
): string {
    if (!color) {
        return defaultColor || getDefaultColor(index);
    }

    if (Array.isArray(color)) {
        return color[index % color.length] || defaultColor || getDefaultColor(index);
    }

    return color;
}

/**
 * 计算数据范围
 * @param values 数值数组
 * @param padding 填充百分比 (0-1)
 * @returns 最小值和最大值
 */
export function calculateRange(values: number[], padding: number = 0.1): { min: number; max: number } {
    const min = Math.min(0, ...values);
    const max = Math.max(...values);
    const range = max - min;

    return {
        min: min - range * padding,
        max: max + range * padding
    };
}

/**
 * 创建线性映射函数
 * 将输入范围映射到输出范围
 * @param inMin 输入最小值
 * @param inMax 输入最大值
 * @param outMin 输出最小值
 * @param outMax 输出最大值
 * @returns 映射函数
 */
export function createLinearMapper(
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): (value: number) => number {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;

    return (value: number) => {
        if (inRange === 0) return outMin;
        const normalized = (value - inMin) / inRange;
        return outMin + normalized * outRange;
    };
} 