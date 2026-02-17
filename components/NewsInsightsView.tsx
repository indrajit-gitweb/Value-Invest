
import React from 'react';
import { StockAnalysis } from '../types';
import { Zap, ExternalLink, Newspaper } from 'lucide-react';

interface NewsInsightsViewProps {
  insights: StockAnalysis['latestInsights'];
}

const NewsInsightsView: React.FC<NewsInsightsViewProps> = ({ insights }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
         <Zap className="w-32 h-32" />
      </div>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Zap className="w-5 h-5 text-amber-400" />
        <h3 className="text-xl font-bold text-white">At a Glance Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600 transition-all group">
             <div className="flex justify-between items-start mb-2 gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border 
                   ${insight.sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                     insight.sentiment === 'Negative' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 
                     'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                   {insight.sentiment}
                </span>
                <span className="text-[10px] text-slate-500">{insight.date}</span>
             </div>
             <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
               {insight.title}
             </h4>
             <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-3">
               {insight.summary}
             </p>
             <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Newspaper className="w-3 h-3" />
                <span>{insight.source}</span>
             </div>
          </div>
        ))}

        {insights.length === 0 && (
           <div className="col-span-full text-center py-8 text-slate-500 italic">No recent insights available.</div>
        )}
      </div>
    </div>
  );
};

export default NewsInsightsView;
