'use client'

import React, { useState, useEffect } from 'react'
import { ModelPriceEditor } from './ModelPriceEditor'
import { EstimationResults } from './EstimationResults'
import { UsageDimensions } from './UsageDimensions'
import { NumericInput } from '@/components/ui/NumericInput'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateNumber = (value: string | number | undefined, step: string, required: boolean = true): number => {
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

// 添加类型定义
interface SizePattern {
  monthlyGrowthRate: number;
  queriesPerActiveUser: number;
  turnsPerQuery: number;
  teamSize: {
    total: number;
    activeRatio: number;
  };
  documentsPerUser: {
    text: number;
    excel: number;
    ppt: number;
    pdf: number;
    word: number;
    email: number;
    image: number;
  };
}

interface IndustryPattern {
  description: string;
  monthlyGrowthRate: number;
  queriesPerActiveUser: number;
  turnsPerQuery: number;
  sizePatterns: {
    small: SizePattern;
    medium: SizePattern;
    large: SizePattern;
  };
}

// 添加行业特性配置
const INDUSTRY_PATTERNS: Record<string, IndustryPattern> = {
  bank: {
    description: '银行的知识库以金融品文档、合规文件和报表为主。Excel、PDF占比较高，反映了金融行业数据分析和规范化文档的需求。人均文档量较大。',
    monthlyGrowthRate: 0.15,
    queriesPerActiveUser: 5,
    turnsPerQuery: 6,
    sizePatterns: {
      small: { 
        monthlyGrowthRate: 0.12,
        queriesPerActiveUser: 4,
        turnsPerQuery: 5,
        teamSize: { total: 800, activeRatio: 0.7 },
        documentsPerUser: {
          excel: 15,
          pdf: 12,
          word: 8,
          text: 5,
          ppt: 3,
          email: 20,
          image: 2
        }
      },
      medium: { 
        monthlyGrowthRate: 0.15,
        queriesPerActiveUser: 5,
        turnsPerQuery: 6,
        teamSize: { total: 2000, activeRatio: 0.7 },
        documentsPerUser: {
          excel: 18,
          pdf: 15,
          word: 10,
          text: 6,
          ppt: 4,
          email: 25,
          image: 3
        }
      },
      large: {
        monthlyGrowthRate: 0.18,
        queriesPerActiveUser: 6,
        turnsPerQuery: 7,
        teamSize: { total: 5000, activeRatio: 0.7 },
        documentsPerUser: {
          excel: 20,
          pdf: 18,
          word: 12,
          text: 8,
          ppt: 5,
          email: 30,
          image: 4
        }
      }
    }
  },
  tech: {
    description: '科技公司的知识库以技术文档、代码文档和产品设计文档为主。文本文件和PPT占比较高，反映了技术文档和产品演示的需求。',
    monthlyGrowthRate: 0.20,
    queriesPerActiveUser: 8,
    turnsPerQuery: 6,
    sizePatterns: {
      small: {
        monthlyGrowthRate: 0.15,
        queriesPerActiveUser: 6,
        turnsPerQuery: 5,
        teamSize: { total: 500, activeRatio: 0.9 },
        documentsPerUser: {
          text: 20,
          ppt: 10,
          pdf: 5,
          word: 5,
          excel: 3,
          email: 25,
          image: 8
        }
      },
      medium: {
        monthlyGrowthRate: 0.18,
        queriesPerActiveUser: 7,
        turnsPerQuery: 6,
        teamSize: { total: 1000, activeRatio: 0.9 },
        documentsPerUser: {
          text: 25,
          ppt: 12,
          pdf: 6,
          word: 6,
          excel: 4,
          email: 30,
          image: 10
        }
      },
      large: {
        monthlyGrowthRate: 0.20,
        queriesPerActiveUser: 8,
        turnsPerQuery: 7,
        teamSize: { total: 3000, activeRatio: 0.9 },
        documentsPerUser: {
          text: 30,
          ppt: 15,
          pdf: 8,
          word: 8,
          excel: 5,
          email: 35,
          image: 12
        }
      }
    }
  },
  university: {
    description: '高校的知识库以教学资料、研究论文和行政文档为主。Word和PDF占比较高，反映了学术论文和教学资料的特点。',
    monthlyGrowthRate: 0.10,
    queriesPerActiveUser: 5,
    turnsPerQuery: 5,
    sizePatterns: {
      small: {
        monthlyGrowthRate: 0.08,
        queriesPerActiveUser: 4,
        turnsPerQuery: 4,
        teamSize: { total: 500, activeRatio: 0.6 },
        documentsPerUser: {
          word: 15,
          pdf: 12,
          ppt: 8,
          excel: 4,
          text: 6,
          email: 15,
          image: 5
        }
      },
      medium: {
        monthlyGrowthRate: 0.10,
        queriesPerActiveUser: 5,
        turnsPerQuery: 5,
        teamSize: { total: 2000, activeRatio: 0.6 },
        documentsPerUser: {
          word: 18,
          pdf: 15,
          ppt: 10,
          excel: 5,
          text: 8,
          email: 20,
          image: 6
        }
      },
      large: {
        monthlyGrowthRate: 0.12,
        queriesPerActiveUser: 6,
        turnsPerQuery: 6,
        teamSize: { total: 5000, activeRatio: 0.6 },
        documentsPerUser: {
          word: 20,
          pdf: 18,
          ppt: 12,
          excel: 6,
          text: 10,
          email: 25,
          image: 8
        }
      }
    }
  },
  k12: {
    description: '中小学校的知识库以教案、试题和学生作业为主。Word和PPT占比较高，反映了教学资料特点。人均文档量适中。',
    monthlyGrowthRate: 0.05,
    queriesPerActiveUser: 3,
    turnsPerQuery: 4,
    sizePatterns: {
      small: {
        monthlyGrowthRate: 0.04,
        queriesPerActiveUser: 2,
        turnsPerQuery: 3,
        teamSize: { total: 200, activeRatio: 0.8 },
        documentsPerUser: {
          word: 12,
          ppt: 10,
          pdf: 5,
          excel: 3,
          text: 4,
          email: 8,
          image: 6
        }
      },
      medium: {
        monthlyGrowthRate: 0.05,
        queriesPerActiveUser: 3,
        turnsPerQuery: 4,
        teamSize: { total: 500, activeRatio: 0.8 },
        documentsPerUser: {
          word: 15,
          ppt: 12,
          pdf: 6,
          excel: 4,
          text: 5,
          email: 10,
          image: 8
        }
      },
      large: {
        monthlyGrowthRate: 0.06,
        queriesPerActiveUser: 4,
        turnsPerQuery: 5,
        teamSize: { total: 1000, activeRatio: 0.8 },
        documentsPerUser: {
          word: 18,
          ppt: 15,
          pdf: 8,
          excel: 5,
          text: 6,
          email: 12,
          image: 10
        }
      }
    }
  }
} as const;

// 添加默认文档长度配置
const DEFAULT_DOC_LENGTHS = {
  text: '2000',
  excel: '5000',
  ppt: '3000',
  pdf: '4000',
  word: '3500',
  email: '800'
}

// 添加缺失的类型定义
interface CostCalculationInput {
  embedding: number;
  chatInput?: number;
  chatOutput?: number;
}

interface CostCalculationResult {
  initial: { 
    embedding: number; 
    total: number;
  };
  monthly: {
    embedding: number;
    chatInput: number;
    chatOutput: number;
    total: number;
  };
}

// 添加默认的 token multipliers
const DEFAULT_TOKEN_MULTIPLIERS = {
  text: 1.5,
  excel: 1.67,
  ppt: 2.0,
  pdf: 1.87,
  word: 1.8,
  email: 1.3,
  image: 300,
  audio: 400,
  video: 800
};

// 添加 CalculationResult 接口定义
interface CalculationResult {
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
  costs: CostCalculationResult;
  modelPrices: {
    embedding: number;
    chatInput: number;
    chatOutput: number;
  };
}

// 添加 TokenMultipliers 类型定义
type TokenMultipliers = {
  text: number | '';
  excel: number | '';
  ppt: number | '';
  pdf: number | '';
  word: number | '';
  email: number | '';
  image: number | '';
  audio: number | '';
  video: number | '';
};

// 添加 MonthlyPattern 类型定义
type MonthlyPattern = {
  monthlyGrowthRate: number | '';
  queriesPerActiveUser: number | '';
  turnsPerQuery: number | '';
};

export function TokenEstimator() {
  // 从 localStorage 初始化状
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

  const [tokenMultipliers, setTokenMultipliers] = useState<TokenMultipliers>(() => {
    if (typeof window === 'undefined') return DEFAULT_TOKEN_MULTIPLIERS
    const savedMultipliers = localStorage.getItem(STORAGE_KEYS.TOKEN_MULTIPLIERS)
    return savedMultipliers ? JSON.parse(savedMultipliers) : DEFAULT_TOKEN_MULTIPLIERS
  })

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
    selectedTemplate: 'university' as keyof typeof INDUSTRY_PATTERNS
  })

  const [monthlyPattern, setMonthlyPattern] = useState<MonthlyPattern>({
    monthlyGrowthRate: 0.10,
    queriesPerActiveUser: 5,
    turnsPerQuery: 5
  })

  // 添加计算结果状态
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // 将计算函数移到组件内部并实现完整功能
  const calculateInitialUsage = (dimensions: {
    documents: Record<string, string | number>;
    avgDocumentLength: Record<string, string | number>;
    teamSize: {
      total: number;
      activeUsers: number;
    };
  }) => {
    let totalEmbeddingTokens = 0

    // 转换输入值为数字并计算
    const convertedDocuments = Object.entries(dimensions.documents).reduce((acc, [key, value]) => {
      const numValue = Number(value) || 0
      acc[key] = String(numValue)
      return acc
    }, {} as Record<string, string>)

    const convertedLengths = Object.entries(dimensions.avgDocumentLength).reduce((acc, [key, value]) => {
      const numValue = Number(value) || 0
      acc[key] = String(numValue)
      return acc
    }, {} as Record<string, string>)

    // 计算总 token
    Object.entries(convertedDocuments).forEach(([docType, count]) => {
      const length = Number(convertedLengths[docType]) || 0
      const multiplier = Number(tokenMultipliers[docType as keyof TokenMultipliers]) || 0
      const tokens = Number(count) * length * multiplier
      totalEmbeddingTokens += tokens
    })

    // 将 tokenMultipliers 转换为纯数字类型
    const numericMultipliers = Object.entries(tokenMultipliers).reduce((acc, [key, value]) => {
      acc[key] = Number(value) || 0
      return acc
    }, {} as Record<string, number>)

    return {
      embedding: totalEmbeddingTokens,
      documents: convertedDocuments,
      avgDocumentLength: convertedLengths,
      multipliers: numericMultipliers
    }
  }

  // 添加模板变更处理数
  const handleTemplateChange = (newTemplate: keyof typeof INDUSTRY_PATTERNS) => {
    const pattern = INDUSTRY_PATTERNS[newTemplate];
    const sizePattern = pattern.sizePatterns.small;
    
    setInitialDimensions(prev => {
      const newDocuments = calculateDocumentCounts(
        prev.teamSize.total,
        sizePattern.documentsPerUser
      );

      return {
        ...prev,
        selectedTemplate: newTemplate,
        documents: newDocuments,
        avgDocumentLength: DEFAULT_DOC_LENGTHS,
        avgImageCount: prev.avgImageCount,
        avgImageSize: prev.avgImageSize
      };
    });
  }

  // 添加团队规模变更处理函数
  const handleTeamSizeChange = (newTeamSize: { total: number; activeUsers: number }) => {
    const pattern = INDUSTRY_PATTERNS[initialDimensions.selectedTemplate];
    const sizePattern = pattern.sizePatterns.small;
    
    setInitialDimensions(prev => {
      const newDocuments = calculateDocumentCounts(
        newTeamSize.total,
        sizePattern.documentsPerUser
      );

      return {
        ...prev,
        teamSize: newTeamSize,
        documents: newDocuments,
        avgImageCount: prev.avgImageCount,
        avgImageSize: prev.avgImageSize
      };
    });
  }

  // 加文数量计算函数
  const calculateDocumentCounts = (
    teamSize: number,
    documentsPerUser: Record<string, number>
  ): {
    text: string;
    excel: string;
    ppt: string;
    pdf: string;
    word: string;
    email: string;
    image: string;
  } => {
    const result = {} as Record<string, string>;
    Object.entries(documentsPerUser).forEach(([type, perUser]) => {
      result[type] = String(Math.round(perUser * teamSize));
    });
    return result as {
      text: string;
      excel: string;
      ppt: string;
      pdf: string;
      word: string;
      email: string;
      image: string;
    };
  }

  // 计算处理函数
  const handleCalculate = () => {
    const selectedEmbeddingModel = models.find(m => m.id === selectedEmbeddingModelId);
    const selectedChatModel = models.find(m => m.id === selectedChatModelId);

    if (!selectedEmbeddingModel || !selectedChatModel) {
      console.error('Selected models not found');
      return;
    }

    const initial = calculateInitialUsage(initialDimensions);
    const monthly = calculateMonthlyUsage();
    const costs = calculateCost(initial, monthly);
    
    setCalculationResult({
      initialUsage: initial,
      monthlyUsage: monthly,
      costs: costs,
      modelPrices: {
        embedding: Number(selectedEmbeddingModel.inputPrice),
        chatInput: Number(selectedChatModel.inputPrice),
        chatOutput: Number(selectedChatModel.outputPrice || selectedChatModel.inputPrice)
      }
    });
  };

  // useEffect 移到这里
  useEffect(() => {
    const template = initialDimensions.selectedTemplate
    const pattern = INDUSTRY_PATTERNS[template]
    if (pattern) {
      setMonthlyPattern({
        monthlyGrowthRate: pattern.monthlyGrowthRate,
        queriesPerActiveUser: pattern.queriesPerActiveUser,
        turnsPerQuery: pattern.turnsPerQuery
      })
    }
  }, [initialDimensions.selectedTemplate])

  // localStorage 相关的 useEffect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models))
  }, [models])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CHAT, selectedChatModelId)
  }, [selectedChatModelId])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_EMBEDDING, selectedEmbeddingModelId)
  }, [selectedEmbeddingModelId])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOKEN_MULTIPLIERS, JSON.stringify(tokenMultipliers))
  }, [tokenMultipliers])

  // 将 renderTokenMultipliers 移到组件内部
  const renderTokenMultipliers = () => {
    const labels: Record<string, string> = {
      text: '纯文本倍率',
      excel: 'Excel 倍率',
      ppt: 'PPT 倍率',
      pdf: 'PDF 倍率',
      word: 'Word 倍率',
      email: '件倍率',
      image: '图倍率',
      audio: '音频倍率',
      video: '视频倍率'
    }

    const descriptions: Record<string, string> = {
      text: '准倍率 (tokens/字符)',
      excel: '表格结构处理倍率',
      ppt: '布局和图片处理倍率',
      pdf: '格式处理倍率',
      word: 'Word 文档格式处理倍率',
      email: '邮件文档处理倍率',
      image: '每百万素的 token 数',
      audio: '每分钟音频的 token 数',
      video: '每分钟视频的 token 数'
    }

    const units: Record<string, string> = {
      text: 'tokens/字符',
      excel: 'tokens/字',
      ppt: 'tokens/字符',
      pdf: 'tokens/字符',
      word: 'tokens/字符',
      email: 'tokens/字符',
      image: 'tokens/百万像素',
      audio: 'tokens/分钟',
      video: 'tokens/分钟'
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Token 倍率配置
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(tokenMultipliers).map(([type, multiplier]) => (
            <div key={type} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {labels[type]}
              </label>
              <NumericInput
                value={multiplier}
                onChange={(value) => {
                  setTokenMultipliers((prev: TokenMultipliers) => ({
                    ...prev,
                    [type]: value
                  }))
                }}
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
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500">
          这些倍率会影响最终的 token 消耗计算
        </p>
      </div>
    )
  }

  // 添加 handleModelsChange 函数
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

  // 添加月度使用量计算函数
  const calculateMonthlyUsage = () => {
    const selectedTemplate = initialDimensions.selectedTemplate
    const pattern = INDUSTRY_PATTERNS[selectedTemplate]

    let monthlyEmbeddingTokens = 0
    let monthlyChatInputTokens = 0
    let monthlyChatOutputTokens = 0

    // 计算新增文档的向量化
    Object.entries(initialDimensions.documents).forEach(([docType, count]) => {
      if (!count) return
      const numericCount = Number(count)
      const length = Number(initialDimensions.avgDocumentLength[docType as keyof typeof initialDimensions.avgDocumentLength]) || 0
      const multiplier = Number(tokenMultipliers[docType as keyof TokenMultipliers]) || 0
      const growthRate = Number(monthlyPattern.monthlyGrowthRate) || 0
      const monthlyNewCount = Math.round(numericCount * growthRate)
      const tokens = monthlyNewCount * length * multiplier
      monthlyEmbeddingTokens += tokens
    })

    // 计算对话 token
    const activeUsers = initialDimensions.teamSize?.activeUsers || 0
    const queriesPerUser = Number(monthlyPattern.queriesPerActiveUser) || 0
    const turnsPerQuery = Number(monthlyPattern.turnsPerQuery) || 0
    const monthlyQueries = activeUsers * queriesPerUser * 30

    const tokensPerQuery = {
      input: 200,
      context: 2000,
      systemPrompt: 300,
      outputMultiplier: 0.7
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
      pattern: {
        monthlyGrowthRate: pattern.monthlyGrowthRate,
        queriesPerActiveUser: pattern.queriesPerActiveUser,
        turnsPerQuery: pattern.turnsPerQuery
      }
    }
  }

  // 添加成本计算函数
  const calculateCost = (
    initialUsage: CostCalculationInput,
    monthlyUsage: CostCalculationInput
  ): CostCalculationResult => {
    const selectedEmbeddingModel = models.find(m => m.id === selectedEmbeddingModelId);
    const selectedChatModel = models.find(m => m.id === selectedChatModelId);

    if (!selectedEmbeddingModel || !selectedChatModel) {
      throw new Error('Selected models not found');
    }

    const embeddingPrice = Number(selectedEmbeddingModel.inputPrice);
    const chatInputPrice = Number(selectedChatModel.inputPrice);
    const chatOutputPrice = Number(selectedChatModel.outputPrice || selectedChatModel.inputPrice);

    return {
      initial: {
        embedding: (initialUsage.embedding / 1000000) * embeddingPrice,
        total: (initialUsage.embedding / 1000000) * embeddingPrice
      },
      monthly: {
        embedding: (monthlyUsage.embedding / 1000000) * embeddingPrice,
        chatInput: ((monthlyUsage.chatInput || 0) / 1000000) * chatInputPrice,
        chatOutput: ((monthlyUsage.chatOutput || 0) / 1000000) * chatOutputPrice,
        total: (
          (monthlyUsage.embedding / 1000000) * embeddingPrice +
          ((monthlyUsage.chatInput || 0) / 1000000) * chatInputPrice +
          ((monthlyUsage.chatOutput || 0) / 1000000) * chatOutputPrice
        )
      }
    };
  };

  // 添加 handlePatternChange 函数
  const handlePatternChange = (updates: Partial<MonthlyPattern>) => {
    setMonthlyPattern(prev => ({
      ...prev,
      ...updates
    }))
  }

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

      {/* Token 配置 */}
      {renderTokenMultipliers()}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          初始化使用量
        </h3>
        {/* 添加行业选择卡片 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">选择行业</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(INDUSTRY_PATTERNS).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => handleTemplateChange(key as keyof typeof INDUSTRY_PATTERNS)}
                className={`p-4 rounded-lg border text-left ${
                  initialDimensions.selectedTemplate === key
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                <h5 className="font-medium text-gray-900">{
                  {
                    university: '高等院校',
                    k12: '中小学校',
                    bank: '银行',
                    tech: '科技公司'
                  }[key]
                }</h5>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {pattern.description}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        <UsageDimensions
          dimensions={initialDimensions}
          onChange={(newDimensions) => {
            // 当团队规模改变时，更新文档数量
            if (newDimensions.teamSize.total !== initialDimensions.teamSize.total ||
                newDimensions.teamSize.activeUsers !== initialDimensions.teamSize.activeUsers) {
              handleTeamSizeChange(newDimensions.teamSize)
            } else {
              setInitialDimensions(newDimensions)
            }
          }}
          type="initial"
        />
      </div>

      {/* 新增：月度使用量配置 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          月度用量配置
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
                  value={Number(monthlyPattern.monthlyGrowthRate) * 100 || 0}
                  onChange={(value) => {
                    handlePatternChange({ 
                      monthlyGrowthRate: value !== '' ? value / 100 : ''
                    })
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  每月新增文档占现有文档的百分比
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  人均日查询数
                </label>
                <NumericInput
                  value={monthlyPattern.queriesPerActiveUser}
                  onChange={(value) => {
                    handlePatternChange({ 
                      queriesPerActiveUser: value
                    })
                  }}
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
                  onChange={(value) => {
                    handlePatternChange({ 
                      turnsPerQuery: value
                    })
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  每次查询的平均对话来回次数
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-2">行业考值</h5>
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
          <p>• 对话输入成本：活跃用户 × 日查询次数 × 30天 × 次查询token数</p>
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