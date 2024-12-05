'use client'

import { useState, useEffect } from 'react'
import { NumericInput } from '@/components/ui/NumericInput'
import { CheckIcon } from '@/components/ui/CheckIcon'

interface ModelPrice {
  id: string
  name: string
  type: 'chat' | 'embedding'
  inputPrice: number | ''
  outputPrice?: number | ''
}

interface ModelPriceEditorProps {
  models: ModelPrice[]
  onModelsChange: (models: ModelPrice[]) => void
  selectedChatModelId: string
  selectedEmbeddingModelId: string
  onSelectChatModel: (id: string) => void
  onSelectEmbeddingModel: (id: string) => void
}

export function ModelPriceEditor({
  models,
  onModelsChange,
  selectedChatModelId,
  selectedEmbeddingModelId,
  onSelectChatModel,
  onSelectEmbeddingModel
}: ModelPriceEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-[200px] bg-white rounded-lg shadow-lg p-6"></div>
  }

  const handleAddModel = (type: 'chat' | 'embedding') => {
    const newModel: ModelPrice = {
      id: `model-${Date.now()}`,
      name: '',
      type,
      inputPrice: '',
      ...(type === 'chat' ? { outputPrice: '' } : {})
    }
    onModelsChange([...models, newModel])
  }

  const handleModelChange = (modelId: string, updates: Partial<ModelPrice>) => {
    const newModels = models.map(model => 
      model.id === modelId ? { ...model, ...updates } : model
    )
    onModelsChange(newModels)
  }

  const handleRemoveModel = (modelId: string) => {
    if (window.confirm('确认删除此模型？')) {
      onModelsChange(models.filter(model => model.id !== modelId))
    }
  }

  const chatModels = models.filter(m => m.type === 'chat')
  const embeddingModels = models.filter(m => m.type === 'embedding')

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          模型与价格设置
        </h3>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${isEditing 
              ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {isEditing ? '完成' : '编辑'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 对话模型部分 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              对话模型
            </h4>
            {isEditing && (
              <button
                type="button"
                onClick={() => handleAddModel('chat')}
                className="text-sm text-primary-600 hover:text-primary-700 
                         flex items-center space-x-1"
              >
                <span className="text-lg">+</span>
                <span>添加对话模型</span>
              </button>
            )}
          </div>
          <div className="space-y-3">
            {chatModels.map((model) => (
              <div
                key={model.id}
                className={`group relative rounded-xl border transition-all duration-200
                  ${isEditing 
                    ? 'border-gray-200 bg-white hover:border-gray-300' 
                    : selectedChatModelId === model.id
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }
                  ${!isEditing && 'cursor-pointer'}`}
                onClick={() => !isEditing && onSelectChatModel(model.id)}
              >
                <div className="p-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={model.name}
                        onChange={(e) => handleModelChange(model.id, { name: e.target.value })}
                        placeholder="请输入模型名称"
                        className="w-full px-3 py-2 border-gray-300 rounded-lg 
                                 shadow-sm focus:ring-1 focus:ring-primary-500 
                                 focus:border-primary-500 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">
                            输入价格
                            <span className="text-gray-400">
                              /百万 tokens
                            </span>
                          </label>
                          <NumericInput
                            value={model.inputPrice || ''}
                            onChange={(value) => handleModelChange(model.id, { inputPrice: value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">
                            输出价格
                            <span className="text-gray-400">
                              /百万 tokens
                            </span>
                          </label>
                          <NumericInput
                            value={model.outputPrice || ''}
                            onChange={(value) => handleModelChange(model.id, { outputPrice: value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveModel(model.id)}
                          className="text-sm text-red-600 hover:text-red-700 
                                   opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {model.name}
                        </span>
                        {selectedChatModelId === model.id && (
                          <span className="text-primary-600">
                            <CheckIcon className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>输入:</span>
                          <span className="font-medium">
                            ${model.inputPrice}/百万 tokens
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>输出:</span>
                          <span className="font-medium">
                            ${model.outputPrice}/百万 tokens
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatModels.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 
                            rounded-xl border-2 border-dashed border-gray-200">
                暂无模型，点击添加
              </div>
            )}
          </div>
        </div>

        {/* 向量模型部分 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              向量模型
            </h4>
            {isEditing && (
              <button
                type="button"
                onClick={() => handleAddModel('embedding')}
                className="text-sm text-primary-600 hover:text-primary-700 
                         flex items-center space-x-1"
              >
                <span className="text-lg">+</span>
                <span>添加向量模型</span>
              </button>
            )}
          </div>
          <div className="space-y-3">
            {embeddingModels.map((model) => (
              <div
                key={model.id}
                className={`group relative rounded-xl border transition-all duration-200
                  ${isEditing 
                    ? 'border-gray-200 bg-white hover:border-gray-300' 
                    : selectedEmbeddingModelId === model.id
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }
                  ${!isEditing && 'cursor-pointer'}`}
                onClick={() => !isEditing && onSelectEmbeddingModel(model.id)}
              >
                <div className="p-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={model.name}
                        onChange={(e) => handleModelChange(model.id, { name: e.target.value })}
                        placeholder="请输入模型名称"
                        className="w-full px-3 py-2 border-gray-300 rounded-lg 
                                 shadow-sm focus:ring-1 focus:ring-primary-500 
                                 focus:border-primary-500 text-sm"
                      />
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">
                          价格
                          <span className="text-gray-400 ml-1">
                            /百万 tokens
                          </span>
                        </label>
                        <NumericInput
                          value={model.inputPrice}
                          onChange={(value) => handleModelChange(model.id, { inputPrice: value })}
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveModel(model.id)}
                          className="text-sm text-red-600 hover:text-red-700 
                                   opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {model.name}
                        </span>
                        {selectedEmbeddingModelId === model.id && (
                          <span className="text-primary-600">
                            <CheckIcon className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>价格:</span>
                          <span className="font-medium">
                            ${model.inputPrice}/百万 tokens
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {embeddingModels.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 
                            rounded-xl border-2 border-dashed border-gray-200">
                暂无模型，点击添加
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          {isEditing ? '价格单位：美元/百万tokens' : '点击编辑按钮修改模型和价格'}
        </p>
      </div>
    </div>
  )
} 