
import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { Globe, Users, Factory, Plane, Box, Info, Map, Package, ShoppingBag, Star } from 'lucide-react';

interface CompanyProfileViewProps {
  data: CompanyProfile;
}

const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({ data }) => {
  const [selectedSegment, setSelectedSegment] = useState<number>(0);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Factory className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Company Profile</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Segments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Description */}
          <div className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/50">
            <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Box className="w-4 h-4 text-blue-400" /> Business Model
            </h4>
            <span className="inline-block px-2 py-1 mb-3 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">
                {data.businessModel}
            </span>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-line">{data.description}</p>

            {/* Interactive Segments */}
            {data.segments && data.segments.length > 0 && (
              <div>
                 <h5 className="text-xs font-bold text-slate-400 mb-2 uppercase">Business Segments (Click for details)</h5>
                 <div className="flex flex-wrap gap-2 mb-4">
                   {data.segments.map((seg, i) => (
                     <button 
                       key={i} 
                       onClick={() => setSelectedSegment(i)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                         selectedSegment === i 
                         ? 'bg-blue-600 text-white border-blue-500 shadow-md transform scale-105' 
                         : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                       }`}
                     >
                       {seg.name}
                     </button>
                   ))}
                 </div>
                 
                 {/* Selected Segment Detail */}
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 animate-fade-in">
                    <div className="flex justify-between items-start mb-2">
                       <h6 className="text-sm font-bold text-white">{data.segments[selectedSegment].name}</h6>
                       {data.segments[selectedSegment].revenueShare > 0 && (
                         <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                           ~{data.segments[selectedSegment].revenueShare}% Revenue
                         </span>
                       )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {data.segments[selectedSegment].description}
                    </p>
                 </div>
              </div>
            )}
          </div>

          {/* Demographics / Geographic Split & Trade Profile */}
          <div className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/50">
             <div className="flex flex-col md:flex-row gap-6">
                
                {/* Geography Chart */}
                <div className="flex-1">
                   <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <Map className="w-4 h-4 text-amber-400" /> Revenue Geography
                   </h4>
                   
                   {data.geographicSplit && data.geographicSplit.length > 0 ? (
                     <div className="space-y-4">
                       {data.geographicSplit.map((geo, idx) => (
                         <div key={idx} className="flex items-center gap-4">
                            <div className="w-28 shrink-0 text-xs text-slate-300 font-medium truncate" title={geo.region}>{geo.region}</div>
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full rounded-full ${idx === 0 ? 'bg-amber-500' : 'bg-slate-500'}`} 
                                 style={{ width: `${geo.percentage}%` }}
                               ></div>
                            </div>
                            <div className="w-10 text-right text-xs font-bold text-white">{geo.percentage}%</div>
                         </div>
                       ))}
                     </div>
                   ) : (
                      <div className="text-slate-500 text-xs">Geographic split not available.</div>
                   )}
                </div>

                {/* Import/Export Details */}
                <div className="flex-1 md:border-l md:border-slate-700 md:pl-6">
                   <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" /> Trade Profile
                   </h4>
                   
                   <div className="space-y-4">
                      {/* Exports */}
                      <div>
                         <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 flex items-center gap-1"><Plane className="w-3 h-3" /> Export Revenue</span>
                            <span className="text-white font-bold">{data.tradeProfile.exportRevenuePercentage}%</span>
                         </div>
                         <div className="flex flex-wrap gap-1 mb-2">
                            {data.tradeProfile.topExportCountries?.slice(0,4).map((c, i) => (
                               <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{c}</span>
                            ))}
                         </div>
                         {data.tradeProfile.exportProducts && data.tradeProfile.exportProducts.length > 0 && (
                            <div className="bg-slate-800/30 p-2 rounded border border-slate-700/50">
                               <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1 flex items-center gap-1">
                                  <Package className="w-3 h-3" /> Key Exports
                               </div>
                               <p className="text-[10px] text-slate-300 leading-snug">
                                  {data.tradeProfile.exportProducts.slice(0, 5).join(', ')}
                               </p>
                            </div>
                         )}
                      </div>

                      {/* Imports */}
                      <div>
                         <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> Import Raw Mat.</span>
                            <span className="text-white font-bold">{data.tradeProfile.importMaterialPercentage}%</span>
                         </div>
                         <div className="flex flex-wrap gap-1 mb-2">
                            {data.tradeProfile.topImportCountries?.slice(0,4).map((c, i) => (
                               <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{c}</span>
                            ))}
                         </div>
                         {data.tradeProfile.importMaterials && data.tradeProfile.importMaterials.length > 0 && (
                            <div className="bg-slate-800/30 p-2 rounded border border-slate-700/50">
                               <div className="text-[10px] text-amber-400 uppercase font-bold mb-1 flex items-center gap-1">
                                  <Box className="w-3 h-3" /> Key Imports
                               </div>
                               <p className="text-[10px] text-slate-300 leading-snug">
                                  {data.tradeProfile.importMaterials.slice(0, 5).join(', ')}
                               </p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Clientele */}
        <div className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/50 flex flex-col h-full">
          <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" /> Comprehensive Clientele
          </h4>
          
          <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-600 pr-2">
            {data.clientele && data.clientele.length > 0 ? (
              data.clientele.map((client, idx) => (
                <div key={idx} className={`p-3 rounded-lg border transition-all ${
                   client.isKeyClient 
                   ? 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/30' 
                   : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800/60 hover:border-slate-600'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                        {client.isKeyClient && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        <div className={`font-bold text-sm ${client.isKeyClient ? 'text-white' : 'text-slate-200'}`}>
                            {client.name}
                        </div>
                    </div>
                    {client.percentage > 0 && (
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-900/30 px-1.5 py-0.5 rounded shrink-0 ml-2">
                        {client.percentage}%
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider">{client.sector}</div>
                  {client.relationDetails && (
                    <div className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/50 flex gap-2 items-start">
                       <Info className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
                       <span className="leading-snug">{client.relationDetails}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 text-xs italic py-10">
                Detailed clientele data not publicly available.
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-700/50 text-[10px]">
             <span className="text-slate-500">Forex Risk:</span> 
             <span className="text-slate-300 ml-1">{data.tradeProfile.currencyRisk}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileView;
