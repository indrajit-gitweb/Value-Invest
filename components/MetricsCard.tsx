import React from 'react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, subValue, icon, trend, color = "blue" }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {value}
          </h3>
          {subValue && (
            <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
              {subValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;