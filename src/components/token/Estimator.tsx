'use client'

import { useState, useEffect } from 'react'
import { ModelPriceEditor } from './ModelPriceEditor'
import { EstimationResults } from './EstimationResults'
import { UsageDimensions } from './UsageDimensions'
import { calculateTokensForDocument } from '@/utils/tokenCalculator'
import { NumericInput } from '@/components/ui/NumericInput'

// Token 倍率配置类型
interface TokenMultipliers {
  text: number      // 纯文本基准倍率
  excel: number     // Excel 倍率
  ppt: number       // PPT 倍率
  pdf: number       // PDF 倍率
  image: number     // 图片倍率（每百万像素）
}

// 存储键名
const STORAGE_KEYS = {
  MODELS: 'token_calculator_models',
  SELECTED_CHAT: 'token_calculator_selected_chat',
  SELECTED_EMBEDDING: 'token_calculator_selected_embedding',
  TOKEN_MULTIPLIERS: 'token_calculator_multipliers'
}

// 默认模型配置
const DEFAULT_MODELS = [
  {
    id: 'embedding-3',
    name: 'text-embedding-3-large',
    type: 'embedding' as const,
    inputPrice: 0.00013
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    type: 'chat' as const,
    inputPrice: 0.03,
    outputPrice: 0.06
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    type: 'chat' as const,
    inputPrice: 0.0015,
    outputPrice: 0.002
  }
]

// 添加验证工具函数
const validateNumber = (value: any, step: string, required: boolean = true): number => {
  if (!required && !value) return 0
  const num = Number(value)
  if (isNaN(num)) {
    console.error(`[${step}] Invalid number:`, value)
    throw new Error(`Invalid number at ${step}`)
  }
  return num
}

// 添加缺失的类型定义
interface ModelPrice {
  id: string
  name: string
  type: 'chat' | 'embedding'
  inputPrice: number | ''
  outputPrice?: number | ''
}

export function TokenEstimator({ lang }: { lang: string }) {
  // 从 localStorage 初始化状态
  const [models, setModels] = useState<ModelPrice[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_MODELS
    
    const savedModels = localStorage.getItem(STORAGE_KEYS.MODELS)
    return savedModels ? JSON.parse(savedModels) : DEFAULT_MODELS
  })

  const [selectedChatModelId, setSelectedChatModelId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_MODELS[1].id
    
    const savedId = localStorage.getItem(STORAGE_KEYS.SELECTED_CHAT)
    return savedId || DEFAULT_MODELS[1].id
  })

  const [selectedEmbeddingModelId, setSelectedEmbeddingModelId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_MODELS[0].id
    
    const savedId = localStorage.getItem(STORAGE_KEYS.SELECTED_EMBEDDING)
    return savedId || DEFAULT_MODELS[0].id
  })

  const [tokenMultipliers, setTokenMultipliers] = useState(() => {
    if (typeof window === 'undefined') return {
      text: 1.5,
      excel: 1.67,
      ppt: 2.0,
      pdf: 1.87,
      word: 1.8,
      email: 1.3,
      image: 300,
      audio: 400,
      video: 800
    }
    
    const savedMultipliers = localStorage.getItem(STORAGE_KEYS.TOKEN_MULTIPLIERS)
    return savedMultipliers ? JSON.parse(savedMultipliers) : {
      text: 1.5,
      excel: 1.67,
      ppt: 2.0,
      pdf: 1.87,
      word: 1.8,
      email: 1.3,
      image: 300,
      audio: 400,
      video: 800
    }
  })

  // 保存模型数据到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models))
  }, [models])

  // 保存选中的模型 ID
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CHAT, selectedChatModelId)
  }, [selectedChatModelId])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_EMBEDDING, selectedEmbeddingModelId)
  }, [selectedEmbeddingModelId])

  // 保存 token 倍率
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOKEN_MULTIPLIERS, JSON.stringify(tokenMultipliers))
  }, [tokenMultipliers])

  // 初始化使用量维度状态
  const [initialDimensions, setInitialDimensions] = useState({
    documents: {
      text: '',
      excel: '',
      ppt: '',
      pdf: '',
      word: '',
      email: '',
      image: ''
    },
    avgDocumentLength: {
      text: '',
      excel: '',
      ppt: '',
      pdf: '',
      word: '',
      email: ''
    },
    avgImageCount: '',
    avgImageSize: '',
    teamSize: {
      total: 0,
      activeUsers: 0
    },
    industry: ''
  })

  // 月度使用量维度状态
  const [monthlyDimensions, setMonthlyDimensions] = useState({
    documents: {
      text: '',
      excel: '',
      ppt: '',
      pdf: '',
      word: '',
      email: '',
      image: ''
    },
    avgDocumentLength: {
      text: '',
      excel: '',
      ppt: '',
      pdf: '',
      word: '',
      email: ''
    },
    avgImageCount: '',
    avgImageSize: '',
    dailyQueries: '',
    conversationTurns: ''
  })

  // 将函数移到组件内部
  const handleModelsChange = (newModels: ModelPrice[]) => {
    setModels(newModels)
    
    // 如果删除了当前选中的模型，选择同类型的第一个模型
    const embeddingModels = newModels.filter(m => m.type === 'embedding')
    const chatModels = newModels.filter(m => m.type === 'chat')

    if (!newModels.find(m => m.id === selectedEmbeddingModelId) && embeddingModels.length > 0) {
      setSelectedEmbeddingModelId(embeddingModels[0].id)
    }

    if (!newModels.find(m => m.id === selectedChatModelId) && chatModels.length > 0) {
      setSelectedChatModelId(chatModels[0].id)
    }
  }

  const calculateInitialUsage = (dims: typeof initialDimensions) => {
    let totalEmbeddingTokens = 0

    // 计算文档 token
    Object.entries(dims.documents).forEach(([docType, count]) => {
      if (!count) return
      const numericCount = Number(count)
      const length = Number(dims.avgDocumentLength[docType]) || 0
      const tokens = numericCount * length * tokenMultipliers[docType]
      totalEmbeddingTokens += tokens
    })

    // 计算团队个人文档
    if (dims.teamSize?.activeUsers) {
      const personalDocsTokens = dims.teamSize.activeUsers * 50 * 2000 * tokenMultipliers.text
      totalEmbeddingTokens += personalDocsTokens
    }

    // 行业复杂度调整
    if (dims.industry) {
      const industryMultipliers = {
        education: 1.2,
        finance: 1.3,
        healthcare: 1.4,
        manufacturing: 1.1,
        retail: 1.0
      }
      totalEmbeddingTokens *= industryMultipliers[dims.industry] || 1.0
    }

    return {
      embedding: totalEmbeddingTokens,
      documents: dims.documents,
      avgDocumentLength: dims.avgDocumentLength,
      teamSize: dims.teamSize,
      industry: dims.industry
    }
  }

  const calculateMonthlyUsage = (dims: typeof monthlyDimensions) => {
    let monthlyEmbeddingTokens = 0
    let monthlyChatInputTokens = 0
    let monthlyChatOutputTokens = 0

    // 计算新增文档的向量化
    Object.entries(dims.documents).forEach(([docType, count]) => {
      if (!count) return
      const numericCount = Number(count)
      const length = Number(dims.avgDocumentLength[docType]) || 0
      const tokens = numericCount * length * tokenMultipliers[docType]
      monthlyEmbeddingTokens += tokens
    })

    // 计算对话 token
    const dailyQueries = Number(dims.dailyQueries) || 0
    const conversationTurns = Number(dims.conversationTurns) || 0
    const monthlyQueries = dailyQueries * 30

    const tokensPerQuery = {
      input: 200,
      context: 2000,
      systemPrompt: 300,
      outputMultiplier: 0.7
    }

    const tokensPerConversation = 
      (tokensPerQuery.input + tokensPerQuery.context + tokensPerQuery.systemPrompt) * 
      conversationTurns

    monthlyChatInputTokens = monthlyQueries * tokensPerConversation
    monthlyChatOutputTokens = monthlyChatInputTokens * tokensPerQuery.outputMultiplier

    return {
      embedding: monthlyEmbeddingTokens,
      chatInput: monthlyChatInputTokens,
      chatOutput: monthlyChatOutputTokens,
      documents: dims.documents,
      avgDocumentLength: dims.avgDocumentLength
    }
  }

  const calculateCost = (initialUsage: any, monthlyUsage: any) => {
    const selectedEmbeddingModel = models.find(m => m.id === selectedEmbeddingModelId)
    const selectedChatModel = models.find(m => m.id === selectedChatModelId)

    if (!selectedEmbeddingModel || !selectedChatModel) {
      throw new Error('No model selected')
    }

    const embeddingPrice = Number(selectedEmbeddingModel.inputPrice)
    const chatInputPrice = Number(selectedChatModel.inputPrice)
    const chatOutputPrice = Number(selectedChatModel.outputPrice || selectedChatModel.inputPrice)

    const initialEmbeddingCost = (initialUsage.embedding / 1000000) * embeddingPrice

    const monthlyEmbeddingCost = (monthlyUsage.embedding / 1000000) * embeddingPrice
    const monthlyChatInputCost = (monthlyUsage.chatInput / 1000000) * chatInputPrice
    const monthlyChatOutputCost = (monthlyUsage.chatOutput / 1000000) * chatOutputPrice

    return {
      initial: {
        embedding: initialEmbeddingCost,
        total: initialEmbeddingCost
      },
      monthly: {
        embedding: monthlyEmbeddingCost,
        chatInput: monthlyChatInputCost,
        chatOutput: monthlyChatOutputCost,
        total: monthlyEmbeddingCost + monthlyChatInputCost + monthlyChatOutputCost
      }
    }
  }

  // 渲染 Token 倍率配置部分
  const renderTokenMultipliers = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Token 倍率配置
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(tokenMultipliers).map(([type, multiplier]) => {
          const labels = {
            text: '纯文本倍率',
            excel: 'Excel 倍率',
            ppt: 'PPT 倍率',
            pdf: 'PDF 倍率',
            word: 'Word 倍率',
            email: '邮件倍率',
            image: '图片倍率',
            audio: '音频倍率',
            video: '视频倍率'
          }
          const descriptions = {
            text: '基准倍率 (tokens/字符)',
            excel: '表格结构处理倍率',
            ppt: '布局和图片处理倍率',
            pdf: '格式处理倍率',
            word: 'Word 文档格式处理倍率',
            email: '邮件文档处理倍率',
            image: '每百万像素的 token 数',
            audio: '每分钟音频的 token 数',
            video: '每分钟视频的 token 数'
          }
          const units = {
            text: 'tokens/字符',
            excel: 'tokens/字符',
            ppt: 'tokens/字符',
            pdf: 'tokens/字符',
            word: 'tokens/字符',
            email: 'tokens/字符',
            image: 'tokens/百万像素',
            audio: 'tokens/分钟',
            video: 'tokens/分钟'
          }

          return (
            <div key={type} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {labels[type]}
              </label>
              <NumericInput
                value={multiplier}
                onChange={(value) => {
                  setTokenMultipliers(prev => ({
                    ...prev,
                    [type]: value as number
                  }))
                }}
                step={type === 'image' || type === 'audio' || type === 'video' ? 10 : 0.1}
                min={0.1}
              />
              <div className="flex flex-col space-y-1">
                <p className="text-xs text-gray-500">
                  {descriptions[type]}
                </p>
                <p className="text-xs text-gray-400">
                  {units[type]}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-6 text-sm text-gray-500">
        这些倍率会影响最终的 token 消耗计算
      </p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ModelPriceEditor
          models={models}
          onModelsChange={handleModelsChange}
          selectedChatModelId={selectedChatModelId}
          selectedEmbeddingModelId={selectedEmbeddingModelId}
          onSelectChatModel={setSelectedChatModelId}
          onSelectEmbeddingModel={setSelectedEmbeddingModelId}
        />
      </div>

      {/* Token 倍率配置 */}
      {renderTokenMultipliers()}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          初始化使用量
        </h3>
        <UsageDimensions
          dimensions={initialDimensions}
          onChange={setInitialDimensions}
          type="initial"
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          月度使用量
        </h3>
        <UsageDimensions
          dimensions={monthlyDimensions}
          onChange={setMonthlyDimensions}
          type="monthly"
        />
      </div>

      {/* 预估结果 */}
      <EstimationResults 
        initialUsage={calculateInitialUsage(initialDimensions)}
        monthlyUsage={calculateMonthlyUsage(monthlyDimensions)}
        costs={calculateCost(
          calculateInitialUsage(initialDimensions),
          calculateMonthlyUsage(monthlyDimensions)
        )}
        teamSize={initialDimensions.teamSize}
        industry={initialDimensions.industry}
      />
    </div>
  )
} 