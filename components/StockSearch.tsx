
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, FileText, X, Database, ArrowRight, Sparkles } from 'lucide-react';
import { StockSuggestion } from '../types';
import { STOCKS } from '../data/stocks';

interface StockSearchProps {
  onSearch: (query: string, reportType: string) => void;
  isLoading: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [reportType, setReportType] = useState('consolidated');
  
  // Suggestion State
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant Local Search
  useEffect(() => {
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      // Filter stocks based on symbol or name
      const filtered = STOCKS.filter(stock => 
        stock.symbol.toLowerCase().startsWith(q) || 
        stock.name.toLowerCase().includes(q)
      ).slice(0, 6); // Limit matches to keep UI clean

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, reportType);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: StockSuggestion) => {
    setQuery(`${suggestion.symbol} ${suggestion.exchange}`);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative group flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if(query.trim().length > 0) setShowSuggestions(true); }}
            disabled={isLoading}
            className="block w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl 
                       text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent shadow-lg transition-all text-lg"
            placeholder="Search symbol (e.g. RELIANCE, AAPL) or company name..."
            autoComplete="off"
          />
          {query && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                type="button"
                onClick={() => { setQuery(''); setSuggestions([]); }}
                className="text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in-down">
              <ul className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
                {suggestions.map((item, idx) => (
                  <li 
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.symbol}</div>
                      <div className="text-xs text-slate-400">{item.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700">
                          {item.exchange}
                       </div>
                    </div>
                  </li>
                ))}
                
                {/* ALWAYS Show AI Fallback option */}
                {query.trim().length > 0 && (
                   <li 
                     onClick={(e) => handleSubmit(e as any)}
                     className="px-4 py-4 bg-blue-900/20 hover:bg-blue-900/40 cursor-pointer text-blue-300 flex items-center gap-3 border-t border-slate-700"
                   >
                     <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                     </div>
                     <div className="flex-1">
                        <span className="block font-medium text-sm text-blue-200">
                            Search for "<span className="font-bold text-white">{query}</span>" via Gemini
                        </span>
                        <span className="block text-[10px] text-blue-400/70">
                            Can't find it in the list? Analyze it anyway using AI.
                        </span>
                     </div>
                     <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
                   </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="relative min-w-[160px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            disabled={isLoading}
            className="block w-full pl-10 pr-8 py-4 bg-slate-800 border border-slate-700 rounded-xl 
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent shadow-lg appearance-none cursor-pointer"
          >
            <option value="consolidated">Consolidated</option>
            <option value="standalone">Standalone</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed 
                     text-white rounded-xl text-lg font-medium transition-colors shadow-lg whitespace-nowrap"
        >
          Analyze
        </button>
      </form>
      <div className="mt-3 flex items-center justify-center gap-4 text-sm text-slate-500">
         <span className="flex items-center gap-1"><Database className="w-3 h-3" /> 
            {suggestions.length > 0 ? 'Match Found' : 'AI Search'}
         </span>
         <span>•</span>
         <span>Powered by Gemini</span>
      </div>
    </div>
  );
};

export default StockSearch;
