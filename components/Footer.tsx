
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-left py-6 mt-10 border-t border-slate-800 text-slate-500 text-xs max-w-4xl mx-auto">
      <h3 className="text-base font-bold text-slate-400 mb-4">면책조항 (Disclaimer)</h3>
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-slate-400">1. 정보 제공 목적</h4>
          <p>
            본 애플리케이션(이하 '앱')에서 제공하는 모든 정보는 투자 참고 목적으로만 제공되며, 투자에 대한 법률적 또는 재정적 조언이 아닙니다. 앱에 포함된 콘텐츠는 정보 제공의 정확성을 보장하지 않으며, 투자 결정에 대한 유일한 근거로 활용되어서는 안 됩니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-400">2. 투자 위험 고지</h4>
          <p>
            가상자산(암호화폐) 투자는 매우 높은 변동성을 가지고 있으며, 투자 원금의 전부 또는 일부 손실을 초래할 수 있는 고위험 투자 상품입니다. 투자자는 자신의 투자 성향, 재정 상태, 위험 감수 능력 등을 충분히 고려하여 신중하게 투자 결정을 내려야 합니다. 과거의 수익률이 미래의 수익률을 보장하지 않습니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-400">3. 앱 개발사의 책임 제한</h4>
          <p>
            앱 개발사(이하 '개발사')는 앱을 통해 제공되는 정보의 오류, 지연, 누락 등으로 인해 발생하는 직·간접적인 손해에 대해 어떠한 책임도 지지 않습니다. 또한, 앱 사용으로 인해 발생하는 모든 투자 손실에 대해서도 책임을 지지 않습니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-400">4. 제3자 정보 및 링크</h4>
          <p>
            앱에는 제3자가 제공하는 정보나 외부 웹사이트로 연결되는 링크가 포함될 수 있습니다. 개발사는 이러한 제3자 정보의 정확성이나 신뢰성에 대해 어떠한 보증도 하지 않으며, 외부 링크를 통해 접속한 웹사이트에서 발생하는 문제에 대해서도 책임지지 않습니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-400">5. 사용자 책임</h4>
          <p>
            앱을 사용하는 모든 사용자는 위 면책조항을 충분히 인지하고, 자신의 투자 결정에 대한 모든 책임은 본인에게 있음을 인정합니다. 앱의 정보를 바탕으로 한 모든 투자 행위는 사용자 본인의 판단과 책임 하에 이루어져야 합니다.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
