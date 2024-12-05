'use client'

interface EstimationResultsProps {
  initialUsage: {
    embedding: number;
    documents: Record<string, string>;
    avgDocumentLength: Record<string, string>;
    multipliers: Record<string, number>;
  };
  monthlyUsage: {
    embedding: number;
    chatInput: number;
    chatOutput: number;
    pattern: {
      monthlyGrowthRate: number;
      queriesPerActiveUser: number;
      turnsPerQuery: number;
    };
  };
  costs: {
    initial: { embedding: number; total: number };
    monthly: {
      embedding: number;
      chatInput: number;
      chatOutput: number;
      total: number;
    };
  };
  teamSize: {
    total: number;
    activeUsers: number;
  };
  modelPrices: {
    embedding: number;
    chatInput: number;
    chatOutput: number;
  };
}

export function EstimationResults({
  initialUsage,
  monthlyUsage,
  costs,
  teamSize,
  modelPrices
}: EstimationResultsProps) {
  // 辅助函数：将 token 数转换为 M 格式
  const formatTokens = (tokens: number) => {
    return (tokens / 1000000).toFixed(2) + 'M';
  };

  // 辅助函数：格式化价格
  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="space-y-8">
      {/* 初始化成本详情 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">初始化成本详情</h3>
        
        <div className="space-y-6">
          {/* Token 计算明细 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Token 计算明细</h4>
            <div className="space-y-4">
              {/* 文档类型明细 */}
              {Object.entries(initialUsage.documents).map(([type, count]) => {
                const length = initialUsage.avgDocumentLength[type] || '0';
                const multiplier = initialUsage.multipliers[type];
                const tokens = Number(count) * Number(length) * multiplier;
                
                if (tokens === 0) return null;
                
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{type} 文档向量化</span>
                      <span className="font-medium">{formatTokens(tokens)} tokens</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {count} 个文档 × {length} 字符/文档 × {multiplier} tokens/字符
                    </p>
                  </div>
                );
              })}
              
              <div className="flex justify-between text-sm font-medium pt-2 border-t">
                <span className="text-gray-900">总向量化 Token</span>
                <span>{formatTokens(initialUsage.embedding)} tokens</span>
              </div>
            </div>
          </div>

          {/* 成本计算 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">成本计算</h4>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">向量化成本</span>
                  <span className="font-medium">{formatPrice(costs.initial.embedding)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatTokens(initialUsage.embedding)} tokens × {formatPrice(modelPrices.embedding)}/M tokens
                </p>
              </div>
              
              <div className="flex justify-between text-sm font-medium text-primary-600 pt-2 border-t">
                <span>总初始化成本</span>
                <span>{formatPrice(costs.initial.total)}</span>
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
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">月度新增向量化 Token</span>
                  <span className="font-medium">{formatTokens(monthlyUsage.embedding)} tokens</span>
                </div>
                <p className="text-xs text-gray-500">
                  初始文档量 × {(monthlyUsage.pattern.monthlyGrowthRate * 100).toFixed(1)}% 月增长率
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">向量化成本</span>
                  <span className="font-medium">{formatPrice(costs.monthly.embedding)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatTokens(monthlyUsage.embedding)} tokens × {formatPrice(modelPrices.embedding)}/M tokens
                </p>
              </div>
            </div>
          </div>

          {/* 对话消耗 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">对话消耗</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">输入 Token</span>
                  <span className="font-medium">{formatTokens(monthlyUsage.chatInput)} tokens</span>
                </div>
                <p className="text-xs text-gray-500">
                  {teamSize.activeUsers} 活跃用户 × {monthlyUsage.pattern.queriesPerActiveUser} 次/日 × 30天 × {monthlyUsage.pattern.turnsPerQuery} 轮次/对话
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">输出 Token</span>
                  <span className="font-medium">{formatTokens(monthlyUsage.chatOutput)} tokens</span>
                </div>
                <p className="text-xs text-gray-500">
                  输入Token × 0.7 输出比例
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">对话输入成本</span>
                  <span className="font-medium">{formatPrice(costs.monthly.chatInput)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatTokens(monthlyUsage.chatInput)} tokens × {formatPrice(modelPrices.chatInput)}/M tokens
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">对话输出成本</span>
                  <span className="font-medium">{formatPrice(costs.monthly.chatOutput)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatTokens(monthlyUsage.chatOutput)} tokens × {formatPrice(modelPrices.chatOutput)}/M tokens
                </p>
              </div>
            </div>
          </div>

          {/* 月度成本计算 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">月度成本计算</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-primary-600">
                <span>总月度运营成本</span>
                <span>{formatPrice(costs.monthly.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 