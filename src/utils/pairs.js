export const CATEGORIES = {
  forex: 'Forex',
  stocks: 'Stocks',
  crypto: 'Crypto',
  indices: 'Indices',
  options: 'Options',
  metals: 'Metals'
};

export const PAIRS = {
  forex: [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
    'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
    'EUR/CHF', 'EUR/AUD', 'GBP/AUD', 'AUD/JPY', 'CHF/JPY',
    'EUR/CAD', 'GBP/CAD', 'AUD/CAD', 'NZD/JPY', 'EUR/NZD',
    'GBP/NZD', 'AUD/NZD', 'USD/SGD', 'EUR/SGD', 'GBP/SGD'
  ],
  stocks: [
    // ----- Original large-caps -----
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
    'META', 'NFLX', 'NVDA', 'BABA', 'JPM',
    'V', 'WMT', 'JNJ', 'PG', 'MA',
    'BAC', 'DIS', 'ADBE', 'PYPL', 'INTC',

    // ----- Broad NASDAQ additions (tech, biotech, consumer, etc.) -----
    'AUDC', 'PIII',                     // specifically requested
    'AMD', 'QCOM', 'AVGO', 'TXN', 'LRCX',
    'KLAC', 'AMAT', 'MU', 'MRVL', 'NXPI',
    'CRM', 'SNOW', 'DDOG', 'MDB', 'CRWD',
    'ZS', 'PANW', 'FTNT', 'OKTA', 'NET',
    'TEAM', 'PLTR', 'U', 'PATH', 'S',
    'COIN', 'DKNG', 'ABNB', 'LYFT', 'ROKU',
    'AMGN', 'GILD', 'REGN', 'VRTX', 'ILMN',
    'MRNA', 'BIIB', 'SGEN',
    'COST', 'SBUX', 'LULU', 'MAR', 'EXPE',
    'BKNG', 'CHTR', 'TCOM',
    'INTU', 'SQ', 'AFRM',
    'ISRG', 'MELI', 'ASML', 'ADP', 'CSCO',
    'CTAS', 'WDAY', 'CDNS', 'SNPS', 'ADSK',
    'ROP', 'FISV', 'KDP', 'PCAR', 'NXST',

    // ----- Ross Cameron small‑cap momentum plays -----
    'LGVN', 'KAVL', 'VLCN', 'LIXT', 'CNSP',
    'MEX', 'APHI', 'MRAM', 'ENRA', 'ATRA',
    'MLGO', 'RGS',
    'JBDI', 'BSLK', 'VRAX',
    'SPEC', 'AREB', 'NXL', 'MINM'
  ],
  crypto: [
    'BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD', 'BCH/USD',
    'ADA/USD', 'DOT/USD', 'LINK/USD', 'XLM/USD', 'BNB/USD',
    'SOL/USD', 'DOGE/USD', 'AVAX/USD', 'MATIC/USD', 'UNI/USD'
  ],
  indices: [
    'US30', 'SPX500', 'NAS100', 'UK100', 'GER40',
    'FRA40', 'JPN225', 'AUS200', 'EU50', 'HK50'
  ],
  options: [
    'EUR/USD Call 1.10', 'EUR/USD Put 1.08',
    'AAPL Call 150', 'AAPL Put 145',
    'BTC/USD Call 30000', 'BTC/USD Put 28000'
  ],
  metals: [
    'XAU/USD', 'XAG/USD', 'XPT/USD'
  ]
};