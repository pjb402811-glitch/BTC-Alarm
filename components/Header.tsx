
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        BTC 온체인 기반 매수/매도 알리미
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
        주요 온체인 지표를 통해 비트코인 현물 투자의 적절한 시점을 분석합니다.
      </p>
    </header>
  );
};

export default Header;