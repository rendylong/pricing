'use client'

interface FeatureListProps {
  selectedFeatures: string[]
  onFeatureChange: (features: string[]) => void
}

const FEATURES = {
  customTools: {
    name: '自定义工具集成',
    description: '集成自定义工具和API，扩展系统功能'
  },
  analytics: {
    name: '高级分析',
    description: '详细的使用分析和性能报告'
  },
  support: {
    name: '优先支持',
    description: '24/7技术支持和专属客户经理'
  },
  models: {
    name: '自定义模型',
    description: '使用自定义的模型和参数'
  },
  security: {
    name: '高级安全特性',
    description: '额外的安全功能和合规认证'
  }
}

export function FeatureList({ selectedFeatures, onFeatureChange }: FeatureListProps) {
  const handleToggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      onFeatureChange(selectedFeatures.filter(f => f !== feature))
    } else {
      onFeatureChange([...selectedFeatures, feature])
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(FEATURES).map(([key, feature]) => (
        <label key={key} className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={selectedFeatures.includes(key)}
              onChange={() => handleToggleFeature(key)}
              className="form-checkbox h-4 w-4 text-primary-600 rounded"
            />
          </div>
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-700">
              {feature.name}
            </span>
            <p className="text-sm text-gray-500">
              {feature.description}
            </p>
          </div>
        </label>
      ))}
    </div>
  )
} 