import { QueryIntent } from '../sources/types';

export class NLPService {
    async analyzeIntent(query: string): Promise<QueryIntent> {
        // 简单的规则基础意图识别
        const intent: QueryIntent = {
            type: 'unknown',
            aspects: []
        };

        // 识别查询类型
        if (query.includes('销量') || query.includes('市场')) {
            intent.type = 'market_analysis';
        } else if (query.includes('价格')) {
            intent.type = 'price_analysis';
        } else if (query.includes('用户') || query.includes('客户')) {
            intent.type = 'user_analysis';
        }

        // 识别分析维度
        if (query.includes('趋势') || query.includes('变化')) {
            intent.aspects.push('trends');
        }
        if (query.includes('分布')) {
            intent.aspects.push('distribution');
        }
        if (query.includes('详细') || query.includes('具体')) {
            intent.aspects.push('details');
        }

        // 添加时间过滤
        const yearMatch = query.match(/20\d{2}/);
        if (yearMatch) {
            intent.filters = {
                year: yearMatch[0]
            };
        }

        return intent;
    }
} 