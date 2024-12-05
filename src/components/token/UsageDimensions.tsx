'use client'

import { useState } from 'react'
import { NumericInput } from '@/components/ui/NumericInput'

interface Dimensions {
  documents: Record<string, string>;
  avgDocumentLength: Record<string, string>;
  teamSize: {
    total: number;
    activeUsers: number;
  };
  selectedTemplate?: string;
  avgImageSize?: string | number;
  [key: string]: unknown;
}

interface UsageDimensionsProps {
  dimensions: Dimensions;
  onChange: (dimensions: Dimensions) => void;
  type: 'initial' | 'monthly';
}

export function UsageDimensions({ dimensions, onChange, type }: UsageDimensionsProps) {
  const docTypes = {
    text: '纯文本文档',
    excel: 'Excel 文档',
    ppt: 'PPT 文档',
    pdf: 'PDF 文档',
    word: 'Word 文档',
    email: '邮件文档',
    image: '图片文件'
  }

  const handleDocumentChange = (type: string, value: number | '') => {
    onChange({
      ...dimensions,
      documents: {
        ...dimensions.documents,
        [type]: value.toString()
      }
    })
  }

  const handleLengthChange = (type: string, value: number | '') => {
    onChange({
      ...dimensions,
      avgDocumentLength: {
        ...dimensions.avgDocumentLength,
        [type]: value.toString()
      }
    })
  }

  const calculateTokens = (type: keyof typeof docTypes) => {
    const count = Number(dimensions.documents[type]) || 0
    const length = Number(dimensions.avgDocumentLength[type]) || 0
    const multiplier: Record<string, number> = {
      text: 1.5,
      excel: 1.67,
      ppt: 2.0,
      pdf: 1.87,
      word: 1.8,
      email: 1.3,
      image: 300  // 图片按每百万像素计算
    }
    const tokens = count * length * multiplier[type]
    if (isNaN(tokens)) return '0M'
    return (tokens / 1000000).toFixed(2) + 'M'
  }

  const calculateTotalTokens = () => {
    const total = Object.keys(docTypes).reduce((sum, type) => {
      const tokenStr = calculateTokens(type as keyof typeof docTypes)
      const tokens = Number(tokenStr.replace('M', '')) || 0
      return sum + tokens
    }, 0)
    return total.toFixed(2) + 'M'
  }

  const calculateTotalDocuments = () => {
    return Object.values(dimensions.documents).reduce((sum, val) => {
      const num = Number(val) || 0
      return sum + num
    }, 0).toLocaleString()
  }

  const showMonthlyFields = type === 'monthly'

  return (
    <div className="space-y-6">
      {/* 2. 团队规模配置 - 次优先级 */}
      <div className="border-t border-gray-200 pt-8">
        <h4 className="text-base font-medium text-gray-900 mb-4">团队规模</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              团队总人数
            </label>
            <NumericInput
              value={dimensions.teamSize?.total || ''}
              onChange={(value: number | '') => onChange({
                ...dimensions,
                teamSize: {
                  ...dimensions.teamSize,
                  total: value as number,
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
              value={dimensions.teamSize?.activeUsers || ''}
              onChange={(value: number | '') => onChange({
                ...dimensions,
                teamSize: {
                  ...dimensions.teamSize,
                  total: dimensions.teamSize?.total || 0,
                  activeUsers: value as number
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

      {/* 3. 文档配置 - 使用列表样式 */}
      <div className="border-t border-gray-200 pt-8">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                <svg 
                  className="w-4 h-4 text-gray-500 transform group-open:rotate-180 transition-transform" 
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
              总文档数：{calculateTotalDocuments()} 份
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
                            value={dimensions.documents[type as keyof typeof dimensions.documents] || ''}
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
                              value={dimensions.avgDocumentLength[type as keyof typeof dimensions.avgDocumentLength] || ''}
                              onChange={(value) => handleLengthChange(type, value)}
                              placeholder="字符数"
                              className="text-right"
                            />
                          </div>
                        ) : (
                          <div className="w-32">
                            <NumericInput
                              value={dimensions.avgImageSize || ''}
                              onChange={(value) => onChange({
                                ...dimensions,
                                avgImageSize: value
                              })}
                              placeholder="像素数"
                              className="text-right"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {calculateTokens(type as keyof typeof docTypes)}
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
                      {calculateTotalTokens()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </details>
      </div>

      {showMonthlyFields && (
        <div>
          {/* 月度特有的配置项 */}
        </div>
      )}
    </div>
  )
} 