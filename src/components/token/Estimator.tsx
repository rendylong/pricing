'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui/Select'
import Link from 'next/link'
import { ModelSelector } from './ModelSelector'
import { ScenarioSelector } from './ScenarioSelector'

interface TokenUsage {
  chat: {
    input: number
    output: number
  }
  embedding: {
    input: number
  }
}

interface EstimationDimension {
  id: string
  name: string
  description: string
  defaultValue: number
  unit: string
  modelType: 'embedding' | 'chat'
  tokensPerUnit: number
  frequency?: number
}

const estimationDimensions: EstimationDimension[] = [
  {
    id: 'employees',
    name: '员工数量',
    description: '企业中会使用系统的员工数量',
    defaultValue: 100,
    unit: '人',
    modelType: 'chat',
    tokensPerUnit: 1000,
    frequency: 20
  },
  {
    id: 'documents',
    name: '文档数量',
    description: '需要进行向量化的文档数量',
    defaultValue: 1000,
    unit: '份',
    modelType: 'embedding',
    tokensPerUnit: 2000
  },
  {
    id: 'documentLength',
    name: '平均文档长度',
    description: '每份文档的平均字数（以中文字符计）',
    defaultValue: 2000,
    unit: '字',
    modelType: 'embedding',
    tokensPerUnit: 1.5
  },
  {
    id: 'dailyQueries',
    name: '日均查询量',
    description: '每天的平均查询次数',
    defaultValue: 500,
    unit: '次',
    modelType: 'chat',
    tokensPerUnit: 500
  },
  {
    id: 'conversationTurns',
    name: '对话轮次',
    description: '每次查询的平均对话轮次',
    defaultValue: 3,
    unit: '轮',
    modelType: 'chat',
    tokensPerUnit: 300,
    frequency: 1
  }
]

export function TokenEstimator() {
  const { t } = useTranslation()
  const [dimensions, setDimensions] = useState(estimationDimensions)
  const [selectedChatModel, setSelectedChatModel] = useState('gpt-3.5-turbo')
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState('text-embedding-3-large')

  // 计算 token 使用量
  const calculateTokenUsage = (): TokenUsage => {
    const usage = {
      chat: {
        input: 0,
        output: 0
      },
      embedding: {
        input: 0
      }
    }

    dimensions.forEach(dim => {
      const value = (dim as any).currentValue || dim.defaultValue
      const monthlyUsage = value * dim.tokensPerUnit * (dim.frequency || 1)
      
      if (dim.modelType === 'chat') {
        usage.chat.input += monthlyUsage
        usage.chat.output += monthlyUsage * 0.5 // 假设输出是输入的一半
      } else {
        usage.embedding.input += monthlyUsage
      }
    })

    return usage
  }

  const usage = calculateTokenUsage()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {t('pricing.tokenEstimator.title')}
        </h1>
        <Link 
          href="/"
          className="text-primary-600 hover:text-primary-700"
        >
          {t('pricing.calculator.title')}
        </Link>
      </div>

      {/* 模型选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ModelSelector
          chatModel={selectedChatModel}
          embeddingModel={selectedEmbeddingModel}
          onChatModelChange={setSelectedChatModel}
          onEmbeddingModelChange={setSelectedEmbeddingModel}
        />
      </div>

      {/* 评估维度输入 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dimensions.map(dim => (
          <div key={dim.id} className="space-y-2 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  {dim.name}
                </label>
                <p className="text-sm text-gray-500">{dim.description}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800">
                {dim.modelType === 'chat' ? 'Chat' : 'Embedding'}
              </span>
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                defaultValue={dim.defaultValue}
                onChange={(e) => {
                  const newDimensions = dimensions.map(d => 
                    d.id === dim.id 
                      ? { ...d, currentValue: Number(e.target.value) }
                      : d
                  )
                  setDimensions(newDimensions)
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <span className="inline-flex items-center px-3 rounded-md border border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {dim.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 使用量和成本估算 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('pricing.tokenEstimator.results')}
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Chat Input</div>
              <div className="text-2xl font-semibold">
                {(usage.chat.input / 1000000).toFixed(2)}M
              </div>
              <div className="text-sm text-gray-500">tokens</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Chat Output</div>
              <div className="text-2xl font-semibold">
                {(usage.chat.output / 1000000).toFixed(2)}M
              </div>
              <div className="text-sm text-gray-500">tokens</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Embedding</div>
              <div className="text-2xl font-semibold">
                {(usage.embedding.input / 1000000).toFixed(2)}M
              </div>
              <div className="text-sm text-gray-500">tokens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 