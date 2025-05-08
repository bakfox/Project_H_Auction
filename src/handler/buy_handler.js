import { config } from '../config/config.js';
import { sellInMarket } from '../db/marketplace/market.db.js';
import { dataDelet, getdata, sendData } from '../server.js';

export const buyHandler = async (data) => {
  let isSuccess = true;
  try {
    const marketData = await getdata(data.marketId);
    if (!marketData) {
      isSuccess = false;
      throw new Error('더이상 존재하지 않는 물품입니다.');
    }
    if (data.gold < marketData.price) {
      isSuccess = false;
      throw new Error('골드가 부족합니다.');
    }
    const requestServerId = data.senderId;

    const itemData = await sellInMarket({
      BuyCharId: data.charId,
      SellCharId: Number(marketData.charId),
      itemId: Number(marketData.itemIndex),
      rarity: Number(marketData.rarity),
      marketId: data.marketId,
      gold: Number(marketData.price),
    });
    await dataDelet(data.marketId, marketData.name);
    sendData(config.type.buy,requestServerId, {
      insertId: itemData[0].insertId,
      id: Number(marketData.itemIndex),
      rarity: Number(marketData.rarity),
      gold: Number(marketData.price),
      isSuccess,
    });
  } catch (err) {
    sendData(requestServerId, {
      isSuccess,
    });
  }
};
