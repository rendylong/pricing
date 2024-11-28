import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui/Select'

interface ModelSelectorProps {
  chatModel: string
  embeddingModel: string
  onChatModelChange: (model: string) => void
  onEmbeddingModelChange: (model: string) => void
}

const chatModels = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
]

const embeddingModels = [
  { id: 'text-embedding-3-large', name: 'text-embedding-3-large' },
  { id: 'text-embedding-3-small', name: 'text-embedding-3-small' }
]

export function ModelSelector({
  chatModel,
  embeddingModel,
  onChatModelChange,
  onEmbeddingModelChange
}: ModelSelectorProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <Select
          label={t('pricing.tokenEstimator.chatModel')}
          value={chatModel}
          onChange={(e) => onChatModelChange(e.target.value)}
        >
          {chatModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Select
          label={t('pricing.tokenEstimator.embeddingModel')}
          value={embeddingModel}
          onChange={(e) => onEmbeddingModelChange(e.target.value)}
        >
          {embeddingModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </Select>
      </div>
    </>
  )
} 