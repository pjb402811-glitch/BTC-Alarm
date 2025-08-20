import React from 'react';

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400 inline-block mr-1 align-bottom">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
    </svg>
);


const predictionData = [
  { halving: '2차', date: '2016년 7월', sell: '2017년 12월 (과거 기록)', buy: '2018년 12월 (과거 기록)', isFuture: false },
  { halving: '3차', date: '2020년 5월', sell: '2021년 11월 (과거 기록)', buy: '2022년 11월 (과거 기록)', isFuture: false },
  { halving: '4차', date: '2024년 4월', sell: '2025년 9월 ~ 10월', buy: '2026년 9월 ~ 10월', isFuture: true },
  { halving: '5차', date: '2028년 4월', sell: '2029년 9월 ~ 10월', buy: '2030년 9월 ~ 10월', isFuture: true },
  { halving: '6차', date: '2032년 3월', sell: '2033년 8월 ~ 9월', buy: '2034년 8월 ~ 9월', isFuture: true },
  { halving: '7차', date: '2036년 3월', sell: '2037년 8월 ~ 9월', buy: '2038년 8월 ~ 9월', isFuture: true },
  { halving: '8차', date: '2040년 2월', sell: '2041년 7월 ~ 8월', buy: '2042년 7월 ~ 8월', isFuture: true },
  { halving: '9차', date: '2044년 1월', sell: '2045년 6월 ~ 7월', buy: '2046년 6월 ~ 7월', isFuture: true },
  { halving: '10차', date: '2047년 12월', sell: '2049년 5월 ~ 6월', buy: '2050년 5월 ~ 6월', isFuture: true },
];

const PredictionTable: React.FC = () => {
    return (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6 overflow-x-auto">
            <h4 className="text-xl font-bold text-slate-100 mb-2">
                비트코인 최적 매수/매도 시기 종합 예측 (~2050년)
            </h4>
            <p className="text-lg text-slate-400 mb-4">
                아래표는 반감기 사이클 예측표 (AI),<br />
                차트상 주봉기준 매도는 쌍고 확인, 매수는 역배열에서 캔들이 20주선 안착
            </p>
            <div className="overflow-hidden rounded-md border border-slate-700">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-900/70 text-slate-300">
                        <tr>
                            <th className="p-3 font-semibold">반감기</th>
                            <th className="p-3 font-semibold">날짜 (과거/예상)</th>
                            <th className="p-3 font-semibold">최적 매도 시기 예측 (고점)<br/><small className="font-normal text-slate-400">(반감기 + 약 17~18개월 후)</small></th>
                            <th className="p-3 font-semibold">최적 매수 시기 예측 (저점)<br/><small className="font-normal text-slate-400">(반감기 + 약 2년 6개월 후)</small></th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-200">
                        {predictionData.map((row) => (
                            <tr key={row.halving} className="border-t border-slate-800 even:bg-slate-800/50 hover:bg-slate-700/30">
                                <td className="p-3 font-semibold">{row.halving}</td>
                                <td className="p-3">{row.date}</td>
                                <td className="p-3">
                                    {row.isFuture && <CheckIcon />}
                                    {row.sell}
                                </td>
                                <td className="p-3">{row.buy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PredictionTable;