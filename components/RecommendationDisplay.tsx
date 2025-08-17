import React from 'react';

interface RecommendationBarProps {
  currentRecommendation: 'buy' | 'wait' | 'sell';
  text: string;
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

const RecommendationDisplay: React.FC<RecommendationBarProps> = ({ currentRecommendation, text }) => {
  const recommendationIndex = Object.keys(sections).indexOf(currentRecommendation);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="relative w-full mb-4">
        {/* The main bar */}
        <div className="flex w-full h-14 rounded-md overflow-hidden shadow-inner">
          {Object.entries(sections).map(([key, section]) => (
            <div
              key={key}
              className={`flex-1 ${section.color} flex items-center justify-center transition-all duration-300 ${currentRecommendation === key ? 'grayscale-0' : 'grayscale'}`}
            >
              <span className={`text-xl sm:text-2xl font-bold text-white mix-blend-luminosity`}>{section.label}</span>
            </div>
          ))}
        </div>
        {/* Indicator Arrow */}
        <div 
          className="absolute -bottom-3 transition-all duration-500 ease-in-out"
          style={{ 
            left: `${(recommendationIndex * (100 / 3)) + (100 / 6)}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
        </div>
      </div>
      <div className="text-center mt-8">
        <h3 className={`text-2xl font-bold ${sections[currentRecommendation].textColor}`}>
          현재 판단: {sections[currentRecommendation].label}
        </h3>
        <p className="text-slate-300 mt-2 text-lg">{text}</p>
      </div>
    </div>
  );
};

export default RecommendationDisplay;