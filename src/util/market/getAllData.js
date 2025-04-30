import MarketData from '../../class/MarketData.class.js';
import { getAllMarketData } from '../../db/marketplace/market.db.js';

export async function initMarketSesion() {
  const marketAllData = await getAllMarketData();
  for (let data of marketAllData) {
    new MarketData(data);
  }
}
