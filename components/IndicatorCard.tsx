import React, { useState, useEffect } from 'react';
import type { IndicatorData, RangeVisual, NuplVisual, ComparisonVisual } from '../types';

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const getPercentage = (value: number, min: number, max: number, visual?: RangeVisual) => {
    if (visual && visual.style === 'blocks') { // Special non-linear scaling for cycle chart
        const sections = [
            { start: 0, end: 400, weight: 0.25 },
            { start: 400, end: 500, weight: 1 },
            { start: 500, end: 600, weight: 1.5 },
            { start: 600, end: 800, weight: 1 },
            { start: 800, end: 1000, weight: 2.0 },
            { start: 1000, end: 1300, weight: 0.33 }
        ];

        let weightedValue = 0;
        let cumulativeWeightedLength = 0;

        for (const section of sections) {
            const sectionLength = section.end - section.start;
            const weightedSectionLength = sectionLength * section.weight;

            if (value >= section.end) {
                weightedValue += weightedSectionLength;
            } else if (value > section.start) {
                const valueInSection = value - section.start;
                weightedValue += (valueInSection * section.weight);
                break;
            }
             else {
                break; // Value is before this section
            }
        }

        sections.forEach(s => cumulativeWeightedLength += (s.end - s.start) * s.weight);

        return Math.max(0, Math.min(100, (weightedValue / cumulativeWeightedLength) * 100));

    }
    
    // Default linear scaling
    if (max === min) return 0;
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

const LabelRenderer: React.FC<{ labels: { value: number; text: string }[], min: number, max: number, onTop?: boolean, visual?: RangeVisual }> = ({ labels, min, max, onTop = false, visual }) => {
    if (!labels || labels.length === 0) return null;

    const uniqueLabels = Array.from(new Map(labels.map(item => [item.text, item])).values())
      .sort((a,b) => a.value - b.value);
    
    const positions: { left: number; top: number; text: string, value: number }[] = [];
    let lastPos = -100;
    let level = 0;

    uniqueLabels.forEach(({ value, text }) => {
        const percent = getPercentage(value, min, max, visual);
        if (percent - lastPos < (text.length > 4 ? 12 : 8) && lastPos > -10) { // 긴 텍스트에 더 넓은 공간 할당
            level = 1 - level;
        } else {
            level = 0;
        }
        
        positions.push({ left: percent, top: level * 16, text, value });
        lastPos = percent;
    });

    const positionStyle = (topValue: number) => onTop ? { bottom: `${topValue}px` } : { top: `${topValue}px` };
    const labelFontSize = visual?.style === 'blocks' ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs';
    
    return (
        <div className={`${onTop ? 'mb-1' : 'mt-2'} h-8 relative ${labelFontSize} text-slate-400`}>
            {positions.map(({ left, top, text, value }) => {
                let transformClass = '-translate-x-1/2';
                if (left < 2) {
                    transformClass = 'translate-x-0';
                } else if (left > 98) {
                    transformClass = '-translate-x-full';
                }

                return (
                    <span
                        key={`${value}-${top}-${text}`}
                        className={`absolute ${transformClass} transition-all duration-300`}
                        style={{ left: `${left}%`, ...positionStyle(top) }}
                    >
                        {text}
                    </span>
                );
            })}
        </div>
    );
};

const RangeVisualizer: React.FC<{ visual: RangeVisual; value: number }> = ({ visual, value }) => {
    const { min, max, buyMin, buyMax, sellMin, sellMax, style } = visual;
    const valuePercent = getPercentage(value, min, max, visual);

    const BarComponent = style === 'blocks' ? (
        <div className="w-full rounded-full h-full relative bg-slate-600 overflow-hidden">
            <div 
                className="absolute top-0 h-full bg-red-500"
                style={{ 
                    left: `${getPercentage(sellMin, min, max, visual)}%`,
                    width: `${getPercentage(sellMax, min, max, visual) - getPercentage(sellMin, min, max, visual)}%`
                }}
                title={`매도 구간: ${sellMin}-${sellMax}`}
            ></div>
            <div 
                className="absolute top-0 h-full bg-green-500"
                style={{ 
                    left: `${getPercentage(buyMin, min, max, visual)}%`,
                    width: `${getPercentage(buyMax, min, max, visual) - getPercentage(buyMin, min, max, visual)}%`
                }}
                title={`매수 구간: ${buyMin}-${buyMax}`}
            ></div>
        </div>
    ) : (
        <div className="w-full rounded-full h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"></div>
    );

    return (
        <div className="w-full h-3.5 relative" title={`현재 값: ${value}`}>
            {BarComponent}
            <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" 
                style={{ left: `${valuePercent}%` }}
            >
                <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-900 shadow-lg"></div>
            </div>
        </div>
    );
};

const NuplVisualizer: React.FC<{ visual: NuplVisual; value: number }> = ({ visual, value }) => {
    const { min, max } = visual;
    const valuePercent = getPercentage(value, min, max);

    const labels = [
        { value: -0.5, text: "-50%"},
        { value: 0, text: "0%"},
        { value: 0.25, text: "25%"},
        { value: 0.5, text: "50%"},
        { value: 0.75, text: "75%"},
        { value: 1, text: "100%"},
    ];

    return (
        <div className="w-full">
            <div className="w-full h-3.5 flex rounded-full overflow-hidden relative mb-1" title={`현재 값: ${(value * 100).toFixed(1)}%`}>
                <div className="w-full h-full absolute left-0 top-0 bg-gradient-to-r from-green-500 via-cyan-400 via-33% via-yellow-400 via-50% via-orange-400 via-66% to-red-500"></div>
                <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" 
                    style={{ left: `${valuePercent}%` }}
                >
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-900 shadow-lg"></div>
                </div>
            </div>
            <LabelRenderer labels={labels} min={min} max={max} />
        </div>
    );
}

const ComparisonVisualizer: React.FC<{ 
    indicator: IndicatorData;
    onUpdate: (id: string, values: { value?: number, value2?: number }) => void;
    isLoading?: boolean;
}> = ({ indicator, onUpdate, isLoading }) => {
    const { id, value, value2, visual } = indicator;
    const comparisonVisual = visual as ComparisonVisual;

    const [isEditing1, setIsEditing1] = useState(false);
    const [editValue1, setEditValue1] = useState(value.toString());
    const [isEditing2, setIsEditing2] = useState(false);
    const [editValue2, setEditValue2] = useState(value2?.toString() ?? '');

    useEffect(() => {
      if (!isEditing1) {
        setEditValue1(value.toString());
      }
    }, [value, isEditing1]);

    useEffect(() => {
        if (!isEditing2) {
            setEditValue2(value2?.toString() ?? '');
        }
    }, [value2, isEditing2]);

    const handleSave1 = () => {
        const newValueNum = parseFloat(editValue1);
        if (!isNaN(newValueNum)) { onUpdate(id, { value: newValueNum }); }
        setIsEditing1(false);
    };
    const handleCancel1 = () => { setIsEditing1(false); setEditValue1(value.toString()); };

    const handleSave2 = () => {
        const newValueNum = parseFloat(editValue2);
        if (!isNaN(newValueNum)) { onUpdate(id, { value2: newValueNum }); }
        setIsEditing2(false);
    };
    const handleCancel2 = () => { setIsEditing2(false); setEditValue2(value2?.toString() ?? ''); };

    if (value2 === undefined) return null;

    const isBuyZone = !isLoading && value < value2;

    const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

    const editInputClass = "w-36 text-right bg-slate-700 text-white font-semibold text-lg rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-cyan-400";
    const iconButtonClass = "p-1 hover:bg-slate-700 rounded-full";

    return (
        <div className="flex justify-around items-center text-center mt-4 p-2 rounded-lg bg-slate-900/50">
            <div className={`p-3 rounded-lg transition-all duration-300`}>
                <p className="text-sm text-slate-400">{comparisonVisual.value1Label}</p>
                 <div className="flex items-center gap-1 mt-1 min-h-[36px]">
                    {isLoading ? (
                        <p className="text-xl font-bold text-white animate-pulse">Loading...</p>
                    ) : isEditing1 ? (
                        <div className="flex items-center gap-1">
                            <input type="number" step="any" value={editValue1} onChange={e => setEditValue1(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave1()} className={editInputClass} autoFocus />
                            <button onClick={handleSave1} className={`${iconButtonClass} text-green-400`}><CheckIcon className="w-5 h-5"/></button>
                            <button onClick={handleCancel1} className={`${iconButtonClass} text-red-400`}><CloseIcon className="w-5 h-5"/></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                             <p className="text-xl font-bold text-white">{formatCurrency(value)}</p>
                             <button onClick={() => setIsEditing1(true)} className={`${iconButtonClass} text-slate-400 hover:text-white`}><PencilIcon className="w-4 h-4"/></button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className={`text-3xl font-bold mx-2 ${isBuyZone ? 'text-green-400' : 'text-slate-500'}`}>{isBuyZone ? '<' : '>'}</div>

            <div className={`p-3 rounded-lg transition-all duration-300`}>
                <p className="text-sm text-slate-400">{comparisonVisual.value2Label}</p>
                {isEditing2 ? (
                    <div className="flex items-center gap-1 mt-1">
                        <input type="number" step="any" value={editValue2} onChange={e => setEditValue2(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave2()} className={editInputClass} autoFocus />
                        <button onClick={handleSave2} className={`${iconButtonClass} text-green-400`}><CheckIcon className="w-5 h-5"/></button>
                        <button onClick={handleCancel2} className={`${iconButtonClass} text-red-400`}><CloseIcon className="w-5 h-5"/></button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 mt-1">
                        <p className="text-xl font-bold text-white">{formatCurrency(value2)}</p>
                        <button onClick={() => setIsEditing2(true)} className={`${iconButtonClass} text-slate-400 hover:text-white`}><PencilIcon className="w-4 h-4"/></button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface IndicatorCardProps {
  indicator: IndicatorData;
  onUpdate: (id: string, values: { value?: number, value2?: number }) => void;
  isLoading?: boolean;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, onUpdate, isLoading }) => {
  const { id, title, concept, value, unit, status, description, details, buyZoneLabel, sellZoneLabel, visual, cycleStartDate, nextCycleEstimateDate, sourceUrl } = indicator;
  const isNupl = id === 'nupl';

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(isNupl ? (value * 100).toFixed(1) : value.toString());

  useEffect(() => {
    if (!isEditing) {
      setEditValue(isNupl ? (value * 100).toFixed(1) : value.toString());
    }
  }, [value, isEditing, isNupl]);

  const statusTagConfig = {
    good: 'bg-green-600/50 border-green-800 text-green-200',
    neutral: 'bg-yellow-600/50 border-yellow-800 text-yellow-200',
    bad: 'bg-red-600/50 border-red-800 text-red-200',
  };

  const handleSave = () => {
    let newValue = parseFloat(editValue);
    if (!isNaN(newValue)) {
      if (isNupl) {
        newValue /= 100;
      }
      onUpdate(id, { value: newValue });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(isNupl ? (value * 100).toFixed(1) : value.toString());
    setIsEditing(false);
  };

  const formattedCycleStartDate = cycleStartDate
    ? new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(cycleStartDate))
    : '';
  
  const valueColorClass = status === 'good' ? 'text-green-400' : status === 'bad' ? 'text-red-400' : 'text-white';


  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-slate-800 hover:border-slate-700 flex flex-col h-full">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h4 className="text-xl font-bold text-slate-100">{title}</h4>
            <span className={`px-4 py-1 rounded-lg text-lg font-bold shadow-lg border-b-2 ${statusTagConfig[status]}`}>
              {description}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-2">{concept}</p>
        </div>
        <div className="text-right flex-shrink-0">
            {visual.type !== 'comparison' && (
                <div className="flex items-center justify-end gap-2">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        step="any"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="w-24 text-right bg-slate-700 text-white font-semibold text-lg rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        autoFocus
                    />
                    <button onClick={handleSave} className="p-1 text-green-400 hover:bg-slate-700 rounded-full"><CheckIcon className="w-5 h-5"/></button>
                    <button onClick={handleCancel} className="p-1 text-red-400 hover:bg-slate-700 rounded-full"><CloseIcon className="w-5 h-5"/></button>
                    </div>
                ) : (
                    <>
                    {indicator.id === 'cycle' && cycleStartDate ? (
                        <div className="flex flex-col sm:flex-row sm:items-baseline items-end">
                            <span className="text-sm sm:text-base font-normal text-slate-400 sm:mr-2">
                                ({new Intl.DateTimeFormat('ko-KR', { year: '2-digit', month: 'numeric', day: 'numeric' }).format(new Date(cycleStartDate)).replace(/ /g, '').slice(0, -1)}) 반감기로부터
                            </span>
                            <p className={`text-2xl font-semibold transition-colors duration-300 ${valueColorClass}`}>
                                {value.toLocaleString()}
                                <span className="text-lg text-slate-400"> {unit}</span>
                            </p>
                        </div>
                    ) : (
                        <p className="text-2xl font-semibold text-white">
                            {isNupl ? (value * 100).toFixed(1) : value.toLocaleString()}
                            <span className="text-lg text-slate-400"> {unit}</span>
                        </p>
                    )}
                    {id !== 'cycle' && (
                        <button onClick={() => setIsEditing(true) } className="p-1 ml-1 text-slate-400 hover:text-white rounded-full transition-colors"><PencilIcon className="w-4 h-4"/></button>
                    )}
                    </>
                )}
                </div>
            )}

            <div className='mt-1 space-y-1'>
                <p className="text-xs text-green-400">매수 구간: {buyZoneLabel}</p>
                <p className={`text-xs ${sellZoneLabel === '해당 없음' ? 'text-slate-500' : 'text-red-400'}`}>매도 구간: {sellZoneLabel}</p>
            </div>
        </div>
      </div>

      <div className="mt-4">
         {visual.type === 'range' && (
            (() => {
                const rangeVisual = visual as RangeVisual;
                if (rangeVisual.style === 'blocks') { // Cycle Chart
                    const topLabels = rangeVisual.intermediateLabels || [];
                    const bottomLabels = (rangeVisual.dateLabels && cycleStartDate)
                        ? rangeVisual.dateLabels.map(day => {
                            const date = new Date(cycleStartDate);
                            date.setDate(date.getDate() + day);
                            return {
                                value: day,
                                text: new Intl.DateTimeFormat('ko-KR', { year: '2-digit', month: 'numeric', day: 'numeric' }).format(date).replace(/ /g, '').slice(0, -1)
                            };
                        })
                        : [];

                    return (
                        <div className="w-full">
                            <LabelRenderer labels={topLabels} min={rangeVisual.min} max={rangeVisual.max} onTop visual={rangeVisual} />
                            <RangeVisualizer visual={rangeVisual} value={value} />
                            <LabelRenderer labels={bottomLabels} min={rangeVisual.min} max={rangeVisual.max} visual={rangeVisual} />
                        </div>
                    );
                } else { // Gradient Charts (MVRV, Puell)
                    const bottomLabels = [
                        { value: rangeVisual.min, text: rangeVisual.min.toString() },
                        { value: rangeVisual.buyMin, text: rangeVisual.buyMin.toString() },
                        { value: rangeVisual.buyMax, text: rangeVisual.buyMax.toString() },
                        { value: rangeVisual.sellMin, text: rangeVisual.sellMin.toString() },
                        { value: rangeVisual.sellMax, text: rangeVisual.sellMax.toString() },
                        { value: rangeVisual.max, text: rangeVisual.max.toString() },
                        ...(rangeVisual.intermediateLabels || [])
                    ].filter(label => label.value >= rangeVisual.min && label.value <= rangeVisual.max);

                    return (
                         <div className="w-full">
                            <RangeVisualizer visual={rangeVisual} value={value} />
                            <LabelRenderer labels={bottomLabels} min={rangeVisual.min} max={rangeVisual.max} />
                        </div>
                    )
                }
            })()
         )}
        {visual.type === 'nupl' && <NuplVisualizer visual={visual as NuplVisual} value={value} />}
        {visual.type === 'comparison' && <ComparisonVisualizer indicator={indicator} onUpdate={onUpdate} isLoading={isLoading} />}
      </div>
      
      {cycleStartDate && nextCycleEstimateDate && (
        <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>
                <span className="font-semibold text-slate-300">반감기 시작:</span> {formattedCycleStartDate}
            </span>
            <span>
                <span className="font-semibold text-slate-300">다음 반감기:</span> {nextCycleEstimateDate}
            </span>
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-end">
        <div className="flex items-center gap-2">
            {sourceUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">본 링크를 클릭하여 DATA 반드시확인 입력</span>
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-slate-700 rounded-lg border-b-4 border-slate-900 text-slate-300 hover:bg-slate-600 active:border-b-0 active:translate-y-1 transition-transform duration-150"
                    aria-label="데이터 소스 보기"
                    title="데이터 소스 보기"
                  >
                      <ArrowRightIcon className="w-5 h-5" />
                  </a>
                </div>
            )}
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-white p-1 rounded-full transition-colors" aria-expanded={isExpanded} aria-label="상세 정보 보기">
                <InfoIcon className="w-6 h-6"/>
            </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-slate-300">{details}</p>
        </div>
      )}
    </div>
  );
};

export default IndicatorCard;