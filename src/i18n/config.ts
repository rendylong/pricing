import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'pricing.calculator.title': 'Enterprise RAG Pricing Calculator',
      'pricing.users': 'Team Members',
      'pricing.messageCredits': 'Message Credits',
      'pricing.vectorStorage': 'Vector Storage',
      'pricing.perMonth': 'month',
      'pricing.features': 'Additional Features',
      'pricing.select.features': 'Select additional features',
      'pricing.billingCycle': 'Billing Cycle',
      'pricing.monthly': 'Monthly',
      'pricing.yearly': 'Yearly',
      'pricing.perYear': 'year',
      'pricing.savePercent': 'Save {{percent}}%',
      'pricing.equivalentTo': 'Equivalent to',
      'pricing.users.unit': 'users',
      'pricing.messages.unit': 'messages',
      'pricing.minimum': 'Minimum',
      'pricing.currency': 'Currency',
      'pricing.breakdown.title': 'Price Breakdown',
      'pricing.breakdown.base': 'Base Price',
      'pricing.breakdown.teamMembers': 'Additional Team Members',
      'pricing.breakdown.messageCredits': 'Additional Message Credits',
      'pricing.breakdown.vectorStorage': 'Additional Vector Storage',
      'pricing.breakdown.discount': 'Discount',
      'pricing.breakdown.total': 'Total',
      'pricing.feature.add': 'Add Custom Feature',
      'pricing.feature.name': 'Feature Name',
      'pricing.feature.price': 'Price',
      'pricing.feature.description': 'Description',
      'pricing.feature.delete': 'Delete',
      'pricing.globalDiscount': 'Global Discount',
      'pricing.updateQuote': 'Update Quote',
      'pricing.breakdown.basePackage': 'Base Package Includes',
      'pricing.breakdown.additionalCosts': 'Additional Costs',
      'pricing.breakdown.additionalFeatures': 'Additional Features',
      'pricing.buildApps': 'Build Apps',
      'pricing.documentsQuota': 'Documents Quota',
      'pricing.annotationQuota': 'Annotation Quota',
      'pricing.customTools': 'Custom Tools',
      'pricing.breakdown.current': 'Current Usage',
      'pricing.breakdown.included': 'Included in Base',
      'pricing.breakdown.extra': 'Extra Usage',
      'pricing.breakdown.perUser': 'per additional user',
      'pricing.breakdown.per1000Messages': 'per 1,000 messages',
      'pricing.breakdown.per100MB': 'per 100MB',
      'pricing.discountPreview': 'Original price: {{original}} → Discounted price: {{discounted}}',
      'pricing.otherCharges': 'Other Charges',
      'pricing.otherCharges.add': 'Add Other Charge',
      'pricing.otherCharges.name': 'Item Name',
      'pricing.otherCharges.amount': 'Amount',
      'pricing.otherCharges.note': 'Note',
      'pricing.otherCharges.delete': 'Delete',
      'pricing.otherCharges.placeholder.name': 'Enter item name',
      'pricing.otherCharges.placeholder.note': 'Enter description or note',
      'pricing.breakdown.otherCharges': 'Other Charges',
      'pricing.otherCharges.empty': 'No additional charges',
      'pricing.otherCharges.error.name': 'Please enter item name',
      'pricing.otherCharges.error.amount': 'Amount must be greater than 0',
      'pricing.breakdown.basePrice': 'Base Price',
      'pricing.otherCharges.save': 'Save',
      'pricing.otherCharges.edit': 'Edit',
      'pricing.reset': 'Reset Calculator'
    }
  },
  zh: {
    translation: {
      'pricing.calculator.title': '企业版 RAG 价格计算器',
      'pricing.users': '团队成员',
      'pricing.messageCredits': '消息额度',
      'pricing.vectorStorage': '向量存储',
      'pricing.perMonth': '月',
      'pricing.features': '附加功能',
      'pricing.select.features': '选择附加功能',
      'pricing.billingCycle': '付费周期',
      'pricing.monthly': '月付',
      'pricing.yearly': '年付',
      'pricing.perYear': '年',
      'pricing.savePercent': '节省 {{percent}}%',
      'pricing.equivalentTo': '相当于',
      'pricing.users.unit': '用户',
      'pricing.messages.unit': '条消息',
      'pricing.minimum': '最少',
      'pricing.currency': '货币',
      'pricing.breakdown.title': '价格明细',
      'pricing.breakdown.base': '基础价格',
      'pricing.breakdown.teamMembers': '额外团队成员',
      'pricing.breakdown.messageCredits': '额外消息额度',
      'pricing.breakdown.vectorStorage': '额外向量存储',
      'pricing.breakdown.discount': '折扣',
      'pricing.breakdown.total': '总计',
      'pricing.feature.add': '添加自定义功能',
      'pricing.feature.name': '功能名称',
      'pricing.feature.price': '价格',
      'pricing.feature.description': '描述',
      'pricing.feature.delete': '删除',
      'pricing.globalDiscount': '全局折扣',
      'pricing.updateQuote': '更新报价',
      'pricing.breakdown.basePackage': '基础套餐包含',
      'pricing.breakdown.additionalCosts': '额外费用',
      'pricing.breakdown.additionalFeatures': '附加功能',
      'pricing.buildApps': '构建应用数',
      'pricing.documentsQuota': '文档配额',
      'pricing.annotationQuota': '标注配额',
      'pricing.customTools': '自定义工具',
      'pricing.breakdown.current': '当前用量',
      'pricing.breakdown.included': '基础包含',
      'pricing.breakdown.extra': '超出用量',
      'pricing.breakdown.perUser': '/额外用户',
      'pricing.breakdown.per1000Messages': '/1,000条消息',
      'pricing.breakdown.per100MB': '/100MB',
      'pricing.discountPreview': '原价: {{original}} → 折后价: {{discounted}}',
      'pricing.otherCharges': '其他收费项',
      'pricing.otherCharges.add': '添加收费项',
      'pricing.otherCharges.name': '项目名称',
      'pricing.otherCharges.amount': '金额',
      'pricing.otherCharges.note': '备注',
      'pricing.otherCharges.delete': '删除',
      'pricing.otherCharges.placeholder.name': '请输入项目名称',
      'pricing.otherCharges.placeholder.note': '请输入描述或备注',
      'pricing.breakdown.otherCharges': '其他收费项',
      'pricing.otherCharges.empty': '暂无其他收费项',
      'pricing.otherCharges.error.name': '请输入项目名称',
      'pricing.otherCharges.error.amount': '金额必须大于0',
      'pricing.breakdown.basePrice': '基础价格',
      'pricing.otherCharges.save': '保存',
      'pricing.otherCharges.edit': '编辑',
      'pricing.reset': '重新计算'
    }
  },
  ja: {
    translation: {
      'pricing.calculator.title': 'エンタープライズ RAG 料金計算機',
      'pricing.users': 'チームメンバー',
      'pricing.messageCredits': 'メッセージクレジット',
      'pricing.vectorStorage': 'ベクトルストレージ',
      'pricing.perMonth': '月',
      'pricing.features': '追加機能',
      'pricing.select.features': '追加機能を選択',
      'pricing.billingCycle': '支払いサイクル',
      'pricing.monthly': '月払い',
      'pricing.yearly': '年払い',
      'pricing.perYear': '年',
      'pricing.savePercent': '{{percent}}% お得',
      'pricing.equivalentTo': '月額換算',
      'pricing.users.unit': '名',
      'pricing.messages.unit': '件',
      'pricing.minimum': '最小',
      'pricing.currency': '通貨',
      'pricing.breakdown.title': '料金内訳',
      'pricing.breakdown.base': '基本料金',
      'pricing.breakdown.teamMembers': '追加チームメンバー',
      'pricing.breakdown.messageCredits': '追加メッセージクレジット',
      'pricing.breakdown.vectorStorage': '追加ストレージ',
      'pricing.breakdown.discount': '割引',
      'pricing.breakdown.total': '合計',
      'pricing.feature.add': 'カスタム機能を追加',
      'pricing.feature.name': '機能名',
      'pricing.feature.price': '価格',
      'pricing.feature.description': '説明',
      'pricing.feature.delete': '削除',
      'pricing.globalDiscount': 'グローバル割引',
      'pricing.updateQuote': '見積を更新',
      'pricing.breakdown.basePackage': '基本パッケージ内容',
      'pricing.breakdown.additionalCosts': '追加料金',
      'pricing.breakdown.additionalFeatures': '追加機能',
      'pricing.buildApps': 'アプリ構築数',
      'pricing.documentsQuota': 'ドキュメント数',
      'pricing.annotationQuota': 'アノテーション数',
      'pricing.customTools': 'カスタムツール数',
      'pricing.breakdown.current': '現在の使用量',
      'pricing.breakdown.included': '基本プラン込み',
      'pricing.breakdown.extra': '追加使用量',
      'pricing.breakdown.perUser': '/追加ユーザー',
      'pricing.breakdown.per1000Messages': '/1,000メッセージ',
      'pricing.breakdown.per100MB': '/100MB',
      'pricing.discountPreview': '定価: {{original}} → 割引価格: {{discounted}}',
      'pricing.otherCharges': 'その他料金',
      'pricing.otherCharges.add': '料金項目を追加',
      'pricing.otherCharges.name': '項目名',
      'pricing.otherCharges.amount': '金額',
      'pricing.otherCharges.note': '備考',
      'pricing.otherCharges.delete': '削除',
      'pricing.otherCharges.placeholder.name': '項目名を入力',
      'pricing.otherCharges.placeholder.note': '説明や備考を入力',
      'pricing.breakdown.otherCharges': 'その他料金',
      'pricing.otherCharges.empty': '追加料金なし',
      'pricing.otherCharges.error.name': '項目名を入力してください',
      'pricing.otherCharges.error.amount': '金額は0より大きい値を入力してください',
      'pricing.breakdown.basePrice': '基本料金',
      'pricing.otherCharges.save': '保存',
      'pricing.otherCharges.edit': '編集',
      'pricing.reset': '計算をリセット'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 