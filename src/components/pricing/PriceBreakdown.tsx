'use client'

export function PriceBreakdown({ pricing, features, className }: PriceBreakdownProps) {
  // 使用传入的自定义价格
  const calculateBasicCosts = () => {
    // 确保不低于最小值
    const actualUsers = Math.max(pricing.users, BASE_PRICING.minUsers);
    const actualMessages = Math.max(pricing.messageCredits, BASE_PRICING.minMessages);
    
    // 转换存储单位到MB
    const storageInMB = pricing.storageUnit === 'GB' ? pricing.vectorStorage * 1024 : pricing.vectorStorage;
    const actualStorage = Math.max(storageInMB, BASE_PRICING.minStorage);

    // 使用自定义价格计算
    const userCost = actualUsers * pricing.basePricing.userPrice;
    const messageUnits = Math.ceil(actualMessages / BASE_PRICING.messageUnit);
    const messageCost = messageUnits * pricing.basePricing.messagePrice;
    const storageUnits = Math.ceil(actualStorage / BASE_PRICING.storageUnit);
    const storageCost = storageUnits * pricing.basePricing.storagePrice;

    return {
      userCost,
      messageCost,
      storageCost
    };
  };

  // 计算附加功能费用
  const calculateFeatureCosts = () => {
    return pricing.selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId);
      if (!feature) return total;
      
      if (feature.billingType === 'monthly') {
        return total + feature.price;
      }
      // 一次性费用按12个月分摊
      return total + (feature.price / 12);
    }, 0);
  };

  const basicCosts = calculateBasicCosts();
  const featureCosts = calculateFeatureCosts();
  
  // 计算月度总费用
  const monthlyTotal = basicCosts.userCost + basicCosts.messageCost + basicCosts.storageCost + featureCosts;
  
  // 如果是年付，应用折扣
  const finalTotal = pricing.billingCycle === 'yearly' && pricing.yearlyDiscountEnabled
    ? monthlyTotal * 12 * (1 - pricing.yearlyDiscountRate)
    : monthlyTotal * (pricing.billingCycle === 'yearly' ? 12 : 1);

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        价格明细
      </h3>
      
      {/* 基础服务费用 */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">用户许可</p>
            <p className="text-xs text-gray-500">
              {pricing.users} 用户 × ${pricing.basePricing.userPrice}/用户
            </p>
          </div>
          <p className="text-lg font-medium text-gray-900">
            ${basicCosts.userCost}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">消息额度</p>
            <p className="text-xs text-gray-500">
              {Math.ceil(pricing.messageCredits / BASE_PRICING.messageUnit)} 
              × ${pricing.basePricing.messagePrice}/{BASE_PRICING.messageUnit}条
            </p>
          </div>
          <p className="text-lg font-medium text-gray-900">
            ${basicCosts.messageCost}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">存储空间</p>
            <p className="text-xs text-gray-500">
              {Math.ceil((pricing.storageUnit === 'GB' ? pricing.vectorStorage * 1024 : pricing.vectorStorage) / BASE_PRICING.storageUnit)} 
              × ${pricing.basePricing.storagePrice}/{BASE_PRICING.storageUnit}MB
            </p>
          </div>
          <p className="text-lg font-medium text-gray-900">
            ${basicCosts.storageCost}
          </p>
        </div>
      </div>

      {/* 附加功能费用 */}
      {pricing.selectedFeatures.length > 0 && (
        <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">附加功能</h4>
          {pricing.selectedFeatures.map(featureId => {
            const feature = features.find(f => f.id === featureId);
            if (!feature) return null;
            
            return (
              <div key={feature.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-900">{feature.name}</p>
                  {feature.billingType === 'onetime' && (
                    <p className="text-xs text-gray-500">一次性费用按12个月分摊</p>
                  )}
                </div>
                <p className="text-lg font-medium text-gray-900">
                  ${feature.billingType === 'monthly' ? feature.price : Math.round(feature.price / 12)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 总计 */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-900">月度总费用</p>
          <p className="text-lg font-medium text-gray-900">${monthlyTotal}</p>
        </div>
        
        {pricing.billingCycle === 'yearly' && pricing.yearlyDiscountEnabled && (
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <p>年付优惠 (-{(pricing.yearlyDiscountRate * 100).toFixed(0)}%)</p>
            <p>-${(monthlyTotal * 12 * pricing.yearlyDiscountRate).toFixed(2)}</p>
          </div>
        )}
        
        {pricing.billingCycle === 'yearly' && (
          <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-900">年付总额</p>
            <p className="text-2xl font-bold text-primary-600">
              ${finalTotal.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 