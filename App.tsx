
import React, { useState, useEffect } from 'react';
import type { IndicatorData } from './types';
import Header from './components/Header';
import RecommendationDisplay from './components/RecommendationDisplay';
import IndicatorGrid from './components/IndicatorGrid';

const initialIndicators: IndicatorData[] = [
  {
    id: 'cycle',
    title: '반감기 사이클 분석',
    concept: '비트코인 반감기를 기준으로 시장의 장기적인 고점과 저점 시기를 예측합니다.',
    value: 0, // Will be calculated automatically
    unit: '일',
    status: 'bad',
    description: '매수/매도 구간 아님',
    details: '역사적으로 비트코인 사이클은 반감기 후 800~1000일 사이가 매수하기 좋은 시점이었습니다. 이 기간은 일반적으로 시장의 축적 단계에 해당합니다.',
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
    sourceUrl: 'https://www.lookintobitcoin.com/charts/bitcoin-halving-cycle/',
  },
  {
    id: 'realized_price',
    title: '실현 가격 (Realized Price)',
    concept: '장기 보유자의 평균 매입 단가와 현재 BTC 가격을 비교하여 저평가 구간을 판단합니다.',
    value: 67123.45, // BTC Price
    value2: 58345.67, // LTH Realized Price
    unit: '$',
    status: 'bad',
    description: '매수 구간 아님',
    details: '비트코인 장기 보유자 실현 가격(Long-Term Holder Realized Price)은 장기 보유자들이 마지막으로 코인을 옮겼을 때의 평균 가격을 나타냅니다. 현재 BTC 가격이 이 실현 가격보다 낮아지면, 역사적으로 강력한 매수 기회였습니다. 이는 시장이 극심한 공포 상태에 있으며, 장기 보유자들조차 평균적으로 손실을 보고 있다는 의미이기 때문입니다.',
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
    title: 'MVRV Z-Score',
    concept: '비트코인의 현재 가치가 실현 가치 대비 고평가/저평가 되었는지 측정합니다.',
    value: 2.65, 
    unit: '',
    status: 'bad',
    description: '매수/매도 구간 아님',
    details: 'MVRV Z-Score는 비트코인 사이클의 최고점(빨간색)과 최저점(초록색)을 예측하는 지표입니다. 0 이하일 때 매수, 7 이상일 때 매도 시그널로 간주됩니다.',
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
    title: 'NUPL (미실현 손익)',
    concept: '시장 참여자들의 전반적인 미실현 수익/손실 상태를 보여주는 심리 지표입니다.',
    value: 0.56, 
    unit: '',
    status: 'bad',
    description: '매수/매도 구간 아님',
    details: 'NUPL은 시장 참여자들의 전반적인 수익성을 나타냅니다. \'Capitulation\'(항복, <0) 단계가 매수, \'Euphoria\'(환희, >0.75) 단계가 매도 시그널입니다.',
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
    title: 'Puell Multiple',
    concept: '채굴자들의 수익성을 분석하여 시장의 바닥과 천장 신호를 파악합니다.',
    value: 1.82, 
    unit: '',
    status: 'bad',
    description: '매수/매도 구간 아님',
    details: 'Puell Multiple은 채굴자 수익성 지표입니다. 0.5 이하(녹색)일 때 매수, 4 이상(빨간색)일 때 매도 시그널로 간주됩니다.',
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

const App: React.FC = () => {
  const [indicators, setIndicators] = useState<IndicatorData[]>(initialIndicators);

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
        if (ind.id === 'realized_price' && ind.value2 !== undefined) {
            const isBuyZone = ind.value < ind.value2;
            newInd.status = isBuyZone ? 'good' : 'bad';
            newInd.description = isBuyZone ? '매수 추천 구간' : '매수 구간 아님';
        }
        return newInd;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleUpdateIndicator = (id: string, newValues: { value?: number, value2?: number }) => {
    setIndicators(prevIndicators => 
      prevIndicators.map(ind => {
        if (ind.id === id) {
          const updatedInd = { ...ind, ...newValues };
          // Re-calculate status if it's the realized_price indicator
          if (updatedInd.id === 'realized_price' && updatedInd.value2 !== undefined) {
            const btcPrice = newValues.value !== undefined ? newValues.value : updatedInd.value;
            const lthPrice = newValues.value2 !== undefined ? newValues.value2 : updatedInd.value2;
            const isBuyZone = btcPrice < lthPrice;
            updatedInd.status = isBuyZone ? 'good' : 'bad';
            updatedInd.description = isBuyZone ? '매수 추천 구간' : '매수 구간 아님';
          }
          return updatedInd;
        }
        return ind;
      })
    );
  };

  const getCurrentRecommendation = (): { recommendation: 'buy' | 'wait' | 'sell'; text: string } => {
    // This logic can be expanded later based on real-time indicator values
    const currentStatus: 'buy' | 'wait' | 'sell' = 'wait';

    const texts = {
        buy: "주요 지표가 매수 구간에 진입하여, 분할 매수를 시작하기 좋은 시점으로 판단됩니다.",
        wait: "대부분의 지표가 매수 또는 매도 구간에 있지 않습니다. 시장 방향성이 정해질 때까지 관망하는 것을 추천합니다.",
        sell: "대부분의 지표가 과열 및 탐욕 구간에 있습니다. 리스크 관리를 위해 분할 매도를 고려할 수 있는 시점입니다."
    };

    return {
        recommendation: currentStatus,
        text: texts[currentStatus]
    };
  };
  
  const { recommendation, text } = getCurrentRecommendation();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main>
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">종합 판단</h2>
            <RecommendationDisplay
              currentRecommendation={recommendation}
              text={text}
            />
          </div>
          <IndicatorGrid indicators={indicators} onUpdateIndicator={handleUpdateIndicator} />
        </main>
      </div>
    </div>
  );
};

export default App;