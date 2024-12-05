'use client'

import { Select } from '@/components/ui/Select'

interface ModelSelectorProps {
  chatModel: string
  embeddingModel: string
  onChatModelChange: (model: string) => void
  onEmbeddingModelChange: (model: string) => void
}

export function ModelSelector({
  chatModel,
  embeddingModel,
  onChatModelChange,
  onEmbeddingModelChange
}: ModelSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择对话模型
        </label>
        <Select
          value={chatModel}
          onChange={(e) => onChatModelChange(e.target.value)}
          className="w-full"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择向量化模型
        </label>
        <Select
          value={embeddingModel}
          onChange={(e) => onEmbeddingModelChange(e.target.value)}
          className="w-full"
        >
          <option value="text-embedding-3-large">text-embedding-3-large</option>
          <option value="text-embedding-3-small">text-embedding-3-small</option>
        </Select>
      </div>
    </div>
  )
} 