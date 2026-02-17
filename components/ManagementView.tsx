
import React from 'react';
import { ManagementData } from '../types';
import { UserCheck, Briefcase, Award, Info, Users, PieChart } from 'lucide-react';

interface ManagementViewProps {
  data: ManagementData;
}

const ManagementView: React.FC<ManagementViewProps> = ({ data }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-indigo-400" />
        <h3 className="text-xl font-bold text-white">Management & Governance</h3>
      </div>

      <div className="flex flex-col gap-6">
        {/* Executives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.executives.map((exec, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">{exec.name}</h4>
                    <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">{exec.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Award className="w-4 h-4 text-amber-500/80" />
                  <span>Tenure: <span className="text-slate-200">{exec.tenure}</span></span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-400">
                  <Briefcase className="w-4 h-4 text-blue-500/80 mt-0.5 shrink-0" />
                  <p className="line-clamp-3 text-xs leading-relaxed">{exec.background}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stakeholders Section */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-700/50 rounded-lg p-5">
             <div className="flex items-center gap-2 mb-4">
               <PieChart className="w-5 h-5 text-emerald-400" />
               <h4 className="text-lg font-semibold text-slate-200">Shareholding Pattern</h4>
             </div>
             <div className="space-y-4">
               {data.stakeholders && data.stakeholders.length > 0 ? (
                 data.stakeholders.map((holder, idx) => (
                   <div key={idx} className="flex items-center gap-4">
                     <div className="w-32 shrink-0 text-sm text-slate-300 font-medium truncate">{holder.name}</div>
                     <div className="flex-1">
                       <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-indigo-500 rounded-full" 
                           style={{ width: `${Math.min(holder.equityPercentage, 100)}%` }}
                         ></div>
                       </div>
                     </div>
                     <div className="w-20 text-right text-sm font-bold text-white">{holder.equityPercentage}%</div>
                     <div className="w-24 text-right text-xs text-slate-500 uppercase tracking-wide">{holder.type}</div>
                   </div>
                 ))
               ) : (
                 <p className="text-slate-500 text-sm italic">Shareholding data not available.</p>
               )}
             </div>
          </div>

          {/* Governance Review */}
          <div className="lg:col-span-1 bg-gradient-to-br from-slate-900/60 to-indigo-900/10 border border-indigo-500/20 rounded-lg p-5">
             <div className="flex items-center gap-2 mb-3">
               <Info className="w-5 h-5 text-indigo-400" />
               <h4 className="text-lg font-semibold text-slate-200">Governance Review</h4>
             </div>
             <p className="text-slate-300 text-sm leading-relaxed">
               {data.governanceReview}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementView;
