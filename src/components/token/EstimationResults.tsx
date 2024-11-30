'use client'

import { NumericInput } from '@/components/ui/NumericInput'

interface EstimationResultsProps {
  initialUsage: {
    embedding: number;
    documents: Record<string, number>;
    avgDocumentLength: Record<string, number>;
    teamSize: {
      total: number;
      activeUsers: number;
    };
    multipliers: Record<string, number>;
  }
  monthlyUsage: {
    embedding: number;
    chatInput: number;
    chatOutput: number;
    pattern: {
      monthlyGrowthRate: number;
      queriesPerActiveUser: number;
      turnsPerQuery: number;
      description: string;
      embeddingMultiplier: number;
      outputMultiplier: number;
    }
    tokensPerQuery: {
      input: number;
      context: number;
      systemPrompt: number;
    }
  }
  costs: {
    initial: {
      embedding: number;
      total: number;
    }
    monthly: {
      embedding: number;
      chatInput: number;
      chatOutput: number;
      total: number;
    }
  }
  teamSize: {
    total: number;
    activeUsers: number;
  }
  modelPrices: {
    embedding: number;
    chatInput: number;
    chatOutput: number;
  }
}

export function EstimationResults({ initialUsage, monthlyUsage, costs, teamSize, modelPrices }: EstimationResultsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toFixed(2)
  }

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`
  }

  // 文档类型对应的倍率
  const DOC_MULTIPLIERS = {
    text: 1.5,
    excel: 1.67,
    ppt: 2.0,
    pdf: 1.87,
    word: 1.8,
    email: 1.3,
    image: 300  // 图片按每百万像素计算
  } as const;

  // 文档类型的中文名称
  const DOC_TYPE_NAMES = {
    text: '纯文本',
    excel: 'Excel',
    ppt: 'PPT',
    pdf: 'PDF',
    word: 'Word',
    email: '邮件',
    image: '图片'
  } as const;

  // 添加计算单个文档类型的 token 数的函数
  const calculateDocumentTokens = (count: number, length: number, multiplier: number) => {
    return count * length * multiplier;
  }

  // 添加计算总 token 数的函数
  const calculateTotalTokens = () => {
    let total = 0;
    Object.entries(initialUsage.documents).forEach(([docType, count]) => {
      if (!count) return;
      const length = initialUsage.avgDocumentLength[docType] || 0;
      const multiplier = initialUsage.multipliers[docType];
      total += calculateDocumentTokens(Number(count), Number(length), multiplier);
    });
    return total;
  }

  return (
    <div className="space-y-8">
      {/* 初始化成本详情 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">初始化成本详情</h3>
        
        <div className="space-y-6">
          {/* Token 计算明细 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Token 计算明细</h4>
            <div className="space-y-2">
              {Object.entries(initialUsage.documents).map(([docType, count]) => {
                if (!count) return null;
                const length = initialUsage.avgDocumentLength[docType] || 0;
                const multiplier = initialUsage.multipliers[docType];
                const tokens = calculateDocumentTokens(Number(count), Number(length), multiplier);
                return (
                  <div key={docType} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {DOC_TYPE_NAMES[docType]}：{formatNumber(count)}份 × {formatNumber(length)}字符 × {multiplier}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatNumber(tokens)} tokens
                    </span>
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">总 Token 数</span>
                  <span className="text-primary-600">{formatNumber(calculateTotalTokens())} tokens</span>
                </div>
              </div>
            </div>
          </div>

          {/* 成本计算 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">成本计算</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  向量化成本：{formatNumber(initialUsage.embedding)} tokens × (${modelPrices.embedding.toFixed(5)} / 1M tokens)
                </span>
                <span className="text-gray-900 font-medium">
                  {formatCost(costs.initial.embedding)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">总成本</span>
                  <span className="text-primary-600">{formatCost(costs.initial.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 月度运营成本详情 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">月度运营成本详情</h3>
        
        <div className="space-y-6">
          {/* 新增文档向量化 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">新增文档向量化</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 mb-2">
                月增长率：{(monthlyUsage.pattern.monthlyGrowthRate * 100).toFixed(1)}%
              </div>
              {Object.entries(initialUsage.documents).map(([docType, count]) => {
                if (!count) return null;
                const length = initialUsage.avgDocumentLength[docType] || 0;
                const multiplier = DOC_MULTIPLIERS[docType];
                const newCount = Math.round(count * monthlyUsage.pattern.monthlyGrowthRate);
                const tokens = newCount * length * multiplier;
                return (
                  <div key={docType} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {DOC_TYPE_NAMES[docType]}新增：{formatNumber(newCount)}份 × {formatNumber(length)}字符 × {multiplier}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatNumber(tokens)} tokens
                    </span>
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">总向量化 Token</span>
                  <span className="text-primary-600">{formatNumber(monthlyUsage.embedding)} tokens</span>
                </div>
              </div>
            </div>
          </div>

          {/* 对话消耗 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">对话消耗</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 space-y-1 mb-2">
                <div>活跃用户：{teamSize.activeUsers}人</div>
                <div>日均查询：{monthlyUsage.pattern.queriesPerActiveUser}次/人</div>
                <div>平均轮次：{monthlyUsage.pattern.turnsPerQuery}轮/次</div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  月度总查询：{teamSize.activeUsers} × {monthlyUsage.pattern.queriesPerActiveUser} × 30天
                </span>
                <span className="text-gray-900 font-medium">
                  {formatNumber(teamSize.activeUsers * monthlyUsage.pattern.queriesPerActiveUser * 30)}次
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  每次查询Token：{formatNumber(monthlyUsage.tokensPerQuery.input)} (输入) + {formatNumber(monthlyUsage.tokensPerQuery.context)} (上下文) + {formatNumber(monthlyUsage.tokensPerQuery.systemPrompt)} (系统提示)
                </span>
                <span className="text-gray-900 font-medium">
                  {formatNumber(monthlyUsage.tokensPerQuery.input + monthlyUsage.tokensPerQuery.context + monthlyUsage.tokensPerQuery.systemPrompt)} tokens/次
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  月度输入Token：{formatNumber(monthlyUsage.chatInput)} tokens
                </span>
                <span className="text-gray-900 font-medium">
                  {formatNumber(monthlyUsage.chatInput)} tokens
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  月度输出Token：{formatNumber(monthlyUsage.chatInput)} × {monthlyUsage.pattern.outputMultiplier}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatNumber(monthlyUsage.chatOutput)} tokens
                </span>
              </div>
            </div>
          </div>

          {/* 月度成本计算 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">月度成本计算</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  向量化成本：{formatNumber(monthlyUsage.embedding)} tokens × (${modelPrices.embedding.toFixed(5)} / 1M tokens)
                </span>
                <span className="text-gray-900 font-medium">{formatCost(costs.monthly.embedding)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  对话输入成本：{formatNumber(monthlyUsage.chatInput)} tokens × (${modelPrices.chatInput.toFixed(5)} / 1M tokens)
                </span>
                <span className="text-gray-900 font-medium">{formatCost(costs.monthly.chatInput)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  对话输出成本：{formatNumber(monthlyUsage.chatOutput)} tokens × (${modelPrices.chatOutput.toFixed(5)} / 1M tokens)
                </span>
                <span className="text-gray-900 font-medium">{formatCost(costs.monthly.chatOutput)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">月度总成本</span>
                  <span className="text-primary-600">{formatCost(costs.monthly.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 