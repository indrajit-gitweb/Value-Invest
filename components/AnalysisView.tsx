import React from 'react';
import { StockAnalysis } from '../types';
import { ShieldAlert, TrendingUp, AlertTriangle, BookOpen, Target } from 'lucide-react';

interface AnalysisViewProps {
  data: StockAnalysis;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bear Case */}
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-5 hover:bg-red-950/30 transition-colors">
          <div className="flex justify-between items-start mb-3">
             <h4 className="text-red-400 font-bold flex items-center gap-2">
               <TrendingUp className="w-4 h-4 rotate-180" /> Bear Case
             </h4>
             <span className="text-2xl font-bold text-white">{data.currency} {data.scenarios.bear.price}</span>
          </div>
          <div className="text-sm text-red-200/70 mb-2">Growth: {data.scenarios.bear.growthRate}%</div>
          <p className="text-sm text-slate-400 leading-relaxed">{data.scenarios.bear.narrative}</p>
        </div>

        {/* Base Case */}
        <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-5 hover:bg-blue-950/30 transition-colors">
          <div className="flex justify-between items-start mb-3">
             <h4 className="text-blue-400 font-bold flex items-center gap-2">
               <Target className="w-4 h-4" /> Base Case
             </h4>
             <span className="text-2xl font-bold text-white">{data.currency} {data.scenarios.base.price}</span>
          </div>
           <div className="text-sm text-blue-200/70 mb-2">Growth: {data.scenarios.base.growthRate}%</div>
          <p className="text-sm text-slate-400 leading-relaxed">{data.scenarios.base.narrative}</p>
        </div>

        {/* Bull Case */}
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-5 hover:bg-emerald-950/30 transition-colors">
          <div className="flex justify-between items-start mb-3">
             <h4 className="text-emerald-400 font-bold flex items-center gap-2">
               <TrendingUp className="w-4 h-4" /> Bull Case
             </h4>
             <span className="text-2xl font-bold text-white">{data.currency} {data.scenarios.bull.price}</span>
          </div>
           <div className="text-sm text-emerald-200/70 mb-2">Growth: {data.scenarios.bull.growthRate}%</div>
          <p className="text-sm text-slate-400 leading-relaxed">{data.scenarios.bull.narrative}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Review */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Financial Review
          </h3>
          <p className="text-slate-300 leading-7 text-sm">
            {data.financialReview}
          </p>
        </div>

        {/* Factors */}
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" /> Growth Drivers
            </h4>
            <ul className="space-y-2">
              {data.growthFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>

           <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Risk Factors
            </h4>
            <ul className="space-y-2">
              {data.riskFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;