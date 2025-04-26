import marketData from '../../class/marketData.class.js';
import { getAllMarketData } from '../../db/marketplace/market.db.js';

export async function initMarketSesion() {
  const marketAllData = await getAllMarketData();
  for (let data of marketAllData) {
    new marketData(data);
  }
}
