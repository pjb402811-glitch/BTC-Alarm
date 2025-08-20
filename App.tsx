import React, { useState, useEffect } from 'react';
import type { IndicatorData, IndicatorStatus, RangeVisual } from './types';
import Header from './components/Header';
import RecommendationDisplay from './components/RecommendationDisplay';
import IndicatorGrid from './components/IndicatorGrid';
import Footer from './components/Footer';

const initialIndicators: IndicatorData[] = [
  {
    id: 'cycle',
    title: '1. 반감기 사이클 분석',
    concept: '비트코인 반감기를 기준으로 시장의 장기적인 고점과 저점 시기를 예측',
    value: 0, // Will be calculated automatically
    unit: '일',
    status: 'neutral',
    description: '관망',
    details: '역사적으로 비트코인 사이클은 반감기 후 800~1000일 사이가 매수하기 좋은 시점. 이 기간은 일반적으로 시장의 축적 단계에 해당.',
    buyZoneLabel: '800-1000일',
    sellZoneLabel: '500-600일 (과열)',
    visual: {
      type: 'range',
      style: 'blocks',
      min: 0,
      max: 1300,
      buyMin: 800,
      buyMax: 1000,
      sellMin: 500,
      sellMax: 600,
      dateLabels: [0, 500, 600, 800, 900, 1000],
      intermediateLabels: [
        { value: 0, text: '0' },
        { value: 400, text: '400' },
        { value: 500, text: '500' },
        { value: 600, text: '600' },
        { value: 700, text: '700' },
        { value: 800, text: '800' },
        { value: 900, text: '900' },
        { value: 1000, text: '1000' },
        { value: 1300, text: '1300' },
      ]
    },
    cycleStartDate: '2024-04-20',
    nextCycleEstimateDate: '2028년 4월 (예상)',
  },
  {
    id: 'realized_price',
    title: '2. Long-Term Holder Realized Price',
    concept: '장기 보유자의 평균 매입 단가와 현재 BTC 가격을 비교하여 저평가 구간을 판단',
    value: 67123.45, // BTC Price
    value2: 58345.67, // LTH Realized Price
    unit: '$',
    status: 'neutral',
    description: '관망',
    details: '비트코인 장기 보유자 실현 가격(Long-Term Holder Realized Price)은 장기 보유자들이 마지막으로 코인을 옮겼을 때의 평균 가격을 나타냄. 현재 BTC 가격이 이 실현 가격보다 낮아지면, 역사적으로 강력한 매수 기회. 이는 시장이 극심한 공포 상태에 있으며, 장기 보유자들조차 평균적으로 손실을 보고 있다는 의미이기 때문.',
    buyZoneLabel: 'BTC Price < LTHRP',
    sellZoneLabel: '해당 없음',
    visual: {
      type: 'comparison',
      value1Label: 'BTC Price',
      value2Label: 'LTH Realized Price',
    },
    sourceUrl: 'https://www.bitcoinmagazinepro.com/charts/long-term-holder-realized-price/'
  },
  {
    id: 'mvrv',
    title: '3. MVRV Z-Score',
    concept: '비트코인의 현재 가치가 실현 가치 대비 고평가/저평가 되었는지 측정',
    value: 2.65, 
    unit: '',
    status: 'neutral',
    description: '관망',
    details: 'MVRV Z-Score는 비트코인 사이클의 최고점(빨간색)과 최저점(초록색)을 예측하는 지표. 0 이하일 때 매수, 7 이상일 때 매도 시그널로 간주됨.',
    buyZoneLabel: '< 0',
    sellZoneLabel: '> 7 (과열)',
    visual: {
      type: 'range',
      style: 'gradient',
      min: -1,
      max: 8,
      buyMin: -1,
      buyMax: 0,
      sellMin: 7,
      sellMax: 8,
      intermediateLabels: [
        { value: 2, text: '2' },
        { value: 4, text: '4' },
        { value: 6, text: '6' },
      ]
    },
    sourceUrl: 'https://www.bitcoinmagazinepro.com/charts/mvrv-zscore/'
  },
  {
    id: 'nupl',
    title: '4. NUPL',
    concept: '시장 참여자들의 전반적인 미실현 수익/손실 상태를 보여주는 심리 지표',
    value: 0.56,
    unit: '%',
    status: 'neutral',
    description: '관망',
    details: 'NUPL은 시장 참여자들의 전반적인 수익성을 나타냄. \'Capitulation\'(항복, <0) 단계가 매수, \'Euphoria\'(환희, >0.75) 단계가 매도 시그널.',
    buyZoneLabel: '< 0%',
    sellZoneLabel: '> 75%',
     visual: {
      type: 'nupl',
      min: -0.5,
      max: 1,
    },
    sourceUrl: 'https://www.bitcoinmagazinepro.com/charts/relative-unrealized-profit--loss/'
  },
  {
    id: 'puell',
    title: '5. Puell Multiple',
    concept: '채굴자 수익성을 기준으로 시장의 고점과 저점을 판단',
    value: 1.45,
    unit: '',
    status: 'neutral',
    description: '관망',
    details: 'Puell Multiple은 채굴자들의 수익성을 측정하는 지표. 이 값이 0.5 이하로 떨어지면 역사적으로 매수하기 좋은 시점이었고(채굴자 항복), 4 이상으로 올라가면 시장 과열로 매도 시그널로 간주됨.',
    buyZoneLabel: '< 0.5',
    sellZoneLabel: '> 4 (과열)',
    visual: {
      type: 'range',
      style: 'gradient',
      min: 0,
      max: 5,
      buyMin: 0,
      buyMax: 0.5,
      sellMin: 4,
      sellMax: 5,
      intermediateLabels: [
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
      ]
    },
    sourceUrl: 'https://www.bitcoinmagazinepro.com/charts/puell-multiple/'
  },
];

const App: React.FC = () => {
  const [indicators, setIndicators] = useState<IndicatorData[]>(() => {
    const saved = localStorage.getItem('btc-indicator-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse indicators from localStorage', e);
      }
    }
    return initialIndicators;
  });

  const [recommendation, setRecommendation] = useState({
    current: 'wait' as 'buy' | 'wait' | 'sell',
    text: '',
    buyLevel: 0,
    sellLevel: 0,
  });
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  // Save to localStorage whenever indicators change
  useEffect(() => {
    localStorage.setItem('btc-indicator-data', JSON.stringify(indicators));
  }, [indicators]);

  const updateIndicatorStatus = (indicator: IndicatorData): IndicatorData => {
    let status: IndicatorStatus = 'neutral';
    let description = '관망';

    if (indicator.visual.type === 'range') {
      const visual = indicator.visual;
      if (indicator.value >= visual.buyMin && indicator.value <= visual.buyMax) {
        status = 'good';
        description = '매수';
      } else if (indicator.value >= visual.sellMin && indicator.value <= visual.sellMax) {
        status = 'bad';
        description = '매도';
      }
    } else if (indicator.id === 'nupl') {
      if (indicator.value < 0) {
        status = 'good';
        description = '매수';
      } else if (indicator.value > 0.75) {
        status = 'bad';
        description = '매도';
      }
    } else if (indicator.id === 'realized_price' && indicator.value2 !== undefined) {
      if (indicator.value < indicator.value2) {
        status = 'good';
        description = '매수';
      }
    }

    return { ...indicator, status, description };
  };

  const calculateOverallRecommendation = (updatedIndicators: IndicatorData[]) => {
    const goodCount = updatedIndicators.filter(ind => ind.status === 'good').length;
    const badCount = updatedIndicators.filter(ind => ind.status === 'bad').length;

    let current: 'buy' | 'wait' | 'sell' = 'wait';
    let text = '';
    
    // Total indicators minus the cycle one which is for context
    const totalRelevantIndicators = updatedIndicators.filter(ind => ind.id !== 'cycle').length;
    // We need at least 2 indicators to suggest buying
    const buyThreshold = 2;
    
    if (goodCount >= buyThreshold) {
      current = 'buy';
      text = `${totalRelevantIndicators}개 지표 중 ${goodCount}개가 매수 추천 구간에 있습니다.\n종합적으로 볼 때, 현재는 비트코인 현물 투자를 위한 분할매수고려`;
    } else if (badCount > 0) {
      current = 'sell';
      text = `${totalRelevantIndicators}개 지표 중 ${badCount}개가 매도 고려 구간에 있습니다.\n종합적으로 볼 때, 현재는 리스크 관리가 필요한 시점으로 분할매도 고려`;
    } else {
      current = 'wait';
      text = `대부분의 지표가 중립 구간에 있습니다.\n종합적으로 볼 때, 시장 방향성을 확인하며 관망`;
    }
    
    setRecommendation({
      current,
      text,
      buyLevel: goodCount,
      sellLevel: badCount
    });
  };

  const updateIndicatorValue = (id: string, values: { value?: number, value2?: number }) => {
    setIndicators(prevIndicators => {
      const newIndicators = prevIndicators.map(indicator => {
        if (indicator.id === id) {
          const updatedIndicator = { ...indicator, ...values };
          return updateIndicatorStatus(updatedIndicator);
        }
        return indicator;
      });
      calculateOverallRecommendation(newIndicators);
      return newIndicators;
    });
  };

  useEffect(() => {
    const fetchBTCPrice = async () => {
      setIsLoadingPrice(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const btcPrice = data.bitcoin.usd;
        
        // Use a callback with setIndicators to ensure we are updating based on the latest state
        setIndicators(prev => {
           const newIndicators = prev.map(ind => 
              ind.id === 'realized_price' ? { ...ind, value: btcPrice } : ind
           );
           // Recalculate everything after price update
           const fullyUpdated = newIndicators.map(updateIndicatorStatus);
           calculateOverallRecommendation(fullyUpdated);
           return fullyUpdated;
        });

      } catch (error) {
        console.error("Failed to fetch BTC price:", error);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    const initializeIndicators = () => {
        setIndicators(prev => {
            const updated = prev.map(indicator => {
                if (indicator.id === 'cycle' && indicator.cycleStartDate) {
                    const startDate = new Date(indicator.cycleStartDate);
                    const today = new Date();
                    const diffTime = Math.abs(today.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return { ...indicator, value: diffDays };
                }
                return indicator;
            });
            const fullyUpdated = updated.map(updateIndicatorStatus);
            calculateOverallRecommendation(fullyUpdated);
            return fullyUpdated;
        });
    };

    fetchBTCPrice();
    initializeIndicators();
    // This effect should run once on mount to fetch live data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen text-slate-200 bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 space-y-12">
          <section id="recommendation">
             <h2 className="text-2xl font-bold text-slate-200 mb-4 text-center">종합판단</h2>
            <RecommendationDisplay
              currentRecommendation={recommendation.current}
              text={recommendation.text}
              buyLevel={recommendation.buyLevel}
              sellLevel={recommendation.sellLevel}
            />
          </section>

          <section id="indicators">
            <IndicatorGrid indicators={indicators} onUpdateIndicator={updateIndicatorValue} isLoadingPrice={isLoadingPrice} />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;