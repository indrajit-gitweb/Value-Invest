
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StockAnalysis, StockSuggestion } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    symbol: { type: Type.STRING, description: "Stock Ticker Symbol" },
    name: { type: Type.STRING, description: "Company Name" },
    price: { type: Type.NUMBER, description: "Current Live Stock Price. EXTRACTED FROM GOOGLE SEARCH." },
    previousOpen: { type: Type.NUMBER, description: "Opening Price of the Previous Trading Session (Yesterday's Open)" },
    previousClose: { type: Type.NUMBER, description: "Previous Day's Closing Price" },
    openPrice: { type: Type.NUMBER, description: "Today's Opening Price" },
    high52Week: { type: Type.NUMBER, description: "52-Week High Price" },
    low52Week: { type: Type.NUMBER, description: "52-Week Low Price" },
    currency: { type: Type.STRING, description: "Currency Code (e.g., USD, INR)" },
    
    // Header Extensions
    listingDate: { type: Type.STRING, description: "Date when the company was listed on the stock exchange (YYYY-MM-DD or Month Year)" },
    faceValue: { type: Type.NUMBER, description: "Face Value of the share" },
    bookValue: { type: Type.NUMBER, description: "Book Value per Share" },
    marketCapCategory: { type: Type.STRING, description: "Category: Large Cap, Mid Cap, Small Cap, or Micro Cap" },
    sector: { type: Type.STRING, description: "Broad Sector (e.g. Energy, Technology, Healthcare)" },
    industry: { type: Type.STRING, description: "Specific Industry (e.g. Oil & Gas Refining, Software - Infrastructure)" },

    pe: { type: Type.NUMBER, description: "Price to Earnings Ratio" },
    pb: { type: Type.NUMBER, description: "Price to Book Ratio" },
    dividendYield: { type: Type.NUMBER, description: "Annual Dividend Yield percentage (e.g. 1.5 for 1.5%)" },
    marketCap: { type: Type.STRING, description: "Market Capitalization (formatted string, e.g. '2.5T')" },
    ebitda: { type: Type.STRING, description: "EBITDA (formatted string, e.g. '450M' or '1.2B')" },

    // Fundamentals
    roce: { type: Type.NUMBER, description: "Return on Capital Employed (%)" },
    roe: { type: Type.NUMBER, description: "Return on Equity (%)" },
    eps: { type: Type.NUMBER, description: "Earnings Per Share" },
    pat: { type: Type.STRING, description: "Profit After Tax / Net Income (formatted string, e.g. '10.5B')" },
    freeCashFlow: { type: Type.STRING, description: "Total Free Cash Flow (formatted string, e.g. '8.2B')" },
    opm: { type: Type.NUMBER, description: "Operating Profit Margin (%)" },
    revenue: { type: Type.STRING, description: "Total Revenue (formatted string, e.g. '50.2B')" },
    revenueGrowth: { type: Type.NUMBER, description: "Revenue Growth Rate YoY (%)" },
    sectorPe: { type: Type.NUMBER, description: "Sector Price to Earnings Ratio" },
    industryPe: { type: Type.NUMBER, description: "Industry Price to Earnings Ratio" },

    // Growth Tables
    salesGrowth: {
      type: Type.OBJECT,
      properties: {
        tenYear: { type: Type.STRING, description: "10 Years Compounded Sales Growth %" },
        fiveYear: { type: Type.STRING, description: "5 Years Compounded Sales Growth %" },
        threeYear: { type: Type.STRING, description: "3 Years Compounded Sales Growth %" },
        recent: { type: Type.STRING, description: "TTM Compounded Sales Growth %" }
      }
    },
    profitGrowth: {
       type: Type.OBJECT,
      properties: {
        tenYear: { type: Type.STRING, description: "10 Years Compounded Profit Growth %" },
        fiveYear: { type: Type.STRING, description: "5 Years Compounded Profit Growth %" },
        threeYear: { type: Type.STRING, description: "3 Years Compounded Profit Growth %" },
        recent: { type: Type.STRING, description: "TTM Compounded Profit Growth %" }
      }
    },
    stockPriceCagr: {
       type: Type.OBJECT,
      properties: {
        tenYear: { type: Type.STRING, description: "10 Years Stock Price CAGR %" },
        fiveYear: { type: Type.STRING, description: "5 Years Stock Price CAGR %" },
        threeYear: { type: Type.STRING, description: "3 Years Stock Price CAGR %" },
        recent: { type: Type.STRING, description: "1 Year Stock Price CAGR %" }
      }
    },
    roeHistory: {
       type: Type.OBJECT,
      properties: {
        tenYear: { type: Type.STRING, description: "10 Years Average ROE %" },
        fiveYear: { type: Type.STRING, description: "5 Years Average ROE %" },
        threeYear: { type: Type.STRING, description: "3 Years Average ROE %" },
        recent: { type: Type.STRING, description: "Last Year ROE %" }
      }
    },

    // Peers
    peers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING, description: "Peer Symbol" },
          name: { type: Type.STRING, description: "Peer Company Name" },
          price: { type: Type.NUMBER, description: "Current Price" },
          pe: { type: Type.NUMBER, description: "P/E Ratio" },
          marketCap: { type: Type.STRING, description: "Market Cap string" },
          roe: { type: Type.NUMBER, description: "Return on Equity %" },
          dividendYield: { type: Type.NUMBER, description: "Dividend Yield %" }
        }
      },
      description: "List of 3-5 direct competitors/peers with their key metrics."
    },

    // Financial Statements
    financials: {
      type: Type.OBJECT,
      properties: {
        profitLoss: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING, description: "Year (e.g. Mar 2010)" },
              sales: { type: Type.STRING },
              expenses: { type: Type.STRING },
              operatingProfit: { type: Type.STRING },
              opm: { type: Type.STRING },
              otherIncome: { type: Type.STRING },
              interest: { type: Type.STRING },
              depreciation: { type: Type.STRING },
              profitBeforeTax: { type: Type.STRING },
              tax: { type: Type.STRING },
              netProfit: { type: Type.STRING },
              eps: { type: Type.STRING },
              dividendPayout: { type: Type.STRING }
            }
          },
          description: "Profit & Loss. **MANDATORY: Provide data for at least 10 years (or since inception if less). Do not truncate to 2 years.**"
        },
        balanceSheet: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING },
              equityCapital: { type: Type.STRING },
              reserves: { type: Type.STRING },
              borrowings: { type: Type.STRING },
              otherLiabilities: { type: Type.STRING },
              totalLiabilities: { type: Type.STRING },
              fixedAssets: { type: Type.STRING },
              cwip: { type: Type.STRING },
              investments: { type: Type.STRING },
              otherAssets: { type: Type.STRING },
              totalAssets: { type: Type.STRING }
            }
          },
          description: "Balance Sheet. **MANDATORY: Provide data for at least 10 years.**"
        },
        cashFlow: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING },
              cashFromOperating: { type: Type.STRING },
              cashFromInvesting: { type: Type.STRING },
              cashFromFinancing: { type: Type.STRING },
              netCashFlow: { type: Type.STRING }
            }
          },
          description: "Cash Flow. **MANDATORY: Provide data for at least 10 years.**"
        }
      }
    },

    // Earnings
    earnings: {
       type: Type.OBJECT,
       properties: {
          history: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   date: { type: Type.STRING },
                   quarter: { type: Type.STRING },
                   keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                   sentiment: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] }
                }
             },
             description: "Summary of last 2-3 earnings calls"
          },
          nextDate: { type: Type.STRING, description: "Estimated date of next earnings call" }
       }
    },

    // Insights
    latestInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          source: { type: Type.STRING },
          date: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] }
        }
      },
      description: "Latest important news or analyst reports"
    },

    // NEW: Company Profile & Clients
    companyProfile: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: "IN-DEPTH description of the business model. Explain the value chain, how it makes money, and unique positioning." },
        businessModel: { type: Type.STRING, description: "Short Business Model tag (e.g. B2B Specialized Manufacturing, B2C Retail)" },
        segments: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the business segment" },
              description: { type: Type.STRING, description: "Detailed 3-4 sentence description of this segment, its products, and market position." },
              revenueShare: { type: Type.NUMBER, description: "Approximate % revenue contribution (0 if unknown)" }
            }
          }, 
          description: "Detailed list of business segments or product lines." 
        },
        clientele: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Client Name" },
              percentage: { type: Type.NUMBER, description: "Estimated revenue dependency % (0 if unknown)" },
              sector: { type: Type.STRING, description: "Sector of the client" },
              relationDetails: { type: Type.STRING, description: "Details about relationship (e.g. '10 year contract', 'Strategic partner')." },
              isKeyClient: { type: Type.BOOLEAN, description: "True if this is a top/critical client (top 5). False for general client list." }
            }
          },
          description: "Comprehensive list of clients. Try to list at least 10-15 clients if available, distinguishing key clients from others."
        },
        geographicSplit: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              region: { type: Type.STRING, description: "Region Name (e.g. India, USA, Europe, Rest of World)" },
              percentage: { type: Type.NUMBER, description: "% of Total Revenue" }
            }
          },
          description: "Revenue breakdown by geography (Demographics). MUST include India vs Rest of World split if Indian company."
        },
        tradeProfile: {
          type: Type.OBJECT,
          properties: {
            exportRevenuePercentage: { type: Type.NUMBER, description: "% of revenue from Exports" },
            importMaterialPercentage: { type: Type.NUMBER, description: "% of raw materials Imported" },
            topExportCountries: { type: Type.ARRAY, items: { type: Type.STRING } },
            topImportCountries: { type: Type.ARRAY, items: { type: Type.STRING } },
            exportProducts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific goods/products exported." },
            importMaterials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific raw materials or goods imported." },
            currencyRisk: { type: Type.STRING, description: "Risk level due to forex fluctuation" }
          },
          description: "Import and Export details including specific products and materials."
        }
      },
      required: ["description", "clientele", "tradeProfile", "segments", "geographicSplit"]
    },

    // NEW: Market Activity
    marketActivity: {
      type: Type.OBJECT,
      properties: {
        marketSentiment: { type: Type.STRING, description: "Current market sentiment towards this stock (Bullish/Bearish/Neutral) with a short reason." },
        corporateActions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Dividend, Bonus, Split, etc." },
              date: { type: Type.STRING },
              details: { type: Type.STRING, description: "e.g. 1:1 Bonus or $2 Dividend" }
            }
          },
          description: "Recent or upcoming corporate actions (last 6 months or next 3 months)."
        },
        insiderTrading: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              person: { type: Type.STRING, description: "Insider Name" },
              type: { type: Type.STRING, enum: ["Buy", "Sell", "Pledge"] },
              quantity: { type: Type.STRING },
              price: { type: Type.STRING },
              value: { type: Type.STRING }
            }
          },
          description: "Recent insider trades (last 6 months). IMPORTANT: Search for 'Insider trading [stock]' or 'Shareholding pattern changes'."
        },
        blockDeals: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              clientName: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["Buy", "Sell"] },
              quantity: { type: Type.STRING },
              price: { type: Type.STRING }
            }
          },
          description: "Recent bulk or block deals (last 3-6 months)."
        },
        redFlags: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              category: { type: Type.STRING, enum: ["Accounting", "Governance", "Regulatory", "Pledging"] },
              description: { type: Type.STRING }
            }
          },
          description: "Forensic checks: ASM/GSM list, high promoter pledging, auditor resignation, frequent CFO changes, contingent liabilities."
        }
      },
      required: ["corporateActions", "insiderTrading", "blockDeals", "redFlags", "marketSentiment"]
    },

    // Value Investing Specifics
    grahamNumber: { type: Type.NUMBER, description: "Benjamin Graham's Valuation Number (Sqrt(22.5 * EPS * BVPS))" },
    pegRatio: { type: Type.NUMBER, description: "Peter Lynch's PEG Ratio (PE / Growth Rate)" },
    earningsYield: { type: Type.NUMBER, description: "Greenblatt's Earnings Yield (EBIT / Enterprise Value) in %" },
    debtToEquity: { type: Type.NUMBER, description: "Debt to Equity Ratio" },
    interestCoverage: { type: Type.NUMBER, description: "Interest Coverage Ratio" },

    // Additional Classic Models
    grahamGrowthValue: { type: Type.NUMBER, description: "Intrinsic value based on Graham's Formula: EPS * (8.5 + 2 * Growth)" },
    piotroskiFScore: { type: Type.NUMBER, description: "Piotroski F-Score (0-9) measuring financial strength" },
    evToEbitda: { type: Type.NUMBER, description: "EV / EBITDA Ratio. A lower number indicates undervaluation." },

    // Buffett & Munger Specifics
    moatRating: { type: Type.STRING, enum: ["Wide", "Narrow", "None"], description: "Economic Moat Rating based on competitive advantage." },
    moatSource: { type: Type.STRING, description: "Primary source of the moat (e.g., Network Effect, Switching Costs, Cost Advantage, Brand)." },
    ownerEarningsPerShare: { type: Type.NUMBER, description: "Buffett's Owner Earnings per share (Net Income + D&A - Maintenance CapEx)." },
    buffettTenCapPrice: { type: Type.NUMBER, description: "The price at which Owner Earnings yield is 10% (Owner Earnings * 10)." },
    roic: { type: Type.NUMBER, description: "Return on Invested Capital (%) - Munger's key metric." },
    wacc: { type: Type.NUMBER, description: "Weighted Average Cost of Capital (%)." },
    shareBuybackYield: { type: Type.NUMBER, description: "Annual Share Buyback Yield (%) (Positive if shares reduced, negative if diluted)." },

    // SOTP Data
    netDebt: { type: Type.NUMBER, description: "Total Net Debt (Total Debt - Cash) in absolute numbers (same scale as share price not required, but consistent with segments)." },
    totalShares: { type: Type.NUMBER, description: "Total Number of Outstanding Shares." },
    segments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the business segment (e.g., O2C, Retail, Digital)" },
          revenue: { type: Type.NUMBER, description: "Segment Revenue (Absolute Number)" },
          ebitda: { type: Type.NUMBER, description: "Segment EBITDA (Absolute Number)" },
          valuationMultiple: { type: Type.NUMBER, description: "Appropriate EV/EBITDA multiple for this segment based on industry standards." },
          growthRate: { type: Type.NUMBER, description: "Expected growth rate for this segment." },
          narrative: { type: Type.STRING, description: "Short description of segment performance." }
        }
      },
      description: "Breakdown of business segments for Sum-of-the-Parts valuation."
    },

    // Management & Governance
    management: {
      type: Type.OBJECT,
      properties: {
        executives: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              tenure: { type: Type.STRING, description: "Time in role (e.g., '12 Years')" },
              background: { type: Type.STRING, description: "Brief background/track record summary" }
            }
          }
        },
        stakeholders: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Category Name (e.g., Promoters, FII, DII, Public)" },
              equityPercentage: { type: Type.NUMBER, description: "Total percentage held by this category" },
              type: { type: Type.STRING, description: "Category Code: Promoter, FII, DII, Public" },
              breakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                     name: { type: Type.STRING, description: "Name of specific fund or individual" },
                     percentage: { type: Type.NUMBER, description: "Percentage held by this specific entity" }
                  }
                },
                description: "List of top 3-5 individual major holders within this category if available (e.g. specific Mutual Funds in DII, Vanguard in FII)"
              }
            }
          },
          description: "List of major shareholders aggregated by category with optional breakdown of major entities."
        },
        governanceReview: { type: Type.STRING, description: "Assessment of management quality, integrity, and capital allocation history." }
      },
      required: ["executives", "stakeholders", "governanceReview"]
    },

    // Technical Indicators
    technicals: {
      type: Type.OBJECT,
      properties: {
        ma200: { type: Type.NUMBER, description: "200-Day Simple Moving Average" },
        ma100: { type: Type.NUMBER, description: "100-Day Simple Moving Average" },
        ma50: { type: Type.NUMBER, description: "50-Day Simple Moving Average" },
        ema21: { type: Type.NUMBER, description: "21-Day Exponential Moving Average" },
        support: {
          type: Type.OBJECT,
          properties: {
            s1: { type: Type.NUMBER, description: "Fibonacci Support Level 1 (S1)" },
            s2: { type: Type.NUMBER, description: "Fibonacci Support Level 2 (S2)" },
            s3: { type: Type.NUMBER, description: "Fibonacci Support Level 3 (S3)" }
          },
          required: ["s1", "s2", "s3"]
        },
        resistance: {
          type: Type.OBJECT,
          properties: {
            r1: { type: Type.NUMBER, description: "Fibonacci Resistance Level 1 (R1)" },
            r2: { type: Type.NUMBER, description: "Fibonacci Resistance Level 2 (R2)" },
            r3: { type: Type.NUMBER, description: "Fibonacci Resistance Level 3 (R3)" }
          },
          required: ["r1", "r2", "r3"]
        }
      },
      required: ["ma200", "ma100", "ma50", "ema21", "support", "resistance"]
    },

    fcfPerShare: { type: Type.NUMBER, description: "Free Cash Flow per Share (Trailing 12M or Last FY)" },
    growthRate: { type: Type.NUMBER, description: "Expected Annual Growth Rate for next 5-10 years (percentage, e.g. 15 for 15%)" },
    discountRate: { type: Type.NUMBER, description: "Discount Rate / WACC (percentage, e.g. 10)" },
    terminalRate: { type: Type.NUMBER, description: "Terminal Growth Rate (percentage, e.g. 2.5)" },
    intrinsicValue: { type: Type.NUMBER, description: "Calculated Intrinsic Value based on DCF" },
    reverseDcfRate: { type: Type.NUMBER, description: "Growth rate implied by current stock price (Reverse DCF)" },
    scenarios: {
      type: Type.OBJECT,
      properties: {
        bull: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER },
            narrative: { type: Type.STRING },
            growthRate: { type: Type.NUMBER }
          }
        },
        base: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER },
            narrative: { type: Type.STRING },
            growthRate: { type: Type.NUMBER }
          }
        },
        bear: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER },
            narrative: { type: Type.STRING },
            growthRate: { type: Type.NUMBER }
          }
        }
      }
    },
    growthFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key growth drivers"
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key risks"
    },
    financialReview: {
      type: Type.STRING,
      description: "A comprehensive 2-paragraph financial review covering revenue, margins, and balance sheet health."
    }
  },
  required: [
    "symbol", "name", "price", "previousOpen", "previousClose", "openPrice", "high52Week", "low52Week", "currency",
    "listingDate", "faceValue", "bookValue", "marketCapCategory", "sector", "industry",
    "pe", "pb", "dividendYield", "marketCap", "ebitda",
    "fcfPerShare", "intrinsicValue", "scenarios", 
    "financialReview", "roce", "roe", "eps", "opm", "revenue", "grahamNumber", 
    "pegRatio", "debtToEquity", "grahamGrowthValue", "piotroskiFScore", "evToEbitda",
    "moatRating", "moatSource", "ownerEarningsPerShare", "buffettTenCapPrice", "roic", "wacc", "shareBuybackYield",
    "management", "technicals", "segments", "netDebt", "totalShares",
    "salesGrowth", "profitGrowth", "stockPriceCagr", "roeHistory", "peers",
    "financials", "earnings", "latestInsights",
    "companyProfile", "marketActivity"
  ]
};

export const analyzeStock = async (query: string, reportType: string): Promise<StockAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a comprehensive value investing analysis for the stock: "${query}". 
      
      CRITICAL INSTRUCTIONS FOR PRICE ACCURACY:
      1. **REAL-TIME PRICE**: 
         - Perform a Google Search for "stock price ${query}".
         - Perform a second Google Search for "${query} share price today google finance".
         - **EXTRACT THE LIVE PRICE** from the large bold text at the top of the search results.
         - Do **NOT** use the "Closing Price" from yesterday unless the market is currently closed.
         - Do **NOT** use prices from old news articles (e.g. "Stock hits 52 week high of X").
         - **CHECK CURRENCY**: Ensure the price matches the currency of the exchange (e.g. INR for NSE/BSE, USD for NYSE/NASDAQ).
         - **CHECK EXCHANGE**: Ensure you are looking at the primary listing (e.g. Reliance on NSE, Apple on NASDAQ).
      
      2. **MARKET DATA**:
         - **Previous Open**: Opening price of the PREVIOUS trading session.
         - **Previous Close**: Closing price of the PREVIOUS trading session.
         - **Open Price**: Opening price of TODAY's session.
         - **52-Week High/Low**: Search specifically for "52 week high low ${query}".
         - **LISTING DATE**: Date when the company was listed on the stock exchange.
         - **FACE VALUE**: Face value of the share.
         - **BOOK VALUE**: Book value per share.
         - **CATEGORIZATION**: Determine if it is Large Cap, Mid Cap, Small Cap, or Micro Cap based on local market standards. Identify Sector and Industry.
      
      3. **COMPANY PROFILE & CLIENTS (NEW)**:
         - **Description**: What does the company *actually* do? Explain the business model clearly.
         - **Business Segments**: Detail every major business segment. Provide a description and revenue contribution %.
         - **Clients**: Provide a **COMPREHENSIVE** list of clients. Distinguish between 'Key Clients' (top 5 revenue contributors) and other major clients. Search for "Client list of ${query}" or "Customer base".
         - **Demographics/Geography**: Breakdown revenue by region (e.g. India vs Rest of World).
         - **Import/Export**: 
            - Does it export? To which countries? **What specific products are exported?**
            - Does it import raw materials? **What specific raw materials?**

      4. **MARKET ACTIVITY (NEW)**:
         - **Corporate Actions**: Search for recent Dividends, Bonus issues, Splits in the last year.
         - **Insider Trading**: Search for "Insider selling buying ${query} last 6 months". Look for promoter pledges.
         - **Block Deals**: Search for "Block deals bulk deals ${query} recent".
         - **Red Flags**: Check for ASM/GSM list, high pledging, auditor resignations, tax disputes.

      5. **FINANCIALS (${reportType.toUpperCase()})**:
         - Use reliable sources: Yahoo Finance, Screener.in, Morningstar.
         - Ensure you are using **${reportType}** figures (Consolidated vs Standalone) as requested.
         - Use TTM (Trailing Twelve Months) where available, otherwise last Fiscal Year.

      6. **COMPOUNDED GROWTH TABLES (Screener.in Style)**:
         - **Compounded Sales Growth**: 10 Years, 5 Years, 3 Years, TTM.
         - **Compounded Profit Growth**: 10 Years, 5 Years, 3 Years, TTM.
         - **Stock Price CAGR**: 10 Years, 5 Years, 3 Years, 1 Year.
         - **Return on Equity**: 10 Years, 5 Years, 3 Years, Last Year.

      7. **PEER COMPARISON**:
         - Identify 3-5 direct competitors/peers.
         - Fetch their Market Cap, P/E, ROE, Dividend Yield, and Current Price.
      
      8. **HISTORICAL FINANCIAL STATEMENTS (DETAILED)**:
         - **IMPORTANT**: Provide **ANNUAL data starting from the earliest available year (inception/listing)**. 
         - Do not limit to 5 years. If the company has 20 years of history, try to provide 20 columns.
         - **Profit & Loss**: Sales, Expenses, Op Profit, OPM%, Other Inc, Interest, Depreciation, PBT, Tax, Net Profit, EPS, Dividend Payout %.
         - **Balance Sheet**: Equity Capital, Reserves, Borrowings, Other Liabilities, Total Liabilities, Fixed Assets, CWIP, Investments, Other Assets, Total Assets.
         - **Cash Flows**: Operating, Investing, Financing, Net Cash Flow.
         - Format all numbers as compact strings (e.g., "1200", "5000") but consistent.

      9. **EARNINGS & INSIGHTS**:
         - **Earnings Calls**: Summarize the last 2-3 earnings calls with key takeaways and sentiment. Provide estimate for next call date.
         - **At a Glance Insights**: Find latest news/reports (last 3-6 months) and summarize 3 key developments with sentiment.
      
      10. **CALCULATIONS**:
         - **Intrinsic Value**: Perform a 2-stage DCF.
         - **Graham/Lynch/Greenblatt Metrics**: Calculate strictly based on the formulae.
         - **Reverse DCF**: What growth rate does the *current* price imply?
         - **SUM OF THE PARTS (SOTP)**:
            - If the company is a conglomerate (e.g. Reliance, Tata, Berkshire, Alphabet), you MUST breakdown revenue and EBITDA by segment.
            - Search for "Segment wise revenue EBITDA ${query}".
            - Assign appropriate valuation multiples (EV/EBITDA) to each segment based on its industry (e.g. Oil=6-8x, Retail=25x, Tech=20x).
            - Get Net Debt and Total Outstanding Shares for final SOTP per share calculation.
      
      Required Data Points:
      - Price (Current, Prev Open, Prev Close, Open, 52w High, 52w Low)
      - **Listing Date, Face Value, Book Value**
      - **Market Cap Category, Sector, Industry**
      - PE Ratio, PB Ratio, Dividend Yield, Market Cap, **EBITDA**
      - ROCE, ROE, EPS, PAT, OPM, Revenue, Revenue Growth
      - Free Cash Flow (Total and Per Share)
      - Sector PE and Industry PE
      
      Classic Value Investing Metrics:
      - Graham Number & Graham Growth Value.
      - PEG Ratio & Earnings Yield.
      - Piotroski F-Score.
      - **EV / EBITDA Ratio** (Enterprise Value / EBITDA).
      - Debt/Equity & Interest Coverage.

      Buffett & Munger Special Metrics:
      - Economic Moat: Rate as Wide/Narrow/None.
      - Owner Earnings: Estimate "Owner Earnings" (Net Income + D&A - Maintenance CapEx).
      - Buffett "Ten Cap" Price: The price where Owner Earnings would represent a 10% yield.
      - ROIC vs WACC.
      - Buyback Yield.

      Management & Governance:
      - Identify key executives, Board Members, and Independent Directors.
      - **Stakeholders**: Shareholding pattern (Promoters, FII, DII, Public) with **DETAILED BREAKDOWN** of major funds/whales.
      - Provide a governance review.

      DCF Analysis:
      - Determine Discount Rate (WACC) and Terminal Growth Rate.
      - Calculate Intrinsic Value (2 stage DCF).
      - Calculate Reverse DCF (Implied growth).
      - Create Bull, Bear, and Base scenarios.
      
      Ensure all numerical values are numbers. Percentages should be whole numbers or single decimal.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const data = JSON.parse(text) as StockAnalysis;
    return {
      ...data,
      lastUpdated: new Date().toLocaleDateString()
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
