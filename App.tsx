
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
    description: '관망 구간',
    details: '역사적으로 비트코인 사이클은 반감기 후 800~1000일 사이가 매수하기 좋은 시점. 이 기간은 일반적으로 시장의 축적 단계에 해당.',
    buyZoneLabel: '800-1000일',
    sellZoneLabel: '500-600일 (과열)',
    visual: {
      type: 'range',
      style: 'blocks',
      min: 0,
      max: 1600,
      buyMin: 800,
      buyMax: 1000,
      sellMin: 500,
      sellMax: 600,
      dateLabels: [0, 500, 800, 1000],
      intermediateLabels: [
        { value: 0, text: '0' },
        { value: 500, text: '500' },
        { value: 800, text: '800' },
        { value: 1000, text: '1000' },
      ]
    },
    cycleStartDate: '2024-04-20',
    nextCycleEstimateDate: '2028년 4월 (예상)',
  },
  {
    id: 'realized_price',
    title: '2. 실현 가격 (Realized Price)',
    concept: '장기 보유자의 평균 매입 단가와 현재 BTC 가격을 비교하여 저평가 구간을 판단',
    value: 67123.45, // BTC Price
    value2: 58345.67, // LTH Realized Price
    unit: '$',
    status: 'neutral',
    description: '관망 구간',
    details: '비트코인 장기 보유자 실현 가격(Long-Term Holder Realized Price)은 장기 보유자들이 마지막으로 코인을 옮겼을 때의 평균 가격을 나타냄. 현재 BTC 가격이 이 실현 가격보다 낮아지면, 역사적으로 강력한 매수 기회. 이는 시장이 극심한 공포 상태에 있으며, 장기 보유자들조차 평균적으로 손실을 보고 있다는 의미이기 때문.',
    buyZoneLabel: 'BTC Price < LTH 실현가',
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
    description: '관망 구간',
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
    title: '4. NUPL (미실현 손익)',
    concept: '시장 참여자들의 전반적인 미실현 수익/손실 상태를 보여주는 심리 지표',
    value: 0.56, 
    unit: '',
    status: 'neutral',
    description: '관망 구간',
    details: 'NUPL은 시장 참여자들의 전반적인 수익성을 나타냄. \'Capitulation\'(항복, <0) 단계가 매수, \'Euphoria\'(환희, >0.75) 단계가 매도 시그널.',
    buyZoneLabel: '< 0 (Capitulation)',
    sellZoneLabel: '> 0.75 (Euphoria)',
     visual: {
      type: 'nupl',
      min: -0.5,
      max: 1,
    },
    sourceUrl: 'https://www.bitcoinmagazinepro.com/charts/puell-multiple/'
  },
  {
    id: 'puell',
    title: '5. Puell Multiple',
    concept: '채굴자들의 수익성을 분석하여 시장의 바닥과 천장 신호를 파악',
    value: 1.82, 
    unit: '',
    status: 'neutral',
    description: '관망 구간',
    details: 'Puell Multiple은 채굴자 수익성 지표. 0.5 이하(녹색)일 때 매수, 4 이상(빨간색)일 때 매도 시그널로 간주됨.',
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
  }
];

const getIndicatorStatus = (indicator: IndicatorData): { status: IndicatorStatus, description: string } => {
  const { id, value, value2, visual } = indicator;

  switch (id) {
    case 'cycle':
    case 'mvrv':
    case 'puell':
      if (visual.type === 'range') {
        const { buyMin, buyMax, sellMin, sellMax } = visual as RangeVisual;
        if (value >= buyMin && value <= buyMax) {
          return { status: 'good', description: '매수 추천 구간' };
        }
        if (value >= sellMin && value <= sellMax) {
          return { status: 'bad', description: '매도 고려 구간' };
        }
      }
      break;
    case 'realized_price':
      if (value2 !== undefined && value < value2) {
        return { status: 'good', description: '매수 추천 구간' };
      }
      return { status: 'neutral', description: '관망 구간' };
    case 'nupl':
      if (value < 0) {
        return { status: 'good', description: '매수 추천 구간 (항복)' };
      }
      if (value > 0.75) {
        return { status: 'bad', description: '매도 고려 구간 (환희)' };
      }
      break;
    default:
      break;
  }
  return { status: 'neutral', description: '관망 구간' };
};

interface RecommendationResult {
  recommendation: 'buy' | 'wait' | 'sell';
  text: string;
  buyLevel: number;
  sellLevel: number;
}

const App: React.FC = () => {
  const [indicators, setIndicators] = useState<IndicatorData[]>(initialIndicators);
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(true);

  const handleUpdateIndicator = (id: string, newValues: { value?: number, value2?: number }) => {
    setIndicators(prevIndicators => 
      prevIndicators.map(ind => {
        if (ind.id === id) {
          const updatedInd = { ...ind, ...newValues };
          const { status, description } = getIndicatorStatus(updatedInd);
          updatedInd.status = status;
          updatedInd.description = description;
          return updatedInd;
        }
        return ind;
      })
    );
  };

  useEffect(() => {
    setIndicators(prevIndicators =>
      prevIndicators.map(ind => {
        let newInd = { ...ind };
        if (ind.id === 'cycle' && ind.cycleStartDate) {
          const startDate = new Date(ind.cycleStartDate);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          newInd.value = diffDays;
        }

        const { status, description } = getIndicatorStatus(newInd);
        newInd.status = status;
        newInd.description = description;

        return newInd;
      })
    );
  }, []);

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const btcPrice = data.bitcoin.usd;
        if (btcPrice) {
          handleUpdateIndicator('realized_price', { value: btcPrice });
        }
      } catch (error) {
        // Fail silently. The UI will allow manual entry as a fallback.
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchBTCPrice();
    const intervalId = setInterval(fetchBTCPrice, 3600000); // Fetch every 1 hour

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getCurrentRecommendation = (currentIndicators: IndicatorData[]): RecommendationResult => {
    const goodCount = currentIndicators.filter(ind => ind.status === 'good').length;
    const badCount = currentIndicators.filter(ind => ind.status === 'bad').length;

    let recommendation: 'buy' | 'wait' | 'sell' = 'wait';
    let text = "대부분의 지표가 매수 또는 매도 구간에 있지 않습니다.\n시장의 방향성이 정해질 때까지 관망하는 것을 추천합니다.";
    let buyLevel = 0;
    let sellLevel = 0;

    if (badCount >= 2) {
        recommendation = 'sell';
        sellLevel = Math.min(badCount - 1, 4); // 2 indicators -> level 1, capped at 4.
        text = `${badCount}개의 지표(${badCount}/5)가 매도 고려 구간에 있습니다.\n리스크 관리를 위해 분할 매도를 고려할 수 있는 시점입니다.`;
    } else if (goodCount >= 2) {
        recommendation = 'buy';
        buyLevel = Math.min(goodCount - 1, 4); // 2 indicators -> level 1, capped at 4.
        text = `${goodCount}개의 지표(${goodCount}/5)가 매수 추천 구간에 진입했습니다.\n분할 매수를 시작하기 좋은 시점으로 판단됩니다.`;
    }

    return {
        recommendation,
        text,
        buyLevel,
        sellLevel,
    };
  };
  
  const { recommendation, text, buyLevel, sellLevel } = getCurrentRecommendation(indicators);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">종합 판단</h2>
            <RecommendationDisplay
              currentRecommendation={recommendation}
              text={text}
              buyLevel={buyLevel}
              sellLevel={sellLevel}
            />
          </div>
          <IndicatorGrid 
            indicators={indicators} 
            onUpdateIndicator={handleUpdateIndicator}
            isLoadingPrice={isLoadingPrice}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
