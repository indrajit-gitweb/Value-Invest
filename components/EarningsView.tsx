
import React from 'react';
import { StockAnalysis } from '../types';
import { Phone, Calendar, ArrowRight, MessageSquareQuote } from 'lucide-react';

interface EarningsViewProps {
  data: StockAnalysis['earnings'];
}

const EarningsView: React.FC<EarningsViewProps> = ({ data }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Negative': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Earnings Calls</h3>
        </div>
        {data.nextDate && (
           <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700">
             <Calendar className="w-3 h-3 text-slate-400" />
             <span className="text-slate-300">Next: <span className="text-white">{data.nextDate}</span></span>
           </div>
        )}
      </div>

      <div className="space-y-4">
        {data.history.map((call, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                 <span className="text-lg font-bold text-white">{call.quarter}</span>
                 <span className="text-xs text-slate-500">{call.date}</span>
              </div>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSentimentColor(call.sentiment)}`}>
                 {call.sentiment}
              </div>
            </div>
            
            <div className="space-y-2">
               {call.keyTakeaways.map((point, k) => (
                 <div key={k} className="flex items-start gap-2.5">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-slate-500 mt-1 shrink-0" />
                    <p className="text-sm text-slate-300 leading-relaxed">{point}</p>
                 </div>
               ))}
            </div>
          </div>
        ))}

        {data.history.length === 0 && (
           <div className="text-center py-8 text-slate-500 italic">No recent earnings call data available.</div>
        )}
      </div>
    </div>
  );
};

export default EarningsView;
