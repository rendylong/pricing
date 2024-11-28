import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    common: {
      "pricing": {
        "calculator": {
          "title": "Pricing Calculator",
          "description": "Calculate your GBase Enterprise pricing",
          "users": "Team Members",
          "messageCredits": "Message Credits",
          "vectorStorage": "Vector Storage",
          "features": "Additional Features",
          "billingCycle": "Billing Cycle",
          "monthly": "Monthly",
          "yearly": "Yearly"
        },
        "tokenEstimator": {
          "title": "Token Usage Estimator",
          "description": "Estimate your token usage",
          "chatModel": "Chat Model",
          "embeddingModel": "Embedding Model",
          "results": "Estimation Results",
          "tokenUsage": "Token Usage",
          "estimatedCost": "Estimated Cost"
        }
      }
    }
  },
  zh: {
    common: {
      "pricing": {
        "calculator": {
          "title": "价格计算器",
          "description": "计算 GBase Enterprise 价格",
          "users": "团队成员",
          "messageCredits": "消息额度",
          "vectorStorage": "向量存储",
          "features": "附加功能",
          "billingCycle": "付费周期",
          "monthly": "月付",
          "yearly": "年付"
        },
        "tokenEstimator": {
          "title": "Token使用量预估",
          "description": "预估 Token 使用量",
          "chatModel": "对话模型",
          "embeddingModel": "向量模型",
          "results": "预估结果",
          "tokenUsage": "Token用量",
          "estimatedCost": "预估成本"
        }
      }
    }
  },
  ja: {
    common: {
      "pricing": {
        "calculator": {
          "title": "料金計算機",
          "description": "GBase Enterprise の料金を計算",
          "users": "チームメンバー",
          "messageCredits": "メッセージクレジット",
          "vectorStorage": "ベクトルストレージ",
          "features": "追加機能",
          "billingCycle": "支払いサイクル",
          "monthly": "月払い",
          "yearly": "年払い"
        },
        "tokenEstimator": {
          "title": "Token使用量予測",
          "description": "Token使用量を予測",
          "chatModel": "チャットモデル",
          "embeddingModel": "埋め込みモデル",
          "results": "予測結果",
          "tokenUsage": "Token使用量",
          "estimatedCost": "予測コスト"
        }
      }
    }
  }
}

const i18nConfig = {
  resources,
  lng: 'zh', // 默认语言
  fallbackLng: 'zh',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  }
}

const i18n = createInstance()
i18n.use(initReactI18next).init(i18nConfig)

export default i18n 