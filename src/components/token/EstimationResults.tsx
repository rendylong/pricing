'use client'

import { NumericInput } from '@/components/ui/NumericInput'

interface EstimationResultsProps {
  initialUsage: {
    embedding: number
    documents: Record<string, number | ''>
    avgDocumentLength: Record<string, number | ''>
    teamSize?: {
      total: number
      activeUsers: number
    }
  }
  monthlyUsage: {
    embedding: number
    chatInput: number
    chatOutput: number
    documents: Record<string, number | ''>
    avgDocumentLength: Record<string, number | ''>
    pattern: {
      monthlyGrowthRate: number
      queriesPerActiveUser: number
      turnsPerQuery: number
      description: string
      embeddingMultiplier: number
      outputMultiplier: number
    }
    tokensPerQuery: {
      input: number
      context: number
      systemPrompt: number
      outputMultiplier: number
    }
  }
  costs: {
    initial: {
      embedding: number
      total: number
    }
    monthly: {
      embedding: number
      chatInput: number
      chatOutput: number
      total: number
    }
  }
  teamSize?: {
    total: number
    activeUsers: number
  }
}

const DOC_TYPE_NAMES = {
  text: '纯文本文档',
  excel: 'Excel 文档',
  ppt: 'PPT 文档',
  pdf: 'PDF 文档',
  word: 'Word 文档',
  email: '邮件文档',
  image: '图片文件',
  audio: '音频文件',
  video: '视频文件'
}

export function EstimationResults({ 
  initialUsage, 
  monthlyUsage, 
  costs,
  teamSize
}: EstimationResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 初始化成本 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          初始化成本
        </h3>
        
        {/* 基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">
              团队规模
            </div>
            <div className="text-2xl font-semibold">
              {(teamSize?.total || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              人
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">
              活跃用户
            </div>
            <div className="text-2xl font-semibold">
              {(teamSize?.activeUsers || Math.round((teamSize?.total || 0) * 0.3)).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              人
            </div>
          </div>
        </div>

        {/* 初始文档 Token 使用量 */}
        <div className="space-y-3">
          {Object.entries(initialUsage.documents).map(([type, count]) => {
            if (!count) return null
            const length = Number(initialUsage.avgDocumentLength[type]) || 0
            const tokens = Number(count) * length * 1.5
            
            if (tokens === 0) return null

            return (
              <div key={type} className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm text-gray-900">{DOC_TYPE_NAMES[type]}</div>
                  <div className="text-xs text-gray-500">
                    {Number(count).toLocaleString()} 份 × {length.toLocaleString()} 字符
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {(tokens / 1000000).toFixed(2)}M tokens
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">
              初始化总成本
            </span>
            <span className="text-xl font-bold text-primary-600">
              ${(costs.initial.total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 月度运营成本 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          月度运营成本
        </h3>

        {/* 基础指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">活跃用户数</div>
            <div className="text-2xl font-semibold">
              {teamSize?.activeUsers || 0}
            </div>
            <div className="text-sm text-gray-500">人</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">日均查询次数/人</div>
            <div className="text-2xl font-semibold">
              {Math.round((monthlyUsage.chatInput / 30 / (teamSize?.activeUsers || 1)) / 3000)}
            </div>
            <div className="text-sm text-gray-500">次</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">月度总查询次数</div>
            <div className="text-2xl font-semibold">
              {Math.round(monthlyUsage.chatInput / 3000)}
            </div>
            <div className="text-sm text-gray-500">次</div>
          </div>
        </div>

        {/* 文档增长详情 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">月度新增文档</h4>
          <div className="space-y-3">
            {Object.entries(monthlyUsage.documents).map(([type, count]) => {
              if (!count) return null
              return (
                <div key={type} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">{DOC_TYPE_NAMES[type]}</div>
                    <div className="text-xs text-gray-500">
                      {Number(count).toLocaleString()} 份 × {
                        Number(monthlyUsage.avgDocumentLength[type]).toLocaleString()
                      } 字符
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {((Number(count) * Number(monthlyUsage.avgDocumentLength[type]) * 1.5) / 1000000).toFixed(2)}M tokens
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Token 使用量明细 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Token 使用量明细</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-gray-900">向量化 Token</div>
                <div className="text-xs text-gray-500">新增文档向量化</div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {(monthlyUsage.embedding / 1000000).toFixed(2)}M tokens
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-gray-900">对话输入 Token</div>
                <div className="text-xs text-gray-500">
                  包含用户输入、上下文和系统提示
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {(monthlyUsage.chatInput / 1000000).toFixed(2)}M tokens
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-gray-900">对话输出 Token</div>
                <div className="text-xs text-gray-500">AI 回复生成</div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {(monthlyUsage.chatOutput / 1000000).toFixed(2)}M tokens
              </div>
            </div>
          </div>
        </div>

        {/* 成本明细 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">向量化成本</span>
              <span className="font-medium">${costs.monthly.embedding.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">对话输入成本</span>
              <span className="font-medium">${costs.monthly.chatInput.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">对话输出成本</span>
              <span className="font-medium">${costs.monthly.chatOutput.toFixed(2)}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">月度总成本</span>
                <span className="text-xl font-bold text-primary-600">
                  ${costs.monthly.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 计算说明 */}
        <div className="mt-6 text-sm text-gray-500">
          <h4 className="font-medium mb-2">计算说明：</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>每次查询平均消耗：
              <span className="text-primary-600">
                {monthlyUsage.tokensPerQuery.input} tokens (用户输入) + 
                {monthlyUsage.tokensPerQuery.context} tokens (上下文) + 
                {monthlyUsage.tokensPerQuery.systemPrompt} tokens (系统提示)
              </span>
            </li>
            <li>AI 回复平均消耗：
              <span className="text-primary-600">
                输入 tokens 的 {monthlyUsage.pattern.outputMultiplier * 100}%
              </span>
            </li>
            <li>文档向量化：
              <span className="text-primary-600">
                每个字符约 {monthlyUsage.pattern.embeddingMultiplier} tokens
              </span>
            </li>
            <li>月度新增文档数：
              <span className="text-primary-600">
                基于初始文档量的 {(monthlyUsage.pattern.monthlyGrowthRate * 100).toFixed(0)}% 增长率
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 