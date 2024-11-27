import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PricingTier, 
  AdditionalFeature, 
  Currency, 
  BASE_TIER, 
  PRICE_INCREMENTS, 
  BILLING_OPTIONS,
  CustomFeature,
  PriceBreakdown,
  CurrencyCode,
  LanguageCode,
  LocalizedFeature
} from '../types/pricing';
import { additionalFeatures } from '../constants/pricing';
import { SUPPORTED_CURRENCIES, fetchExchangeRates } from '../services/currency';
import '../styles/PricingCalculator.scss';

type StorageUnit = 'MB' | 'GB';

const LANGUAGE_OPTIONS = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' }
};

// 添加语言和默认货币的映射
const LANGUAGE_CURRENCY_MAP: Record<LanguageCode, CurrencyCode> = {
  en: 'USD',
  zh: 'CNY',
  ja: 'JPY'
};

interface ChargeError {
  name?: string;
  amount?: string;
}

interface ChargeItemState {
  isEditing: boolean;
  hasError: boolean;
}

const PricingCalculator: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // 改初始货币设置
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    const currencyCode = LANGUAGE_CURRENCY_MAP[i18n.language as LanguageCode] || 'USD';
    return {
      code: currencyCode,
      symbol: SUPPORTED_CURRENCIES[currencyCode].symbol,
      rate: 1,
      decimalSeparator: currencyCode === 'USD' ? '.' : ',',
      thousandsSeparator: currencyCode === 'USD' ? ',' : '.'
    };
  });
  
  const [calculatedPrice, setCalculatedPrice] = useState<number>(159);
  const [userCount, setUserCount] = useState<number>(3);
  const [messageCredits, setMessageCredits] = useState<number>(5000);
  const [vectorStorage, setVectorStorage] = useState<number>(200);
  const [storageUnit, setStorageUnit] = useState<StorageUnit>('MB');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // 添加货币汇率状态
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [yearlyDiscount, setYearlyDiscount] = useState<number>(0.2);
  const [isEditingDiscount, setIsEditingDiscount] = useState<boolean>(false);

  const [features, setFeatures] = useState<CustomFeature[]>([]);
  const [localizedFeatures, setLocalizedFeatures] = useState<LocalizedFeature[]>(additionalFeatures);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [isEditingGlobalDiscount, setIsEditingGlobalDiscount] = useState(false);
  const [discountInputValue, setDiscountInputValue] = useState<string>('0');
  const [vectorStorageInput, setVectorStorageInput] = useState<string>(vectorStorage.toString());
  const [chargeErrors, setChargeErrors] = useState<Record<string, ChargeError>>({});
  const [chargeItemStates, setChargeItemStates] = useState<Record<string, ChargeItemState>>({});

  // 获取汇率
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };
    loadExchangeRates();
  }, []);

  // 处理货币切换
  const handleCurrencyChange = (currencyCode: CurrencyCode) => {
    const rate = exchangeRates[currencyCode] || 1;
    const currency = SUPPORTED_CURRENCIES[currencyCode];
    setSelectedCurrency({
      code: currencyCode,
      symbol: currency.symbol,
      rate: rate,
      decimalSeparator: currencyCode === 'USD' ? '.' : ',',
      thousandsSeparator: currencyCode === 'USD' ? ',' : '.'
    });
  };

  // 渲染货币选择器
  const renderCurrencySelector = () => (
    <div className="currency-selector">
      <label>{t('pricing.currency')}</label>
      <select
        value={selectedCurrency.code}
        onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
      >
        {Object.entries(SUPPORTED_CURRENCIES).map(([code, { name }]) => (
          <option key={code} value={code}>
            {code} - {name}
          </option>
        ))}
      </select>
    </div>
  );

  // 修改账单周期选择器的渲染
  const renderBillingSelector = () => (
    <div className="billing-selector">
      <label>{t('pricing.billingCycle')}</label>
      <div className="billing-options">
        <label className="billing-option">
          <input
            type="radio"
            name="billing"
            value="monthly"
            checked={selectedBilling === 'monthly'}
            onChange={(e) => setSelectedBilling(e.target.value as 'monthly' | 'yearly')}
          />
          <span>{t('pricing.monthly')}</span>
        </label>
        <label className="billing-option">
          <input
            type="radio"
            name="billing"
            value="yearly"
            checked={selectedBilling === 'yearly'}
            onChange={(e) => setSelectedBilling(e.target.value as 'monthly' | 'yearly')}
          />
          <span>{t('pricing.yearly')}</span>
        </label>
      </div>
    </div>
  );

  // 转换存储大小为MB
  const convertToMB = (value: number, unit: StorageUnit): number => {
    return unit === 'GB' ? value * 1024 : value;
  };

  // 转换存储大小为显示单位
  const convertFromMB = (mb: number, unit: StorageUnit): number => {
    return unit === 'GB' ? mb / 1024 : mb;
  };

  // 更新价格计算逻辑
  const calculatePrice = () => {
    let total = BASE_TIER.basePrice;
    
    // 用户数调整
    if (userCount > BASE_TIER.teamMembers) {
      total += (userCount - BASE_TIER.teamMembers) * PRICE_INCREMENTS.teamMember;
    }
    
    // 消息额度调整
    if (messageCredits > BASE_TIER.messageCredits) {
      total += Math.ceil((messageCredits - BASE_TIER.messageCredits) / 1000) * PRICE_INCREMENTS.messageCredits;
    }
    
    // 向量存储调整（确保以MB为单位计算）
    const storageMB = convertToMB(vectorStorage, storageUnit);
    if (storageMB > BASE_TIER.vectorStorage) {
      total += Math.ceil((storageMB - BASE_TIER.vectorStorage) / 100) * PRICE_INCREMENTS.vectorStorage;
    }
    
    // 附加功能
    total += selectedFeatures.reduce((sum, featureId) => {
      const feature = additionalFeatures.find(f => f.id === featureId);
      return sum + (feature?.priceIncrement || 0);
    }, 0);

    setCalculatedPrice(total);
  };

  useEffect(() => {
    calculatePrice();
  }, [userCount, messageCredits, vectorStorage, selectedFeatures]);

  // 计算最终价格
  const calculateFinalPrice = (basePrice: number) => {
    if (selectedBilling === 'yearly') {
      return {
        monthly: basePrice,
        total: basePrice * 12
      };
    }
    return {
      monthly: basePrice,
      total: basePrice
    };
  };

  // 获取当前语言的特性名称和描述
  const getLocalizedFeature = (feature: LocalizedFeature) => ({
    ...feature,
    name: feature.name[i18n.language as LanguageCode] || feature.name.en,
    description: feature.description[i18n.language as LanguageCode] || feature.description.en
  });

  // 更新特性选择渲染
  const renderFeatureSelections = () => (
    <div className="feature-selections">
      <h3>{t('pricing.features')}</h3>
      <div className="features-grid">
        {localizedFeatures.map((feature) => {
          const localizedFeature = getLocalizedFeature(feature);
          return (
            <div key={feature.id} className="feature-item">
              <div className="feature-header">
                <label className="feature-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFeatures([...selectedFeatures, feature.id]);
                      } else {
                        setSelectedFeatures(selectedFeatures.filter(id => id !== feature.id));
                      }
                    }}
                  />
                  <span className="feature-name">{localizedFeature.name}</span>
                </label>
                <span className="feature-price">
                  +{selectedCurrency.symbol}{(feature.priceIncrement * selectedCurrency.rate).toFixed(2)}
                </span>
              </div>
              <p className="feature-description">{localizedFeature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 修改存储输入处理
  const handleStorageChange = (value: string) => {
    setVectorStorageInput(value);
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setVectorStorage(numValue);
    }
  };

  // 修改存储单位变化处理
  const handleStorageUnitChange = (newUnit: StorageUnit) => {
    setStorageUnit(newUnit);
    setVectorStorage(0);  // 重置存储值
    setVectorStorageInput('');  // 清空输入框
  };

  // 修改消息额度输入处理
  const handleMessageCreditsChange = (value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    if (!isNaN(numValue)) {
      setMessageCredits(numValue);
    }
  };

  // 添加团队成员输入处理
  const handleUserCountChange = (value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    if (!isNaN(numValue)) {
      setUserCount(numValue);
    }
  };

  // 添加新的收费项
  const handleAddCustomFeature = () => {
    const newFeature: CustomFeature = {
      id: `custom-${Date.now()}`,
      name: '',
      priceIncrement: 0,
      description: '',
      isCustom: true
    };
    setFeatures([...features, newFeature]);
    setChargeItemStates(prev => ({
      ...prev,
      [newFeature.id]: { isEditing: true, hasError: false }
    }));
  };

  // 保存收费项
  const handleSaveCharge = (id: string) => {
    const feature = features.find(f => f.id === id);
    if (feature && validateFeature(id, feature)) {
      setChargeItemStates(prev => ({
        ...prev,
        [id]: { ...prev[id], isEditing: false, hasError: false }
      }));
    } else {
      setChargeItemStates(prev => ({
        ...prev,
        [id]: { ...prev[id], hasError: true }
      }));
    }
  };

  // 编辑收费项
  const handleEditCharge = (id: string) => {
    setChargeItemStates(prev => ({
      ...prev,
      [id]: { ...prev[id], isEditing: true }
    }));
  };

  // 渲染收费项列表
  const renderChargeItem = (feature: CustomFeature) => {
    const state = chargeItemStates[feature.id] || { isEditing: true, hasError: false };

    if (state.isEditing) {
      return (
        <div key={feature.id} className="charge-item editing">
          <div className="charge-header">
            <div className="input-group">
              <label>{t('pricing.otherCharges.name')}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={feature.name}
                  onChange={(e) => handleEditFeature(feature.id, 'name', e.target.value)}
                  placeholder={t('pricing.otherCharges.placeholder.name')}
                  className={chargeErrors[feature.id]?.name ? 'error' : ''}
                />
              </div>
              {chargeErrors[feature.id]?.name && (
                <span className="error-message">{chargeErrors[feature.id].name}</span>
              )}
            </div>
            <div className="input-group amount-group">
              <label>{t('pricing.otherCharges.amount')}</label>
              <div className="input-wrapper">
                <span className="currency-symbol">{selectedCurrency.symbol}</span>
                <input
                  type="number"
                  value={feature.priceIncrement || ''}
                  onChange={(e) => handleEditFeature(feature.id, 'priceIncrement', Number(e.target.value))}
                  placeholder="0"
                  className={chargeErrors[feature.id]?.amount ? 'error' : ''}
                />
              </div>
              {chargeErrors[feature.id]?.amount && (
                <span className="error-message">{chargeErrors[feature.id].amount}</span>
              )}
            </div>
          </div>
          <div className="charge-note">
            <label>{t('pricing.otherCharges.note')}</label>
            <textarea
              value={feature.description}
              onChange={(e) => handleEditFeature(feature.id, 'description', e.target.value)}
              placeholder={t('pricing.otherCharges.placeholder.note')}
            />
          </div>
          <div className="charge-actions">
            <button 
              className="save-charge"
              onClick={() => handleSaveCharge(feature.id)}
            >
              {t('pricing.otherCharges.save')}
            </button>
            <button 
              className="delete-charge"
              onClick={() => handleDeleteFeature(feature.id)}
              title={t('pricing.otherCharges.delete')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={feature.id} className="charge-item saved">
        <div className="charge-content">
          <div className="charge-main">
            <h4>{feature.name}</h4>
            <span className="charge-amount">
              {selectedCurrency.symbol}{(feature.priceIncrement * selectedCurrency.rate).toFixed(2)}
            </span>
          </div>
          {feature.description && (
            <p className="charge-description">{feature.description}</p>
          )}
        </div>
        <div className="charge-actions">
          <button 
            className="edit-charge"
            onClick={() => handleEditCharge(feature.id)}
          >
            {t('pricing.otherCharges.edit')}
          </button>
          <button 
            className="delete-charge"
            onClick={() => handleDeleteFeature(feature.id)}
            title={t('pricing.otherCharges.delete')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // 修改添加自定义功能的处理
  const handleEditFeature = (id: string, field: keyof CustomFeature, value: string | number) => {
    setFeatures(features.map(feature => {
      if (feature.id === id) {
        const updatedFeature = { ...feature, [field]: value };
        validateFeature(id, updatedFeature);
        return updatedFeature;
      }
      return feature;
    }));
  };

  // 添加验证功能
  const validateFeature = (id: string, feature: CustomFeature) => {
    const errors: ChargeError = {};
    if (!feature.name.trim()) {
      errors.name = t('pricing.otherCharges.error.name');
    }
    if (feature.priceIncrement <= 0) {
      errors.amount = t('pricing.otherCharges.error.amount');
    }
    setChargeErrors(prev => ({
      ...prev,
      [id]: errors
    }));
    return Object.keys(errors).length === 0;
  };

  // 删除自定义功能
  const handleDeleteFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id));
    setSelectedFeatures(selectedFeatures.filter(featureId => featureId !== id));
  };

  // 计算价格明细
  const calculatePriceBreakdown = (): PriceBreakdown => {
    const teamMembersCost = userCount > BASE_TIER.teamMembers 
      ? (userCount - BASE_TIER.teamMembers) * PRICE_INCREMENTS.teamMember 
      : 0;

    const messageCreditsCost = messageCredits > BASE_TIER.messageCredits
      ? Math.ceil((messageCredits - BASE_TIER.messageCredits) / 1000) * PRICE_INCREMENTS.messageCredits
      : 0;

    const storageMB = convertToMB(vectorStorage, storageUnit);
    const vectorStorageCost = storageMB > BASE_TIER.vectorStorage
      ? Math.ceil((storageMB - BASE_TIER.vectorStorage) / 100) * PRICE_INCREMENTS.vectorStorage
      : 0;

    const additionalFeaturesCost = selectedFeatures.reduce((acc, featureId) => {
      const feature = features.find(f => f.id === featureId);
      if (feature) {
        acc[feature.name] = feature.priceIncrement;
      }
      return acc;
    }, {} as { [key: string]: number });

    const subtotal = BASE_TIER.basePrice + teamMembersCost + messageCreditsCost + 
      vectorStorageCost + Object.values(additionalFeaturesCost).reduce((a, b) => a + b, 0);

    const discount = subtotal * globalDiscount;

    return {
      basePrice: BASE_TIER.basePrice,
      teamMembersCost,
      messageCreditsCost,
      vectorStorageCost,
      additionalFeaturesCost,
      discount,
      total: subtotal - discount
    };
  };

  // 更新报价
  const handleUpdateQuote = () => {
    const breakdown = calculatePriceBreakdown();
    setPriceBreakdown(breakdown);
    setCalculatedPrice(breakdown.total);
    setShowPriceBreakdown(true);
  };

  // 修改价格明细渲染函数
  const renderPriceBreakdown = () => {
    if (!priceBreakdown || !showPriceBreakdown) return null;

    const hasAdditionalFeatures = Object.keys(priceBreakdown.additionalFeaturesCost).length > 0;
    const customFeatures = features.filter(f => f.isCustom);
    const hasCustomFeatures = customFeatures.length > 0;
    
    return (
      <div className="price-breakdown">
        <h3>{t('pricing.breakdown.title')}</h3>
        
        {/* 基础套餐内容 */}
        <div className="breakdown-section">
          <h4>{t('pricing.breakdown.basePackage')}</h4>
          <div className="base-package-details">
            <div className="package-item">
              <span>{t('pricing.users')}</span>
              <span>{BASE_TIER.teamMembers} {t('pricing.users.unit')}</span>
            </div>
            <div className="package-item">
              <span>{t('pricing.messageCredits')}</span>
              <span>{BASE_TIER.messageCredits.toLocaleString()} {t('pricing.messages.unit')}</span>
            </div>
            <div className="package-item">
              <span>{t('pricing.vectorStorage')}</span>
              <span>{(BASE_TIER.vectorStorage >= 1024 ? BASE_TIER.vectorStorage / 1024 : BASE_TIER.vectorStorage)} {BASE_TIER.vectorStorage >= 1024 ? 'GB' : 'MB'}</span>
            </div>
            <div className="package-item">
              <span>{t('pricing.buildApps')}</span>
              <span>{BASE_TIER.buildApps}</span>
            </div>
            <div className="package-item">
              <span>{t('pricing.documentsQuota')}</span>
              <span>{BASE_TIER.documentsQuota.toLocaleString()}</span>
            </div>
            <div className="package-item">
              <span>{t('pricing.annotationQuota')}</span>
              <span>{BASE_TIER.annotationQuota.toLocaleString()}</span>
            </div>
            <div className="package-item">
              <span>{t('pricing.customTools')}</span>
              <span>{BASE_TIER.customTools}</span>
            </div>
          </div>
          <div className="base-price">
            <span>{t('pricing.breakdown.basePrice')}</span>
            <span>{selectedCurrency.symbol}{(BASE_TIER.basePrice * selectedCurrency.rate).toFixed(2)}</span>
          </div>
        </div>

        {/* 额外费用明细 */}
        <div className="breakdown-section">
          <h4>{t('pricing.breakdown.additionalCosts')}</h4>
          
          {/* 团队成员费用 */}
          {priceBreakdown.teamMembersCost > 0 && (
            <div className="breakdown-item">
              <div className="item-details">
                <div className="item-header">
                  <span>{t('pricing.breakdown.teamMembers')}</span>
                  <span>{selectedCurrency.symbol}{(priceBreakdown.teamMembersCost * selectedCurrency.rate).toFixed(2)}</span>
                </div>
                <div className="calculation-details">
                  <div className="calc-row">
                    <span>{t('pricing.breakdown.current')}: {userCount} {t('pricing.users.unit')}</span>
                    <span>{t('pricing.breakdown.included')}: {BASE_TIER.teamMembers} {t('pricing.users.unit')}</span>
                    <span>{t('pricing.breakdown.extra')}: {userCount - BASE_TIER.teamMembers} {t('pricing.users.unit')}</span>
                  </div>
                  <div className="calc-formula">
                    {userCount - BASE_TIER.teamMembers} × {selectedCurrency.symbol}{(PRICE_INCREMENTS.teamMember * selectedCurrency.rate).toFixed(2)} {t('pricing.breakdown.perUser')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 消息额度费用 */}
          {priceBreakdown.messageCreditsCost > 0 && (
            <div className="breakdown-item">
              <div className="item-details">
                <div className="item-header">
                  <span>{t('pricing.breakdown.messageCredits')}</span>
                  <span>{selectedCurrency.symbol}{(priceBreakdown.messageCreditsCost * selectedCurrency.rate).toFixed(2)}</span>
                </div>
                <div className="calculation-details">
                  <div className="calc-row">
                    <span>{t('pricing.breakdown.current')}: {messageCredits.toLocaleString()} {t('pricing.messages.unit')}</span>
                    <span>{t('pricing.breakdown.included')}: {BASE_TIER.messageCredits.toLocaleString()} {t('pricing.messages.unit')}</span>
                    <span>{t('pricing.breakdown.extra')}: {(messageCredits - BASE_TIER.messageCredits).toLocaleString()} {t('pricing.messages.unit')}</span>
                  </div>
                  <div className="calc-formula">
                    {Math.ceil((messageCredits - BASE_TIER.messageCredits) / 1000)} × {selectedCurrency.symbol}{(PRICE_INCREMENTS.messageCredits * selectedCurrency.rate).toFixed(2)} {t('pricing.breakdown.per1000Messages')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 向量存储费用 */}
          {priceBreakdown.vectorStorageCost > 0 && (
            <div className="breakdown-item">
              <div className="item-details">
                <div className="item-header">
                  <span>{t('pricing.breakdown.vectorStorage')}</span>
                  <span>{selectedCurrency.symbol}{(priceBreakdown.vectorStorageCost * selectedCurrency.rate).toFixed(2)}</span>
                </div>
                <div className="calculation-details">
                  <div className="calc-row">
                    <span>{t('pricing.breakdown.current')}: {vectorStorage} {storageUnit}</span>
                    <span>{t('pricing.breakdown.included')}: {BASE_TIER.vectorStorage >= 1024 ? `${BASE_TIER.vectorStorage / 1024} GB` : `${BASE_TIER.vectorStorage} MB`}</span>
                    <span>{t('pricing.breakdown.extra')}: {(convertToMB(vectorStorage, storageUnit) - BASE_TIER.vectorStorage).toFixed(0)} MB</span>
                  </div>
                  <div className="calc-formula">
                    {Math.ceil((convertToMB(vectorStorage, storageUnit) - BASE_TIER.vectorStorage) / 100)} × {selectedCurrency.symbol}{(PRICE_INCREMENTS.vectorStorage * selectedCurrency.rate).toFixed(2)} {t('pricing.breakdown.per100MB')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 附加功能 - 只在有选择时显示 */}
        {hasAdditionalFeatures && (
          <div className="breakdown-section">
            <h4>{t('pricing.breakdown.additionalFeatures')}</h4>
            {Object.entries(priceBreakdown.additionalFeaturesCost).map(([name, cost]) => (
              <div key={name} className="breakdown-item">
                <span>{name}</span>
                <span>{`${selectedCurrency.symbol}${(cost * selectedCurrency.rate).toFixed(2)}`}</span>
              </div>
            ))}
          </div>
        )}

        {/* 其他收费项 - 只在有内容时显示 */}
        {hasCustomFeatures && (
          <div className="breakdown-section">
            <h4>{t('pricing.breakdown.otherCharges')}</h4>
            {customFeatures.map(feature => (
              <div key={feature.id} className="breakdown-item">
                <div className="charge-details">
                  <span className="charge-name">{feature.name}</span>
                  {feature.description && (
                    <span className="charge-note">{feature.description}</span>
                  )}
                </div>
                <span className="charge-amount">
                  {selectedCurrency.symbol}{(feature.priceIncrement * selectedCurrency.rate).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 折扣和总价 */}
        {priceBreakdown.discount > 0 && (
          <div className="breakdown-item discount">
            <span>{t('pricing.breakdown.discount')}</span>
            <span>-{selectedCurrency.symbol}{(priceBreakdown.discount * selectedCurrency.rate).toFixed(2)}</span>
          </div>
        )}
        <div className="breakdown-item total">
          <span>{t('pricing.breakdown.total')}</span>
          <span>{selectedCurrency.symbol}{(priceBreakdown.total * selectedCurrency.rate).toFixed(2)}</span>
        </div>
      </div>
    );
  };

  // 修改其他收费项的渲染
  const renderOtherCharges = () => (
    <div className="other-charges">
      <h3>
        {t('pricing.otherCharges')}
        <button 
          className="add-charge-button"
          onClick={handleAddCustomFeature}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('pricing.otherCharges.add')}
        </button>
      </h3>
      
      {features.filter(f => f.isCustom).length === 0 ? (
        <div className="empty-charges">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v.01M12 8v.01M12 12v.01M12 16v.01M12 20v.01" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('pricing.otherCharges.empty')}
        </div>
      ) : (
        <div className="charges-list">
          {features.filter(f => f.isCustom).map(renderChargeItem)}
        </div>
      )}
    </div>
  );

  // 修改全局折扣的渲染
  const renderGlobalDiscount = () => (
    <div className="global-discount">
      <div className="discount-header">
        <label>{t('pricing.globalDiscount')}</label>
        <div className="discount-value" onClick={() => setIsEditingGlobalDiscount(!isEditingGlobalDiscount)}>
          {isEditingGlobalDiscount ? (
            <input
              type="text"
              value={discountInputValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d{0,3}$/.test(value)) {
                  setDiscountInputValue(value);
                  if (value !== '') {
                    const numValue = Math.min(100, Number(value));
                    setGlobalDiscount(numValue / 100);
                  }
                }
              }}
              onBlur={() => {
                setIsEditingGlobalDiscount(false);
                if (discountInputValue === '') {
                  setDiscountInputValue('0');
                  setGlobalDiscount(0);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (discountInputValue === '') {
                    setDiscountInputValue('0');
                    setGlobalDiscount(0);
                  }
                  setIsEditingGlobalDiscount(false);
                }
              }}
              autoFocus
            />
          ) : (
            <span>{(globalDiscount * 100).toFixed(0)}%</span>
          )}
        </div>
      </div>
      <div className="discount-slider">
        <input
          type="range"
          min="0"
          max="100"
          value={globalDiscount * 100}
          onChange={(e) => {
            const value = Number(e.target.value);
            setGlobalDiscount(value / 100);
            setDiscountInputValue(value.toString());
          }}
          className="slider"
        />
        <div className="slider-marks">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
      {globalDiscount > 0 && (
        <div className="discount-preview">
          {t('pricing.discountPreview', {
            original: selectedCurrency.symbol + (calculatedPrice * selectedCurrency.rate).toFixed(2),
            discounted: selectedCurrency.symbol + (calculatedPrice * (1 - globalDiscount) * selectedCurrency.rate).toFixed(2)
          })}
        </div>
      )}
    </div>
  );

  // 修改语言和货币选择器的渲染
  const renderLanguageAndCurrencySelectors = () => (
    <div className="header-controls">
      <div className="language-selector">
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          {Object.entries(LANGUAGE_OPTIONS).map(([code, { name, flag }]) => (
            <option key={code} value={code}>
              {flag} {name}
            </option>
          ))}
        </select>
      </div>
      <div className="currency-selector">
        <select
          value={selectedCurrency.code}
          onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
        >
          {Object.entries(SUPPORTED_CURRENCIES).map(([code, { name }]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  // 添加语言变化监听
  useEffect(() => {
    const currencyCode = LANGUAGE_CURRENCY_MAP[i18n.language as LanguageCode];
    if (currencyCode && currencyCode !== selectedCurrency.code) {
      handleCurrencyChange(currencyCode);
    }
  }, [i18n.language]);

  // 添加重新计算函数
  const handleReset = () => {
    setUserCount(BASE_TIER.teamMembers);
    setMessageCredits(BASE_TIER.messageCredits);
    setVectorStorage(BASE_TIER.vectorStorage);
    setVectorStorageInput(BASE_TIER.vectorStorage.toString());
    setStorageUnit('MB');
    setSelectedFeatures([]);
    setFeatures([]);
    setGlobalDiscount(0);
    setDiscountInputValue('0');
    setShowPriceBreakdown(false);
    setPriceBreakdown(null);
  };

  return (
    <div className="pricing-calculator" lang={i18n.language}>
      <div className="calculator-header">
        <h2 lang={i18n.language}>{t('pricing.calculator.title')}</h2>
        {renderLanguageAndCurrencySelectors()}
      </div>
      
      {renderBillingSelector()}
      
      <div className="pricing-inputs">
        <div className="input-group">
          <label>{t('pricing.users')}</label>
          <div className="input-with-label">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userCount}
              onChange={(e) => handleUserCountChange(e.target.value)}
            />
            <span className="input-label">{t('pricing.users.unit')}</span>
          </div>
          {userCount < BASE_TIER.teamMembers && (
            <span className="input-hint warning">
              {t('pricing.minimum')} {BASE_TIER.teamMembers} {t('pricing.users.unit')}
            </span>
          )}
        </div>

        <div className="input-group">
          <label>{t('pricing.messageCredits')}</label>
          <div className="input-with-label">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={messageCredits}
              onChange={(e) => handleMessageCreditsChange(e.target.value)}
            />
            <span className="input-label">{t('pricing.messages.unit')}</span>
          </div>
          {messageCredits < 5000 && (
            <span className="input-hint warning">
              {t('pricing.minimum')} 5,000 {t('pricing.messages.unit')}
            </span>
          )}
        </div>

        <div className="input-group">
          <label>{t('pricing.vectorStorage')}</label>
          <div className="input-with-unit">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              value={vectorStorageInput}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleStorageChange(value);
                }
              }}
            />
            <select
              value={storageUnit}
              onChange={(e) => handleStorageUnitChange(e.target.value as StorageUnit)}
              className="unit-selector"
            >
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
          {convertToMB(vectorStorage, storageUnit) < BASE_TIER.vectorStorage && (
            <span className="input-hint warning">
              {t('pricing.minimum')} {storageUnit === 'GB' ? '0.2 GB' : '200 MB'}
            </span>
          )}
        </div>
      </div>

      {renderFeatureSelections()}

      <div className="total-price">
        {selectedBilling === 'yearly' ? (
          <>
            <h3>
              {selectedCurrency.symbol}
              {(calculateFinalPrice(calculatedPrice).total * selectedCurrency.rate).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              /{t('pricing.perYear')}
            </h3>
            <p className="monthly-equivalent">
              {t('pricing.equivalentTo')} {selectedCurrency.symbol}
              {(calculateFinalPrice(calculatedPrice).monthly * selectedCurrency.rate).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              /{t('pricing.perMonth')}
            </p>
          </>
        ) : (
          <h3>
            {selectedCurrency.symbol}
            {(calculatedPrice * selectedCurrency.rate).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
            /{t('pricing.perMonth')}
          </h3>
        )}
      </div>

      {renderGlobalDiscount()}

      {renderOtherCharges()}

      <div className="calculator-actions">
        <button className="reset-button" onClick={handleReset}>
          {t('pricing.reset')}
        </button>
        <button className="update-quote" onClick={handleUpdateQuote}>
          {t('pricing.updateQuote')}
        </button>
      </div>

      {renderPriceBreakdown()}
    </div>
  );
};

export default PricingCalculator; 