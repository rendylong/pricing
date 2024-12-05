export interface Feature {
  id: string
  name: string
  description?: string
  price: number
  category: 'rag' | 'security' | 'support' | 'integration'  // 功能分类
  isCustomPrice?: boolean  // 是否允许自定义价格
  billingType: 'monthly' | 'onetime'  // 新增付费类型
} 