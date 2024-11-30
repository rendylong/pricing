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

// 添加行业特性配置
const INDUSTRY_PATTERNS = {
  university: {
    description: '高等院校的知识库通常包含大量的教学资料、研究论文、行政文档等。每位教职工平均每天会有3-5次查询，每次对话4-6轮。',
    monthlyGrowthRate: 0.10,
    queriesPerActiveUser: 5,
    turnsPerQuery: 5
  },
  k12: {
    description: '中小学校的知识库主要包含教案、试题、学生作业等教学资料。教师平均每天有2-4次查询，每次对话3-5轮。',
    monthlyGrowthRate: 0.05,
    queriesPerActiveUser: 3,
    turnsPerQuery: 4
  },
  bank: {
    description: '银行的知识库包含大量的金融产品文档、操作手册、合规文件等。每位员工平均每天有4-6次查询，每次对话5-7轮。',
    monthlyGrowthRate: 0.15,
    queriesPerActiveUser: 5,
    turnsPerQuery: 6
  },
  hospital: {
    description: '医疗机构的知识库包含医疗指南、病例记录、治疗方案等专业资料。医护人员平均每天有5-8次查询，每次对话4-6轮。',
    monthlyGrowthRate: 0.08,
    queriesPerActiveUser: 7,
    turnsPerQuery: 5
  },
  government: {
    description: '政府机构的知识库包含政策文件、工作指南、档案资料等。工作人员平均每天有3-5次查询，每次对话4-6轮。',
    monthlyGrowthRate: 0.05,
    queriesPerActiveUser: 4,
    turnsPerQuery: 5
  },
  manufacturing: {
    description: '制造业的知识库包含技术规范、操作手册、质量标准等文档。技术人员平均每天有4-6次查询，每次对话3-5轮。',
    monthlyGrowthRate: 0.12,
    queriesPerActiveUser: 5,
    turnsPerQuery: 4
  }
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

  // 保存中的模型 ID
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

  const [monthlyPattern, setMonthlyPattern] = useState({
    monthlyGrowthRate: 0.10,
    queriesPerActiveUser: 5,
    turnsPerQuery: 5
  })

  const handlePatternChange = (updates: Partial<typeof monthlyPattern>) => {
    setMonthlyPattern(prev => ({
      ...prev,
      ...updates
    }))
  }

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
      const multiplier = tokenMultipliers[docType]
      const tokens = numericCount * length * multiplier
      totalEmbeddingTokens += tokens
    })

    // 计算团队个人文档
    if (dims.teamSize?.activeUsers) {
      const personalDocsTokens = dims.teamSize.activeUsers * 50 * 2000 * tokenMultipliers.text
      totalEmbeddingTokens += personalDocsTokens
    }

    return {
      embedding: totalEmbeddingTokens,
      documents: dims.documents,
      avgDocumentLength: dims.avgDocumentLength,
      teamSize: dims.teamSize,
      multipliers: tokenMultipliers
    }
  }

  const calculateMonthlyUsage = (dims: typeof monthlyDimensions) => {
    const selectedTemplate = dims.selectedTemplate || 'university'
    const pattern = INDUSTRY_PATTERNS[selectedTemplate]

    let monthlyEmbeddingTokens = 0
    let monthlyChatInputTokens = 0
    let monthlyChatOutputTokens = 0

    // 计算新增文档的向量化
    Object.entries(initialDimensions.documents).forEach(([docType, count]) => {
      if (!count) return
      const numericCount = Number(count)
      const length = Number(initialDimensions.avgDocumentLength[docType]) || 0
      const multiplier = tokenMultipliers[docType]
      const growthRate = pattern.monthlyGrowthRate
      const monthlyNewCount = Math.round(numericCount * growthRate)
      const tokens = monthlyNewCount * length * multiplier
      monthlyEmbeddingTokens += tokens
    })

    // 计算对话 token
    const activeUsers = initialDimensions.teamSize?.activeUsers || 0
    const queriesPerUser = pattern.queriesPerActiveUser
    const turnsPerQuery = pattern.turnsPerQuery
    const monthlyQueries = activeUsers * queriesPerUser * 30

    const tokensPerQuery = {
      input: 200,    // 用户输入的平均token数
      context: 2000, // 上下文的平均token数
      systemPrompt: 300, // 系统提示的token数
      outputMultiplier: 0.7 // 输出token与输入token的比例
    }

    const tokensPerConversation = 
      (tokensPerQuery.input + tokensPerQuery.context + tokensPerQuery.systemPrompt) * 
      turnsPerQuery

    monthlyChatInputTokens = monthlyQueries * tokensPerConversation
    monthlyChatOutputTokens = monthlyChatInputTokens * tokensPerQuery.outputMultiplier

    return {
      embedding: monthlyEmbeddingTokens,
      chatInput: monthlyChatInputTokens,
      chatOutput: monthlyChatOutputTokens,
      documents: dims.documents,
      avgDocumentLength: dims.avgDocumentLength,
      pattern: {
        monthlyGrowthRate: pattern.monthlyGrowthRate,
        queriesPerActiveUser: pattern.queriesPerActiveUser,
        turnsPerQuery: pattern.turnsPerQuery,
        description: pattern.description,
        embeddingMultiplier: 1.5,
        outputMultiplier: tokensPerQuery.outputMultiplier
      },
      tokensPerQuery
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
            pdf: '格式处理倍',
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

  // 监听模板变化，更新使用模式
  useEffect(() => {
    const template = initialDimensions.selectedTemplate || 'university'
    const pattern = INDUSTRY_PATTERNS[template]
    if (pattern) {
      setMonthlyPattern({
        monthlyGrowthRate: pattern.monthlyGrowthRate,
        queriesPerActiveUser: pattern.queriesPerActiveUser,
        turnsPerQuery: pattern.turnsPerQuery
      })
    }
  }, [initialDimensions.selectedTemplate])

  // 添加计算结果的状态
  const [calculationResult, setCalculationResult] = useState<{
    initialUsage: any;
    monthlyUsage: any;
    costs: any;
    modelPrices: any;
  } | null>(null);

  // 计算函数
  const handleCalculate = () => {
    // 获取选中的模型
    const selectedEmbeddingModel = models.find(m => m.id === selectedEmbeddingModelId);
    const selectedChatModel = models.find(m => m.id === selectedChatModelId);

    if (!selectedEmbeddingModel || !selectedChatModel) {
      console.error('Selected models not found');
      return;
    }

    const initial = calculateInitialUsage(initialDimensions);
    const monthly = calculateMonthlyUsage(monthlyDimensions);
    const costs = calculateCost(initial, monthly);
    
    setCalculationResult({
      initialUsage: initial,
      monthlyUsage: monthly,
      costs: costs,
      modelPrices: {
        embedding: selectedEmbeddingModel.inputPrice,
        chatInput: selectedChatModel.inputPrice,
        chatOutput: selectedChatModel.outputPrice || selectedChatModel.inputPrice
      }
    });
  };

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

      {/* 新增：月度使用量配置 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          月度使用量配置
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">使用模式配置</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月度文档增长率
                </label>
                <NumericInput
                  value={monthlyPattern.monthlyGrowthRate * 100}
                  onChange={(value) => handlePatternChange({ 
                    monthlyGrowthRate: (value as number) / 100 
                  })}
                  min={1}
                  max={100}
                  step={1}
                />
                <p className="mt-1 text-xs text-gray-500">
                  每月新增文档占现有文档的百分比
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  人均日查询次数
                </label>
                <NumericInput
                  value={monthlyPattern.queriesPerActiveUser}
                  onChange={(value) => handlePatternChange({ 
                    queriesPerActiveUser: value as number 
                  })}
                  min={1}
                  max={20}
                  step={1}
                />
                <p className="mt-1 text-xs text-gray-500">
                  每个活跃用户的日均查询次数
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  平均对话轮次
                </label>
                <NumericInput
                  value={monthlyPattern.turnsPerQuery}
                  onChange={(value) => handlePatternChange({ 
                    turnsPerQuery: value as number 
                  })}
                  min={1}
                  max={10}
                  step={1}
                />
                <p className="mt-1 text-xs text-gray-500">
                  每次查询的平均对话来回次数
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-2">行业参考值</h5>
            <div className="text-sm text-gray-600">
              {INDUSTRY_PATTERNS[initialDimensions.selectedTemplate || 'university'].description}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg mt-4">
        <h5 className="text-sm font-medium text-gray-900 mb-2">成本构成说明</h5>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• 向量化成本：每月新增文档的向量化费用（月增长率 × 初始文档量）</p>
          <p>• 对话输入成本：活跃用户 × 日均查询次数 × 30天 × 每次查询token数</p>
          <p>• 对话输出成本：对话输入token × 输出比例（默认0.7）</p>
        </div>
      </div>

      {/* 计算按钮 */}
      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                   transition-colors font-medium text-lg shadow-sm
                   flex items-center space-x-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
          <span>计算成本预估</span>
        </button>
      </div>

      {/* 预估结果 */}
      {calculationResult && (
        <EstimationResults 
          initialUsage={calculationResult.initialUsage}
          monthlyUsage={calculationResult.monthlyUsage}
          costs={calculationResult.costs}
          teamSize={initialDimensions.teamSize}
          modelPrices={calculationResult.modelPrices}
        />
      )}
    </div>
  )
} 