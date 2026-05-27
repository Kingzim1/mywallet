import axios from "axios";

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export async function getTokenPrices(symbols: string[]): Promise<Record<string, TokenPrice>> {
  try {
    const ids = symbols.map(s => {
      const mapping: Record<string, string> = {
        "ETH": "ethereum",
        "BTC": "bitcoin",
        "BNB": "binancecoin",
        "MATIC": "polygon",
        "SOL": "solana",
        "USDT": "tether",
        "USDC": "usd-coin",
        "DAI": "dai",
      };
      return mapping[s] || s.toLowerCase();
    }).join(",");

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { timeout: 5000 }
    );

    const prices: Record<string, TokenPrice> = {};
    
    for (const symbol of symbols) {
      const id = symbols.find(s => s === symbol.toLowerCase()) ? 
        symbol.toLowerCase() : 
        { ETH: "ethereum", BTC: "bitcoin", BNB: "binancecoin", MATIC: "polygon", SOL: "solana", USDT: "tether", USDC: "usd-coin", DAI: "dai" }[symbol] || symbol.toLowerCase();
      
      const data = (response.data as Record<string, { usd: number; usd_24h_change: number }>)[id];
      if (data) {
        prices[symbol] = {
          symbol,
          price: data.usd,
          change24h: data.usd_24h_change || 0,
        };
      }
    }

    return prices;
  } catch {
    return {};
  }
}