import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BrainCircuit } from 'lucide-react';

interface LoadingViewProps {
  symbol: string;
}

const QUOTES = [
  { text: "Price is what you pay. Value is what you get.", author: "Warren Buffett" },
  { text: "In the short run, the market is a voting machine but in the long run, it is a weighing machine.", author: "Benjamin Graham" },
  { text: "The big money is not in the buying and selling, but in the waiting.", author: "Charlie Munger" },
  { text: "Know what you own, and know why you own it.", author: "Peter Lynch" },
  { text: "Be fearful when others are greedy and greedy when others are fearful.", author: "Warren Buffett" },
  { text: "The stock market is designed to transfer money from the Active to the Patient.", author: "Warren Buffett" },
  { text: "Invest in a business any fool can run, because someday a fool will.", author: "Peter Lynch" },
  { text: "A great business at a fair price is superior to a fair business at a great price.", author: "Charlie Munger" },
  { text: "The four most dangerous words in investing are: 'This time it's different'.", author: "Sir John Templeton" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" }
];

const LoadingView: React.FC<LoadingViewProps> = ({ symbol }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-4xl mx-auto p-8">
      
      {/* Bull vs Bear Animation */}
      <div className="relative w-64 h-32 flex justify-center items-center mb-12">
        {/* Glow Effects */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse delay-75"></div>

        {/* The Bull */}
        <div className="absolute left-0 animate-[clash-left_2s_ease-in-out_infinite]">
          <TrendingUp className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
        </div>

        {/* The Bear */}
        <div className="absolute right-0 animate-[clash-right_2s_ease-in-out_infinite]">
          <TrendingDown className="w-16 h-16 text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
        </div>

        {/* Impact Spark in the middle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <BrainCircuit className="w-8 h-8 text-blue-400 animate-ping opacity-75" />
        </div>
      </div>

      {/* Analysis Status */}
      <div className="text-center mb-10 space-y-2">
        <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          Analyzing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{symbol.toUpperCase()}</span>
        </h3>
        <p className="text-slate-400 text-sm animate-pulse">Computing Intrinsic Value & Moat Rating...</p>
      </div>

      {/* Quotes Carousel */}
      <div className="max-w-xl text-center bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
        <div className="min-h-[80px] flex flex-col justify-center transition-all duration-500 transform">
          <p className="text-lg text-slate-200 font-serif italic mb-3 leading-relaxed">
            "{QUOTES[quoteIndex].text}"
          </p>
          <p className="text-sm text-blue-400 font-medium tracking-wide uppercase">
            — {QUOTES[quoteIndex].author}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes clash-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(60px) scale(1.1); }
        }
        @keyframes clash-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-60px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingView;