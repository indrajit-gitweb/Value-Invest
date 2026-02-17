
import React, { useState, useEffect } from 'react';
import { StockAnalysis } from '../types';
import { 
  RefreshCcw, TrendingUp, DollarSign, Percent, Target, 
  TrendingDown, Settings2, ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

interface DCFCalculatorProps {
  data: StockAnalysis;
}

type ScenarioType = 'bear' | 'base' | 'bull';
type TerminalMethod = 'growth' | 'multiple';

interface ScenarioParams {
  growthRate: number;
  discountRate: number;
  terminalVal: number; // Represents Rate (%) or Multiple (x) depending on method
}

const DCFCalculator: React.FC<DCFCalculatorProps> = ({ data }) => {
  // Global Settings
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('base');
  const [terminalMethod, setTerminalMethod] = useState<TerminalMethod>('growth');
  const [useDecay, setUseDecay] = useState<boolean>(true);
  
  // Independent Scenario Configurations
  const [scenarios, setScenarios] = useState<Record<ScenarioType, ScenarioParams>>({
    bear: {
      growthRate: data.scenarios.bear.growthRate,
      discountRate: data.discountRate + 2.0, // Higher risk
      terminalVal: Math.max(data.terminalRate - 1.5, 1.0)
    },
    base: {
      growthRate: data.growthRate,
      discountRate: data.discountRate,
      terminalVal: data.terminalRate
    },
    bull: {
      growthRate: data.scenarios.bull.growthRate,
      discountRate: Math.max(data.discountRate - 1.0, 6.0), // Lower risk
      terminalVal: data.terminalRate + 1.0
    }
  });

  // Handle switching terminal method defaults
  useEffect(() => {
    setScenarios(prev => {
      const isGrowth = terminalMethod === 'growth';
      return {
        bear: { ...prev.bear, terminalVal: isGrowth ? Math.max(data.terminalRate - 1.5, 1.0) : 10 },
        base: { ...prev.base, terminalVal: isGrowth ? data.terminalRate : 15 },
        bull: { ...prev.bull, terminalVal: isGrowth ? data.terminalRate + 1.0 : 20 }
      };
    });
  }, [terminalMethod, data.terminalRate]);

  const [fcf, setFcf] = useState(data.fcfPerShare);
  const [netDebtPerShare, setNetDebtPerShare] = useState(0);
  
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  // Get current active params
  const { growthRate, discountRate, terminalVal } = scenarios[activeScenario];

  // Recalculate function
  const calculateDCF = () => {
    let currentValue = 0;
    const projectionYears = 10;
    const projections = [];
    let currentFcf = fcf;

    // Determine target decay rate
    // If using growth method, decay to terminal rate. If multiple, decay to 3% (GDP proxy).
    const decayTarget = terminalMethod === 'growth' ? terminalVal : 3.0;
    const decayStep = (growthRate - decayTarget) / Math.max(projectionYears - 1, 1);

    // Stage 1: Growth Phase
    for (let i = 1; i <= projectionYears; i++) {
      // Calculate growth for this specific year
      const yearGrowth = useDecay 
        ? Math.max(growthRate - (decayStep * (i - 1)), 0) 
        : growthRate;
        
      currentFcf = currentFcf * (1 + yearGrowth / 100);
      
      // Discount Factor
      const discountFactor = Math.pow(1 + discountRate / 100, i);
      const discountedFcf = currentFcf / discountFactor;
      
      currentValue += discountedFcf;
      
      projections.push({
        year: `Y${i}`,
        growthUsed: yearGrowth.toFixed(1),
        fcf: parseFloat(currentFcf.toFixed(2)),
        discounted: parseFloat(discountedFcf.toFixed(2))
      });
    }

    // Stage 2: Terminal Value
    let terminalValue = 0;
    if (terminalMethod === 'growth') {
      // Gordon Growth Model
      // Guard against divide by zero or negative denominator
      const denominator = Math.max((discountRate - terminalVal) / 100, 0.001);
      terminalValue = (currentFcf * (1 + terminalVal / 100)) / denominator;
    } else {
      // Exit Multiple Method
      terminalValue = currentFcf * terminalVal;
    }

    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, projectionYears);
    
    // Final Calculation
    let totalValue = currentValue + discountedTerminalValue;
    
    // Adjust for Net Debt (Enterprise -> Equity bridge)
    totalValue = totalValue - netDebtPerShare;

    setCalculatedValue(Math.max(totalValue, 0)); // Value can't be negative
    setChartData(projections);
  };

  // Update when inputs change
  useEffect(() => {
    calculateDCF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarios, activeScenario, fcf, netDebtPerShare, useDecay, terminalMethod]);

  const updateScenarioParam = (param: keyof ScenarioParams, value: number) => {
    setScenarios(prev => ({
      ...prev,
      [activeScenario]: {
        ...prev[activeScenario],
        [param]: value
      }
    }));
  };

  const resetDefaults = () => {
    setFcf(data.fcfPerShare);
    setNetDebtPerShare(0);
    setUseDecay(true);
    setTerminalMethod('growth');
    setActiveScenario('base');
    setScenarios({
        bear: { growthRate: data.scenarios.bear.growthRate, discountRate: data.discountRate + 2, terminalVal: data.terminalRate - 1.5 },
        base: { growthRate: data.growthRate, discountRate: data.discountRate, terminalVal: data.terminalRate },
        bull: { growthRate: data.scenarios.bull.growthRate, discountRate: Math.max(data.discountRate - 1, 6), terminalVal: data.terminalRate + 1 }
    });
  };

  const marginOfSafety = ((calculatedValue - data.price) / data.price) * 100;
  const isUndervalued = calculatedValue > data.price;

  // Helper for UI colors
  const getScenarioColor = (type: ScenarioType) => {
    if (type === 'bear') return 'red';
    if (type === 'bull') return 'emerald';
    return 'blue';
  };
  
  const getScenarioIcon = (type: ScenarioType) => {
    if (type === 'bear') return <TrendingDown className="w-4 h-4" />;
    if (type === 'bull') return <TrendingUp className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const activeColor = getScenarioColor(activeScenario);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Controls & Inputs */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 lg:col-span-1 shadow-lg flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            DCF Sandbox
          </h3>
          <button 
            onClick={resetDefaults}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <RefreshCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Scenario Selector */}
        <div className="flex bg-slate-900/50 p-1 rounded-lg mb-4 border border-slate-700/50">
          {(['bear', 'base', 'bull'] as ScenarioType[]).map((s) => (
             <button 
               key={s}
               onClick={() => setActiveScenario(s)}
               className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                 activeScenario === s 
                   ? `bg-slate-700 text-${getScenarioColor(s)}-400 shadow-sm border border-slate-600` 
                   : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {getScenarioIcon(s)}
               {s.charAt(0).toUpperCase() + s.slice(1)}
             </button>
          ))}
        </div>

        {/* Advanced Toggles */}
        <div className="flex gap-2 mb-6">
            <button 
                onClick={() => setUseDecay(!useDecay)}
                className={`flex-1 py-1.5 px-3 rounded border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    useDecay ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
            >
                <TrendingDown className={`w-3 h-3 ${useDecay ? '' : 'text-slate-600'}`} />
                Growth Decay {useDecay ? 'ON' : 'OFF'}
            </button>
            <button 
                onClick={() => setTerminalMethod(terminalMethod === 'growth' ? 'multiple' : 'growth')}
                className="flex-1 py-1.5 px-3 rounded border border-slate-700 bg-slate-800 text-slate-400 text-xs font-medium hover:text-white transition-colors"
            >
                Terminal: {terminalMethod === 'growth' ? 'Growth %' : 'Exit Multiple'}
            </button>
        </div>

        <div className="space-y-6 flex-grow">
           {/* Scenario Specific Sliders */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50 space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-bold text-${activeColor}-400`}>
                    {activeScenario === 'bear' ? 'Bear' : activeScenario === 'bull' ? 'Bull' : 'Base'} Growth Rate
                  </span>
                  <span className="text-white font-mono">{growthRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="40"
                  step="0.5"
                  value={growthRate}
                  onChange={(e) => updateScenarioParam('growthRate', parseFloat(e.target.value))}
                  className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${activeColor}-500`}
                />
                {useDecay && <div className="text-[10px] text-slate-500 text-right mt-1">Decays to ~3.0%</div>}
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Discount Rate (Risk)</span>
                  <span className="text-white font-mono">{discountRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.1"
                  value={discountRate}
                  onChange={(e) => updateScenarioParam('discountRate', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">
                    {terminalMethod === 'growth' ? 'Terminal Growth Rate' : 'Exit Multiple (EV/FCF)'}
                  </span>
                  <span className="text-white font-mono">
                    {terminalVal.toFixed(1)}{terminalMethod === 'growth' ? '%' : 'x'}
                  </span>
                </div>
                <input
                  type="range"
                  min={terminalMethod === 'growth' ? 0 : 5}
                  max={terminalMethod === 'growth' ? 6 : 50}
                  step={terminalMethod === 'growth' ? 0.1 : 0.5}
                  value={terminalVal}
                  onChange={(e) => updateScenarioParam('terminalVal', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
          </div>
          
          {/* Global Params */}
           <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Starting FCF / Share</span>
              <span className="text-white font-mono">{fcf.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(data.fcfPerShare * 3, 20)}
              step="0.01"
              value={fcf}
              onChange={(e) => setFcf(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
          </div>

          <div>
             <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400 flex items-center gap-1">
                 Net Debt / Share <span className="text-[10px] text-slate-500">(Optional)</span>
              </span>
              <span className="text-white font-mono">{netDebtPerShare.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={data.price}
              step="0.1"
              value={netDebtPerShare}
              onChange={(e) => setNetDebtPerShare(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-400"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
           <div className="flex justify-between items-end">
             <div>
               <p className="text-sm text-slate-400 mb-1">Intrinsic Value ({activeScenario})</p>
               <p className={`text-3xl font-bold ${isUndervalued ? 'text-emerald-400' : 'text-red-400'}`}>
                 {data.currency} {calculatedValue.toFixed(2)}
               </p>
             </div>
             <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Margin of Safety</p>
                <p className={`text-lg font-bold ${marginOfSafety > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {marginOfSafety > 0 ? '+' : ''}{marginOfSafety.toFixed(1)}%
                </p>
             </div>
           </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 lg:col-span-2 shadow-lg flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
           <div>
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-400" />
                DCF Projection ({activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
                {useDecay ? 'Using Linear Growth Decay Model' : 'Using Constant Growth Model'} • Terminal: {terminalMethod === 'growth' ? 'Perpetuity' : 'Exit Multiple'}
            </p>
           </div>
          
          <div className="flex gap-4 text-xs font-medium">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-slate-500"></div>
               <span className="text-slate-400">Future FCF</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className={`w-2 h-2 rounded-full bg-${activeColor}-500`}></div>
               <span className="text-slate-300">Discounted Value</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={2}>
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#e2e8f0' }}
                cursor={{ fill: '#334155', opacity: 0.2 }}
                labelStyle={{ fontWeight: 'bold', color: '#94a3b8' }}
              />
              <Bar dataKey="fcf" fill="#475569" radius={[4, 4, 0, 0]} name="Projected FCF" barSize={32} />
              <Bar 
                dataKey="discounted" 
                fill={activeScenario === 'bear' ? '#f87171' : activeScenario === 'bull' ? '#34d399' : '#60a5fa'} 
                radius={[4, 4, 0, 0]} 
                name="Present Value" 
                barSize={32} 
              />
              <ReferenceLine y={0} stroke="#334155" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Model Inputs</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Starting Growth</span>
                        <span className="text-slate-300">{growthRate.toFixed(1)}%</span>
                    </div>
                    {useDecay && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">Ending Growth (Y10)</span>
                            <span className="text-slate-300">~{terminalMethod === 'growth' ? terminalVal : 3.0}%</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-slate-500">Discount Rate</span>
                        <span className="text-slate-300">{discountRate.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-16 h-16 bg-${activeColor}-500/10 rounded-bl-full -mr-8 -mt-8`}></div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Percent className="w-3 h-3 text-amber-400" />
                    Implied Expectations
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                    Current Price: <span className="text-white font-mono">{data.price}</span>. 
                    Market implies a steady growth of <span className="text-white font-bold">{data.reverseDcfRate}%</span>. 
                    {growthRate > data.reverseDcfRate 
                        ? " Your assumptions are more optimistic than the market." 
                        : " Your assumptions are more conservative than the market."}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DCFCalculator;
