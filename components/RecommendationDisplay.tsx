import React from 'react';

interface RecommendationDisplayProps {
  currentRecommendation: 'buy' | 'wait' | 'sell';
  text: string;
  buyLevel: number;
  sellLevel: number;
}

const sections = {
  buy: {
    label: '매수 추천',
    color: 'bg-green-500',
    textColor: 'text-green-300',
  },
  wait: {
    label: '관망',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-300',
  },
  sell: {
    label: '매도 고려',
    color: 'bg-red-500',
    textColor: 'text-red-300',
  }
};

const sellColors = ['bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800'];
const buyColors = ['bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800'];

const renderColoredText = (text: string) => {
    const parts = text.split(/(매수 추천 구간|분할 매수를|매도 고려 구간|분할 매도를|관망)/g);
    return parts.map((part, index) => {
      switch (part) {
        case '매수 추천 구간':
        case '분할 매수를':
          return <span key={index} className="text-green-400 font-semibold">{part}</span>;
        case '매도 고려 구간':
        case '분할 매도를':
          return <span key={index} className="text-red-400 font-semibold">{part}</span>;
        case '관망':
          return <span key={index} className="text-yellow-400 font-semibold">{part}</span>;
        default:
          return part;
      }
    });
  };

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ currentRecommendation, text, buyLevel, sellLevel }) => {
  let recommendationPercentage = 50;
  
  // The bar is visually split into 9 sections: 4 for sell, 1 for wait, 4 for buy. Total sections = 9.
  const totalSections = 9;
  const sellSectionWidth = (4 / totalSections) * 100;
  const waitSectionWidth = (1 / totalSections) * 100;
  const buySectionWidth = (4 / totalSections) * 100;

  if (currentRecommendation === 'sell' && sellLevel > 0) {
    // Position within the 4 sell blocks.
    const positionInSellSection = ((sellLevel - 0.5) / 4);
    recommendationPercentage = positionInSellSection * sellSectionWidth;
  } else if (currentRecommendation === 'buy' && buyLevel > 0) {
    // Position within the 4 buy blocks.
    const positionInBuySection = ((buyLevel - 0.5) / 4);
    recommendationPercentage = sellSectionWidth + waitSectionWidth + (positionInBuySection * buySectionWidth);
  } else { // 'wait'
    recommendationPercentage = sellSectionWidth + (waitSectionWidth / 2);
  }

  const baseBlockColor = "bg-slate-700/60";

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="relative w-full mb-4">
        {/* The main bar */}
        <div className="flex w-full h-14 rounded-md overflow-hidden shadow-inner bg-slate-700">
          {/* Sell Section */}
          <div className="flex relative" style={{ flex: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={`sell-${i+1}`}
                    className={`flex-1 transition-colors duration-500 ${i + 1 <= sellLevel ? sellColors[i] : baseBlockColor}`}
                />
            ))}
             <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold text-white mix-blend-luminosity pointer-events-none">
              {sections.sell.label}
            </span>
          </div>
          {/* Wait Section */}
           <div className={`flex relative items-center justify-center transition-colors duration-500 ${currentRecommendation === 'wait' ? sections.wait.color : baseBlockColor}`} style={{ flex: 1 }}>
              <span className="text-xl sm:text-2xl font-bold text-white mix-blend-luminosity pointer-events-none">
                {sections.wait.label}
              </span>
           </div>
          {/* Buy Section */}
          <div className="flex relative" style={{ flex: 4 }}>
             {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={`buy-${i+1}`}
                    className={`flex-1 transition-colors duration-500 ${i + 1 <= buyLevel ? buyColors[i] : baseBlockColor}`}
                />
            ))}
            <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold text-white mix-blend-luminosity pointer-events-none">
              {sections.buy.label}
            </span>
          </div>
        </div>
        {/* Indicator Arrow */}
        <div 
          className="absolute -bottom-3 transition-all duration-500 ease-in-out"
          style={{ 
            left: `${recommendationPercentage}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-slate-300 text-xl whitespace-pre-line min-h-[4rem] flex items-center justify-center">
          <span>{renderColoredText(text)}</span>
        </p>
      </div>
    </div>
  );
};

export default RecommendationDisplay;