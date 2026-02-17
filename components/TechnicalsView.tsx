
import React from 'react';
import { Technicals } from '../types';
import { Layers, Activity, ArrowUp, ArrowDown, Move } from 'lucide-react';

interface TechnicalsViewProps {
  data: Technicals;
  currentPrice: number;
  currency: string;
}

const TechnicalsView: React.FC<TechnicalsViewProps> = ({ data, currentPrice, currency }) => {
  const getSignal = (price: number, ma: number) => {
    return price > ma ? 'Bullish' : 'Bearish';
  };

  const getSignalColor = (price: number, ma: number) => {
    return price > ma ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Technical Indicators</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Moving Averages */}
        <div>
          <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Move className="w-4 h-4" /> Moving Averages
          </h4>
          <div className="space-y-3">
            {[
              { label: '21-Day EMA', value: data.ema21 },
              { label: '50-Day MA', value: data.ma50 },
              { label: '100-Day MA', value: data.ma100 },
              { label: '200-Day MA', value: data.ma200 },
            ].map((ma, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 font-medium">{ma.label}</span>
                <div className="text-right">
                  <div className="text-white font-mono font-bold">{currency} {ma.value.toFixed(2)}</div>
                  <div className={`text-xs ${getSignalColor(currentPrice, ma.value)}`}>
                    {getSignal(currentPrice, ma.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fibonacci Levels */}
        <div>
          <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Fibonacci Levels
          </h4>
          
          <div className="space-y-4">
            {/* Resistance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-red-400 uppercase font-bold tracking-wider mb-1">
                <span>Resistance</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-red-950/20 border border-red-900/30 p-2 rounded text-center">
                  <div className="text-xs text-red-300 mb-1">R3</div>
                  <div className="text-sm font-mono font-bold text-white">{data.resistance.r3.toFixed(2)}</div>
                </div>
                <div className="bg-red-950/20 border border-red-900/30 p-2 rounded text-center">
                  <div className="text-xs text-red-300 mb-1">R2</div>
                  <div className="text-sm font-mono font-bold text-white">{data.resistance.r2.toFixed(2)}</div>
                </div>
                <div className="bg-red-950/20 border border-red-900/30 p-2 rounded text-center">
                  <div className="text-xs text-red-300 mb-1">R1</div>
                  <div className="text-sm font-mono font-bold text-white">{data.resistance.r1.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Current Price Marker */}
            <div className="relative h-px bg-slate-600 my-4 flex items-center justify-center">
               <span className="bg-slate-800 px-3 text-xs text-blue-400 font-mono">Current: {currency} {currentPrice}</span>
            </div>

            {/* Support */}
             <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-950/20 border border-emerald-900/30 p-2 rounded text-center">
                  <div className="text-xs text-emerald-300 mb-1">S1</div>
                  <div className="text-sm font-mono font-bold text-white">{data.support.s1.toFixed(2)}</div>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-900/30 p-2 rounded text-center">
                  <div className="text-xs text-emerald-300 mb-1">S2</div>
                  <div className="text-sm font-mono font-bold text-white">{data.support.s2.toFixed(2)}</div>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-900/30 p-2 rounded text-center">
                  <div className="text-xs text-emerald-300 mb-1">S3</div>
                  <div className="text-sm font-mono font-bold text-white">{data.support.s3.toFixed(2)}</div>
                </div>
              </div>
               <div className="flex items-center justify-between text-xs text-emerald-400 uppercase font-bold tracking-wider mt-1">
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalsView;
