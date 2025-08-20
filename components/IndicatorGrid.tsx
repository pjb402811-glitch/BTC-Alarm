
import React from 'react';
import type { IndicatorData } from '../types';
import IndicatorCard from './IndicatorCard';
import PredictionTable from './PredictionTable';

interface IndicatorGridProps {
  indicators: IndicatorData[];
  onUpdateIndicator: (id: string, values: { value?: number, value2?: number }) => void;
  isLoadingPrice: boolean;
}

const IndicatorGrid: React.FC<IndicatorGridProps> = ({ indicators, onUpdateIndicator, isLoadingPrice }) => {
  return (
    <div>
        <h3 className="text-2xl font-bold text-slate-200 mb-2">세부판단근거</h3>
        <p className="text-slate-400 mb-6">아래는 종합적인 판단을 위해 사용된 장기 예측 데이터와 주요 온체인 지표들입니다.</p>
        
        <PredictionTable />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicators.map((indicator) => (
                <IndicatorCard 
                  key={indicator.id} 
                  indicator={indicator} 
                  onUpdate={onUpdateIndicator}
                  isLoading={indicator.id === 'realized_price' ? isLoadingPrice : false}
                />
            ))}
        </div>
    </div>
  );
};

export default IndicatorGrid;