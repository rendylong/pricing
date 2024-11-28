'use client'

import { NumericInput } from '@/components/ui/NumericInput'
import { Select } from '@/components/ui/Select'

interface UsageDimensionsProps {
  dimensions: {
    documents: Record<string, string | number>
    avgDocumentLength: Record<string, string | number>
    avgImageCount?: string | number
    avgImageSize?: string | number
    avgAudioLength?: string | number
    avgVideoLength?: string | number
    teamSize?: {
      total: number
      activeUsers: number
    }
    industry?: string
    dailyQueries?: string | number
    conversationTurns?: string | number
  }
  onChange: (dimensions: any) => void
  type: 'initial' | 'monthly'
}

export function UsageDimensions({
  dimensions,
  onChange,
  type
}: UsageDimensionsProps) {
  const docTypes = {
    text: '纯文本文档',
    excel: 'Excel 文档',
    ppt: 'PPT 文档',
    pdf: 'PDF 文档',
    word: 'Word 文档',
    email: '邮件文档',
    image: '图片文件'
  }

  const industries = {
    education: '教育行业',
    finance: '金融行业',
    healthcare: '医疗行业',
    manufacturing: '制造业',
    retail: '零售业'
  }

  return (
    <div className="space-y-8">
      {/* 文档数量和长度 */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">文档统计</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(docTypes).map(([type, label]) => (
            <div key={type} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {label}数量
                </label>
                <NumericInput
                  value={dimensions.documents[type]}
                  onChange={(value) => {
                    onChange({
                      ...dimensions,
                      documents: {
                        ...dimensions.documents,
                        [type]: value
                      }
                    })
                  }}
                  placeholder="请输入数量"
                />
                <p className="mt-1 text-xs text-gray-500">
                  需要处理的{label}数量
                </p>
              </div>
              {type !== 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    平均长度
                  </label>
                  <NumericInput
                    value={dimensions.avgDocumentLength[type]}
                    onChange={(value) => {
                      onChange({
                        ...dimensions,
                        avgDocumentLength: {
                          ...dimensions.avgDocumentLength,
                          [type]: value
                        }
                      })
                    }}
                    placeholder="请输入字符数"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    每份文档的平均字符数
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 图片相关配置 */}
      {(dimensions.documents.ppt || dimensions.documents.pdf || dimensions.documents.image) && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">图片配置</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(dimensions.documents.ppt || dimensions.documents.pdf) && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  平均图片数量
                </label>
                <NumericInput
                  value={dimensions.avgImageCount}
                  onChange={(value) => onChange({ ...dimensions, avgImageCount: value })}
                  placeholder="请输入数量"
                />
                <p className="mt-1 text-xs text-gray-500">
                  每份文档包含的平均图片数量
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                图片平均大小
              </label>
              <NumericInput
                value={dimensions.avgImageSize}
                onChange={(value) => onChange({ ...dimensions, avgImageSize: value })}
                placeholder="请输入大小"
              />
              <p className="mt-1 text-xs text-gray-500">
                图片的平均大小（百万像素）
              </p>
            </div>
          </div>
        </div>
      )}

      {type === 'initial' && (
        <>
          {/* 团队规模 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">团队规模</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  团队总人数
                </label>
                <NumericInput
                  value={dimensions.teamSize?.total}
                  onChange={(value) => onChange({
                    ...dimensions,
                    teamSize: {
                      ...dimensions.teamSize,
                      total: value
                    }
                  })}
                  placeholder="请输入人数"
                />
                <p className="mt-1 text-xs text-gray-500">
                  团队的总人数
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  活跃用户数
                </label>
                <NumericInput
                  value={dimensions.teamSize?.activeUsers}
                  onChange={(value) => onChange({
                    ...dimensions,
                    teamSize: {
                      ...dimensions.teamSize,
                      activeUsers: value
                    }
                  })}
                  placeholder="请输入人数"
                />
                <p className="mt-1 text-xs text-gray-500">
                  经常使用系统的用户数量
                </p>
              </div>
            </div>
          </div>

          {/* 所属行业 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">所属行业</h4>
            <Select
              value={dimensions.industry}
              onChange={(e) => onChange({ ...dimensions, industry: e.target.value })}
              className="w-full"
            >
              <option value="">请选择行业</option>
              {Object.entries(industries).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <p className="mt-1 text-xs text-gray-500">
              不同行业的文档复杂度不同
            </p>
          </div>
        </>
      )}

      {type === 'monthly' && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">使用量配置</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                日均查询量
              </label>
              <NumericInput
                value={dimensions.dailyQueries}
                onChange={(value) => onChange({ ...dimensions, dailyQueries: value })}
                placeholder="请输入查询次数"
              />
              <p className="mt-1 text-xs text-gray-500">
                每天预计的查询次数
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                对话轮次
              </label>
              <NumericInput
                value={dimensions.conversationTurns}
                onChange={(value) => onChange({ ...dimensions, conversationTurns: value })}
                placeholder="请输入轮次"
              />
              <p className="mt-1 text-xs text-gray-500">
                每次查询的平均对话来回次数
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 