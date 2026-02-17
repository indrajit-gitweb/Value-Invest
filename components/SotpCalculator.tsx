
import React, { useState, useEffect } from 'react';
import { StockAnalysis, BusinessSegment } from '../types';
import { Layers, Calculator, Info, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface SotpCalculatorProps {
  data: StockAnalysis;
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const SotpCalculator: React.FC<SotpCalculatorProps> = ({ data }) => {
  const [segments, setSegments] = useState<BusinessSegment[]>(data.segments || []);
  const [netDebt, setNetDebt] = useState<number>(data.netDebt || 0);
  const [totalShares, setTotalShares] = useState<number>(data.totalShares || 1); // Avoid div by zero
  
  const [equityValue, setEquityValue] = useState<number>(0);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [totalEv, setTotalEv] = useState<number>(0);

  useEffect(() => {
    calculateSotp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, netDebt, totalShares]);

  const calculateSotp = () => {
    let calculatedTotalEv = 0;
    
    segments.forEach(seg => {
      calculatedTotalEv += (seg.ebitda * seg.valuationMultiple);
    });

    const calculatedEquityValue = calculatedTotalEv - netDebt;
    const calculatedTargetPrice = calculatedEquityValue / totalShares;

    setTotalEv(calculatedTotalEv);
    setEquityValue(calculatedEquityValue);
    setTargetPrice(calculatedTargetPrice);
  };

  const updateSegmentMultiple = (index: number, newMultiple: number) => {
    const updatedSegments = [...segments];
    updatedSegments[index].valuationMultiple = newMultiple;
    setSegments(updatedSegments);
  };

  const resetDefaults = () => {
    setSegments(data.segments || []);
    setNetDebt(data.netDebt || 0);
  };

  const pieData = segments.map(seg => ({
    name: seg.name,
    value: seg.ebitda * seg.valuationMultiple
  }));

  const upside = ((targetPrice - data.price) / data.price) * 100;
  const isUndervalued = targetPrice > data.price;

  if (!segments || segments.length === 0) {
    return null; // Don't render if no segment data available
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Sum-of-the-Parts (SOTP) Valuation
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Valuing each business segment independently. Essential for conglomerates.
          </p>
        </div>
        <button 
          onClick={resetDefaults}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          <RotateCcw className="w-3 h-3" /> Reset Inputs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-x-auto rounded-lg border border-slate-700/50">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3">Segment</th>
                  <th className="px-4 py-3 text-right">EBITDA</th>
                  <th className="px-4 py-3 text-center">Multiple (x)</th>
                  <th className="px-4 py-3 text-right">EV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {segments.map((seg, idx) => (
                  <tr key={idx} className="bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">
                      {seg.name}
                      <div className="text-[10px] text-slate-500 font-normal">{seg.narrative}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">
                      {data.currency === 'INR' ? '₹' : '$'}{seg.ebitda.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                         <input 
                          type="range" 
                          min="1" 
                          max="50" 
                          step="0.5"
                          value={seg.valuationMultiple}
                          onChange={(e) => updateSegmentMultiple(idx, parseFloat(e.target.value))}
                          className="w-24 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="text-xs font-mono text-purple-300">{seg.valuationMultiple.toFixed(1)}x</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400 font-mono">
                       {(seg.ebitda * seg.valuationMultiple).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900/50 font-bold border-t border-slate-700">
                <tr>
                  <td className="px-4 py-3 text-slate-300">Total Enterprise Value</td>
                  <td colSpan={2}></td>
                  <td className="px-4 py-3 text-right text-white font-mono">
                    {data.currency === 'INR' ? '₹' : '$'}{totalEv.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Less: Net Debt</span>
                  <span className="text-red-400 font-mono font-medium">
                    - {data.currency === 'INR' ? '₹' : '$'}{netDebt.toLocaleString()}
                  </span>
                </div>
                 <div className="flex justify-between items-center mb-2 pt-2 border-t border-slate-700/50">
                  <span className="text-slate-200 text-sm font-bold">Equity Value</span>
                  <span className="text-white font-mono font-bold">
                    {data.currency === 'INR' ? '₹' : '$'}{equityValue.toLocaleString()}
                  </span>
                </div>
                 <div className="flex justify-between items-center text-xs text-slate-500">
                   <span>Outstanding Shares</span>
                   <span>{totalShares.toLocaleString()}</span>
                 </div>
             </div>
             
             <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700/50 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-1">
                   <div>
                     <p className="text-xs text-slate-400 uppercase tracking-wide">SOTP Target Price</p>
                     <p className={`text-2xl font-bold ${isUndervalued ? 'text-emerald-400' : 'text-red-400'}`}>
                        {data.currency} {targetPrice.toFixed(2)}
                     </p>
                   </div>
                   <div className={`flex items-center gap-1 text-sm font-bold ${isUndervalued ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isUndervalued ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(upside).toFixed(1)}% {isUndervalued ? 'Upside' : 'Downside'}
                   </div>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-blue-500 relative" style={{width: '100%'}}>
                      {/* Visual indicator logic could go here, simply showing full bar for now */}
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-right">
                   Current Price: {data.currency} {data.price}
                </p>
             </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/20 rounded-xl border border-slate-700/30 p-4 flex flex-col items-center justify-center min-h-[300px]">
          <h4 className="text-sm font-bold text-slate-400 mb-2 w-full text-left flex items-center gap-2">
            <PieChart className="w-4 h-4" /> Value Contribution
          </h4>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                   itemStyle={{ color: '#e2e8f0' }}
                   formatter={(value: number) => [value.toLocaleString(), 'Value']}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-500 text-center mt-2 px-4">
             Segments with higher growth typically command higher multiples (larger slices).
          </div>
        </div>

      </div>
    </div>
  );
};

export default SotpCalculator;
