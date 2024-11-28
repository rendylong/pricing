'use client'

interface EstimationResultsProps {
  initialUsage: {
    embedding: number
    documents: Record<string, number | ''>
    avgDocumentLength: Record<string, number | ''>
    teamSize?: {
      total: number
      activeUsers: number
    }
    industry?: string
  }
  monthlyUsage: {
    embedding: number
    chatInput: number
    chatOutput: number
    documents: Record<string, number | ''>
    avgDocumentLength: Record<string, number | ''>
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
  industry?: string
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

const INDUSTRY_NAMES = {
  education: '教育行业',
  finance: '金融行业',
  healthcare: '医疗行业',
  manufacturing: '制造业',
  retail: '零售业',
  default: '通用行业'
}

export function EstimationResults({ 
  initialUsage, 
  monthlyUsage, 
  costs,
  teamSize,
  industry 
}: EstimationResultsProps) {
  // 渲染 Token 使用量明细
  const renderTokenBreakdown = (usage: any) => {
    const docTypes = Object.keys(usage.documents || {})
    return (
      <div className="space-y-3">
        {docTypes.map(type => {
          if (!usage.documents[type]) return null
          const count = Number(usage.documents[type]) || 0
          const length = Number(usage.avgDocumentLength[type]) || 0
          const tokens = count * length * 1.5
          
          if (tokens === 0) return null

          return (
            <div key={type} className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-gray-900">
                  {DOC_TYPE_NAMES[type]}
                </div>
                <div className="text-xs text-gray-500">
                  {count.toLocaleString()} 份 × {length.toLocaleString()} 字符
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {(tokens / 1000000).toFixed(2)}M tokens
              </div>
            </div>
          )
        })}

        {/* 团队个人文档 */}
        {teamSize && teamSize.activeUsers > 0 && (
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-900">
                团队个人文档
              </div>
              <div className="text-xs text-gray-500">
                {teamSize.activeUsers.toLocaleString()} 人 × 50 份
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {((teamSize.activeUsers * 50 * 2000 * 1.5) / 1000000).toFixed(2)}M tokens
            </div>
          </div>
        )}

        {/* 行业复杂度调整 */}
        {industry && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>行业复杂度调整</span>
            <span>×{
              {
                education: '1.2',
                finance: '1.3',
                healthcare: '1.4',
                manufacturing: '1.1',
                retail: '1.0'
              }[industry] || '1.0'
            }</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 初始化成本 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          初始化成本
        </h3>
        
        {/* 基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">
              所属行业
            </div>
            <div className="text-xl font-semibold">
              {INDUSTRY_NAMES[industry || 'default']}
            </div>
          </div>
        </div>

        {/* Token 使用量 */}
        <div className="space-y-4">
          {renderTokenBreakdown(initialUsage)}
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
      </div>

      {/* 月度运营成本 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          月度运营成本
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">
              月度向量化 Token
            </div>
            <div className="text-2xl font-semibold">
              {(monthlyUsage.embedding / 1000000).toFixed(2)}M
            </div>
            <div className="text-sm text-gray-500">
              tokens
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">
              月度对话输入 Token
            </div>
            <div className="text-2xl font-semibold">
              {(monthlyUsage.chatInput / 1000000).toFixed(2)}M
            </div>
            <div className="text-sm text-gray-500">
              tokens
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">
              月度对话输出 Token
            </div>
            <div className="text-2xl font-semibold">
              {(monthlyUsage.chatOutput / 1000000).toFixed(2)}M
            </div>
            <div className="text-sm text-gray-500">
              tokens
            </div>
          </div>
        </div>

        {/* 月度成本明细 */}
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
      </div>
    </div>
  )
} 