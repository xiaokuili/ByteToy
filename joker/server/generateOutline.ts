
export interface OutlineItem {
    id: string
    title: string
    type?: 'line' | 'bar' | 'pie' 
    children?: OutlineItem[]
}

  

export const generateOutline = async (title: string) => {
    // 根据标题生成示例大纲
    const outline = [
        {
            id: '1',
            title: '第一章：概述',
            children: [
                { id: '1.1', title: `1.1 ${title}简介` },
                { id: '1.2', title: '1.2 研究背景与意义' },
                { id: '1.3', title: '1.3 研究方法' }
            ]
        },
        {
            id: '2', 
            title: '第二章：理论基础',
            children: [
                { id: '2.1', title: '2.1 基本概念' },
                { id: '2.2', title: '2.2 相关理论' },
                { id: '2.3', title: '2.3 研究现状' }
            ]
        },
        {
            id: '3',
            title: '第三章：分析与设计',
            children: [
                { id: '3.1', title: '3.1 需求分析' },
                { id: '3.2', title: '3.2 总体设计' },
                { id: '3.3', title: '3.3 详细设计' }
            ]
        },
        {
            id: '4',
            title: '第四章：实现与测试',
            children: [
                { id: '4.1', title: '4.1 开发环境' },
                { id: '4.2', title: '4.2 关键功能实现' },
                { id: '4.3', title: '4.3 测试与验证' }
            ]
        },
        {
            id: '5',
            title: '第五章：总结与展望',
            children: [
                { id: '5.1', title: '5.1 主要工作总结' },
                { id: '5.2', title: '5.2 创新点' },
                { id: '5.3', title: '5.3 未来展望' }
            ]
        }
    ]
    
    return outline
}
