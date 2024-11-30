'use client'

import { useState } from 'react'
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
    selectedTemplate?: string
  }
  onChange: (dimensions: any) => void
  type: 'initial' | 'monthly'
}

export function UsageDimensions({
  dimensions,
  onChange,
  type
}: UsageDimensionsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(dimensions.selectedTemplate || '')

  const docTypes = {
    text: '纯文本文档',
    excel: 'Excel 文档',
    ppt: 'PPT 文档',
    pdf: 'PDF 文档',
    word: 'Word 文档',
    email: '邮件文档',
    image: '图片文件'
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    
    const templates = {
      university: {
        documents: {
          text: 20000,
          excel: 15000,
          ppt: 10000,
          pdf: 20000,
          word: 25000,
          email: 5000,
          image: 1000
        },
        avgDocumentLength: {
          text: 2000,
          excel: 5000,
          ppt: 1000,
          pdf: 3000,
          word: 2500,
          email: 800
        },
        teamSize: {
          total: 1000,
          activeUsers: 300
        },
        monthlyGrowthRate: 0.10,
        queriesPerActiveUser: 5,
        turnsPerQuery: 5,
        selectedTemplate: 'university'
      },
      k12: {
        documents: {
          text: 5000,
          excel: 3000,
          ppt: 2000,
          pdf: 5000,
          word: 5000,
          email: 1000,
          image: 500
        },
        avgDocumentLength: {
          text: 1500,
          excel: 3000,
          ppt: 800,
          pdf: 2000,
          word: 2000,
          email: 500
        },
        teamSize: {
          total: 200,
          activeUsers: 60
        },
        monthlyGrowthRate: 0.05,
        queriesPerActiveUser: 4,
        turnsPerQuery: 4
      },
      bank: {
        documents: {
          text: 30000,
          excel: 25000,
          ppt: 5000,
          pdf: 30000,
          word: 20000,
          email: 10000,
          image: 2000
        },
        avgDocumentLength: {
          text: 3000,
          excel: 8000,
          ppt: 1500,
          pdf: 4000,
          word: 3500,
          email: 1000
        },
        teamSize: {
          total: 500,
          activeUsers: 150
        },
        monthlyGrowthRate: 0.15,
        queriesPerActiveUser: 6,
        turnsPerQuery: 6
      },
      hospital: {
        documents: {
          text: 25000,
          excel: 20000,
          ppt: 3000,
          pdf: 35000,
          word: 30000,
          email: 8000,
          image: 5000
        },
        avgDocumentLength: {
          text: 2500,
          excel: 6000,
          ppt: 1200,
          pdf: 3500,
          word: 3000,
          email: 800
        },
        teamSize: {
          total: 800,
          activeUsers: 240
        },
        monthlyGrowthRate: 0.08,
        queriesPerActiveUser: 7,
        turnsPerQuery: 5
      },
      government: {
        documents: {
          text: 40000,
          excel: 30000,
          ppt: 8000,
          pdf: 45000,
          word: 35000,
          email: 15000,
          image: 3000
        },
        avgDocumentLength: {
          text: 3500,
          excel: 7000,
          ppt: 1800,
          pdf: 4500,
          word: 4000,
          email: 1200
        },
        teamSize: {
          total: 2000,
          activeUsers: 600
        },
        monthlyGrowthRate: 0.05,
        queriesPerActiveUser: 4,
        turnsPerQuery: 5
      },
      manufacturing: {
        documents: {
          text: 15000,
          excel: 35000,
          ppt: 4000,
          pdf: 25000,
          word: 15000,
          email: 7000,
          image: 4000
        },
        avgDocumentLength: {
          text: 2000,
          excel: 10000,
          ppt: 1500,
          pdf: 3000,
          word: 2500,
          email: 700
        },
        teamSize: {
          total: 600,
          activeUsers: 180
        },
        monthlyGrowthRate: 0.12,
        queriesPerActiveUser: 5,
        turnsPerQuery: 4
      }
    }

    const templateData = templates[template]
    if (templateData) {
      onChange({
        ...dimensions,
        ...templateData,
        selectedTemplate: template
      })
    }
  }

  const handleDocumentChange = (type: string, value: number | '') => {
    onChange({
      ...dimensions,
      documents: {
        ...dimensions.documents,
        [type]: value
      }
    })
  }

  const handleLengthChange = (type: string, value: number | '') => {
    onChange({
      ...dimensions,
      avgDocumentLength: {
        ...dimensions.avgDocumentLength,
        [type]: value
      }
    })
  }

  const calculateTokens = (type: string) => {
    const count = Number(dimensions.documents[type]) || 0
    const length = Number(dimensions.avgDocumentLength[type]) || 0
    const multiplier = {
      text: 1.5,
      excel: 1.67,
      ppt: 2.0,
      pdf: 1.87,
      word: 1.8,
      email: 1.3,
      image: 300  // 图片按每百万像素计算
    }
    const tokens = count * length * multiplier[type]
    return (tokens / 1000000).toFixed(2) + 'M'
  }

  return (
    <div className="space-y-8">
      {/* 1. 行业模板选择 - 最高优先级 */}
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-4">选择行业模板</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleTemplateSelect('university')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedTemplate === 'university'
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <h5 className="text-lg font-medium mb-2">高等院校</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 1,000人团队规模</p>
              <p>• 95,000份各类文档</p>
              <p>• 适用于大学、研究所</p>
            </div>
          </button>
          <button
            onClick={() => handleTemplateSelect('k12')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedTemplate === 'k12'
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <h5 className="text-lg font-medium mb-2">中小学校</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 200人团队规模</p>
              <p>• 21,500份各类文档</p>
              <p>• 适用于K12教育机构</p>
            </div>
          </button>
          <button
            onClick={() => handleTemplateSelect('bank')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedTemplate === 'bank'
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <h5 className="text-lg font-medium mb-2">银行</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 500人团队规模</p>
              <p>• 122,000份各类文档</p>
              <p>• 适用于银行和金融机构</p>
            </div>
          </button>
          <button
            onClick={() => handleTemplateSelect('hospital')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedTemplate === 'hospital'
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <h5 className="text-lg font-medium mb-2">医疗机构</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 800人团队规模</p>
              <p>• 126,000份各类文档</p>
              <p>• 适用于医院、诊所</p>
            </div>
          </button>
          <button
            onClick={() => handleTemplateSelect('government')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedTemplate === 'government'
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <h5 className="text-lg font-medium mb-2">政府机构</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 2,000人团队规模</p>
              <p>• 176,000份各类文档</p>
              <p>• 适用于政府部门</p>
            </div>
          </button>
          <button
            onClick={() => handleTemplateSelect('manufacturing')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedTemplate === 'manufacturing'
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <h5 className="text-lg font-medium mb-2">制造业</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 600人团队规模</p>
              <p>• 105,000份各类文档</p>
              <p>• 适用于制造企业</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. 团队规模配置 - 次优先级 */}
      <div className="border-t border-gray-200 pt-8">
        <h4 className="text-base font-medium text-gray-900 mb-4">团队规模</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              团队总人数
            </label>
            <NumericInput
              value={dimensions.teamSize?.total}
              onChange={(value) => onChange({
                ...dimensions,
                teamSize: {
                  ...dimensions.teamSize,
                  total: value,
                  activeUsers: Math.round((value as number) * 0.3) // 默认30%的活跃度
                }
              })}
              placeholder="请输入总人数"
            />
            <p className="mt-2 text-xs text-gray-500">
              企业中可能使用该系统的总人数
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预计活跃用户
            </label>
            <NumericInput
              value={dimensions.teamSize?.activeUsers}
              onChange={(value) => onChange({
                ...dimensions,
                teamSize: {
                  ...dimensions.teamSize,
                  total: dimensions.teamSize?.total || 0,
                  activeUsers: value
                }
              })}
              placeholder="请输入活跃用户数"
            />
            <p className="mt-2 text-xs text-gray-500">
              经常使用系统的用户数量（建议为总人数的30%左右）
            </p>
          </div>
        </div>
      </div>

      {/* 3. 文档配置 - 使用更简单的交互提示 */}
      <div className="border-t border-gray-200 pt-8">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                <svg 
                  className="w-4 h-4 text-gray-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">文档详细配置</h4>
                <p className="text-sm text-gray-500 mt-1">点击展开配置各类型文档的详细信息</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              总文档数：{Object.values(dimensions.documents).reduce((sum, val) => sum + (Number(val) || 0), 0).toLocaleString()} 份
            </div>
          </summary>

          <div className="mt-4">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      文档类型
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      数量（份）
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      平均字符数
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      预计Token
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(docTypes).map(([type, label]) => (
                    <tr key={type} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">{label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32">
                          <NumericInput
                            value={dimensions.documents[type]}
                            onChange={(value) => handleDocumentChange(type, value)}
                            placeholder="数量"
                            className="text-right"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {type !== 'image' ? (
                          <div className="w-32">
                            <NumericInput
                              value={dimensions.avgDocumentLength[type]}
                              onChange={(value) => handleLengthChange(type, value)}
                              placeholder="字符数"
                              className="text-right"
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {calculateTokens(type)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900">
                      总计
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-600">
                      {Object.keys(docTypes).reduce((sum, type) => {
                        const tokens = Number(calculateTokens(type).replace('M', ''))
                        return sum + tokens
                      }, 0).toFixed(2)}M tokens
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </details>
      </div>
    </div>
  )
} 