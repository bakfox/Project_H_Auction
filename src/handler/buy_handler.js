import { sellInMarket } from '../db/marketplace/market.db.js';
import { dataDelet, getdata, sendData } from '../server.js';

export const buyHandler = async (data) => {
  try {
    const marketData = getdata(data.marketId);
    if (!marketData) {
      throw new Error('더이상 존재하지 않는 물품입니다.');
    }
    if (data.gold < marketData.price) {
      throw new Error('골드가 부족합니다.');
    }
    const requestServerId = data.senderId;

    const itemData = await sellInMarket({
      BuyCharId: data.charId,
      SellCharId: marketData.charId,
      itemId: marketData.itemIndex,
      rarity: marketData.rarity,
      marketId: data.marketId,
      gold: marketData.price,
    });
    dataDelet(data.marketId, marketData.name);
    sendData(requestServerId, {
      insertId: itemData[0].insertId,
      id: marketData.itemIndex,
      rarity: marketData.rarity,
    });
  } catch (err) {
    console.error(err);
  }
};
