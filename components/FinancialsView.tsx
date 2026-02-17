
import React, { useState } from 'react';
import { StockAnalysis } from '../types';
import { FileText } from 'lucide-react';

interface FinancialsViewProps {
  data: StockAnalysis['financials'];
  currency: string;
}

const FinancialsView: React.FC<FinancialsViewProps> = ({ data, currency }) => {
  const [activeTab, setActiveTab] = useState<'pnl' | 'bs' | 'cf'>('pnl');

  const pnlMetrics = [
    { key: 'sales', label: 'Sales' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'operatingProfit', label: 'Op. Profit' },
    { key: 'opm', label: 'OPM %', color: 'text-emerald-400' },
    { key: 'otherIncome', label: 'Other Inc.' },
    { key: 'interest', label: 'Interest' },
    { key: 'depreciation', label: 'Depreciation' },
    { key: 'profitBeforeTax', label: 'PBT' },
    { key: 'tax', label: 'Tax' },
    { key: 'netProfit', label: 'Net Profit', bold: true },
    { key: 'eps', label: 'EPS', bold: true, color: 'text-blue-400' },
    { key: 'dividendPayout', label: 'Div Payout %', color: 'text-amber-400' },
  ];

  const bsMetrics = [
    { key: 'equityCapital', label: 'Eq. Capital' },
    { key: 'reserves', label: 'Reserves', color: 'text-emerald-400' },
    { key: 'borrowings', label: 'Borrowings' },
    { key: 'otherLiabilities', label: 'Other Liab.' },
    { key: 'totalLiabilities', label: 'Total Liab.', bold: true },
    { key: 'fixedAssets', label: 'Fixed Assets' },
    { key: 'cwip', label: 'CWIP' },
    { key: 'investments', label: 'Investments' },
    { key: 'otherAssets', label: 'Other Assets' },
    { key: 'totalAssets', label: 'Total Assets', bold: true },
  ];

  const cfMetrics = [
    { key: 'cashFromOperating', label: 'Cash from Ops', color: 'text-emerald-400' },
    { key: 'cashFromInvesting', label: 'Cash from Inv' },
    { key: 'cashFromFinancing', label: 'Cash from Fin' },
    { key: 'netCashFlow', label: 'Net Cash Flow', bold: true },
  ];

  const getData = () => {
    switch (activeTab) {
      case 'pnl': return { rows: data.profitLoss, metrics: pnlMetrics };
      case 'bs': return { rows: data.balanceSheet, metrics: bsMetrics };
      case 'cf': return { rows: data.cashFlow, metrics: cfMetrics };
      default: return { rows: [], metrics: [] };
    }
  };

  const { rows, metrics } = getData();
  
  // Sort rows: Oldest to Newest (Left to Right)
  // We assume the API might return random order or Newest first.
  // We try to parse the year string to sort, or just reverse if it looks like descending.
  const sortedRows = [...rows];
  
  // Simple heuristic: if the first year string contains a larger number than the last, reverse it.
  // E.g. "Mar 2024" vs "Mar 2010"
  const getYearNum = (s: string) => {
      const match = s.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
  };
  
  if (sortedRows.length > 1) {
      const first = getYearNum(sortedRows[0].year);
      const last = getYearNum(sortedRows[sortedRows.length - 1].year);
      if (first > last && last !== 0) {
          sortedRows.reverse();
      }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 overflow-hidden flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
           <FileText className="w-5 h-5 text-indigo-400" />
           <div>
             <h3 className="text-lg font-bold text-white">Financials</h3>
           </div>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50 overflow-x-auto max-w-full">
           {(['pnl', 'bs', 'cf'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                 activeTab === tab 
                   ? 'bg-indigo-600 text-white shadow-sm' 
                   : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               {tab === 'pnl' ? 'P&L' : tab === 'bs' ? 'Balance Sheet' : 'Cash Flow'}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/30">
            <table className="w-full text-xs text-left border-collapse">
            <thead>
                <tr className="bg-slate-900/80">
                <th className="px-3 py-2 sticky left-0 bg-slate-900 z-20 border-r border-slate-800 text-slate-400 font-medium uppercase w-28 min-w-[7rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                    Metric
                </th>
                {sortedRows.map((yearData, idx) => (
                    <th key={idx} className="px-2 py-2 text-right font-bold text-white whitespace-nowrap min-w-[4.5rem] border-b border-slate-800">
                        {yearData.year.replace('Mar ', '').replace('Dec ', '')}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                {metrics.map((metric, metricIdx) => (
                <tr key={metricIdx} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="px-3 py-2 sticky left-0 bg-slate-800 z-10 border-r border-slate-700/50 font-medium text-slate-300 truncate max-w-[7rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] group-hover:bg-slate-800" title={metric.label}>
                        {metric.label}
                    </td>
                    {sortedRows.map((yearData, yearIdx) => {
                        // @ts-ignore - dynamic access
                        const value = yearData[metric.key];
                        return (
                        <td key={yearIdx} className={`px-2 py-2 text-right whitespace-nowrap ${metric.bold ? 'font-bold text-white' : 'text-slate-400'} ${metric.color || ''}`}>
                            {value || '-'}
                        </td>
                        );
                    })}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsView;
