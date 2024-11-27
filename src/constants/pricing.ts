import { AdditionalFeature } from '../types/pricing';

interface LocalizedFeature extends Omit<AdditionalFeature, 'name' | 'description'> {
  name: {
    en: string;
    zh: string;
    ja: string;
  };
  description: {
    en: string;
    zh: string;
    ja: string;
  };
}

export const additionalFeatures: LocalizedFeature[] = [
  {
    id: 'sso',
    name: {
      en: 'SSO Integration',
      zh: '单点登录集成',
      ja: 'シングルサインオン統合'
    },
    priceIncrement: 80,
    description: {
      en: 'Single Sign-On with SAML and OIDC support',
      zh: '支持 SAML 和 OIDC 的单点登录',
      ja: 'SAML と OIDC に対応したシングルサインオン'
    }
  },
  {
    id: 'multimodal',
    name: {
      en: 'Multimodal RAG',
      zh: '多模态 RAG',
      ja: 'マルチモーダル RAG'
    },
    priceIncrement: 120,
    description: {
      en: 'Support for image, audio and video processing',
      zh: '支持图像、音频和视频处理',
      ja: '画像、音声、動画処理に対応'
    }
  },
  {
    id: 'agent',
    name: {
      en: 'Agent Mode',
      zh: '智能代理模式',
      ja: 'エージェントモード'
    },
    priceIncrement: 150,
    description: {
      en: 'Advanced autonomous agent capabilities',
      zh: '高级自主代理功能',
      ja: '高度な自律エージェント機能'
    }
  },
  {
    id: 'workflow',
    name: {
      en: 'Workflow Automation',
      zh: '工作流自动化',
      ja: 'ワークフロー自動化'
    },
    priceIncrement: 100,
    description: {
      en: 'Custom workflow automation tools',
      zh: '自定义工作流自动化工具',
      ja: 'カスタムワークフロー自動化ツール'
    }
  },
  {
    id: 'priority',
    name: {
      en: 'Priority Support',
      zh: '优先支持服务',
      ja: 'プライオリティサポート'
    },
    priceIncrement: 60,
    description: {
      en: '24/7 priority support with dedicated account manager',
      zh: '24/7 优先支持服务，配备专属客户经理',
      ja: '24時間365日の優先サポートと専任アカウントマネージャー'
    }
  }
]; 