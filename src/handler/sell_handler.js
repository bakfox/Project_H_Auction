import MarketData from '../class/MarketData.class.js';
import { config } from '../config/config.js';
import { getInventoryFromCharId } from '../db/marketplace/market.db.js';
import { sendData } from '../server.js';

export const sellHandler = async (data) => {
  let isSuccess = true;
  const requestServerId = data.senderId;
  try {
    const [itemData] = await getInventoryFromCharId(data.charId, data.inventoryId);
    if (!itemData) {
      isSuccess = false;
      throw new Error('인벤토리에 데이터가 없습니다.');
    }

    const now = new Date(Date.now() + 60 * 60 * 1000);
    const [makretDatas] = await addMarket({
      charId: data.charId,
      inventoryId: data.inventoryId,
      itemIndex: itemData.itemId,
      upgrade: itemData.rarity,
      price: data.gold,
      endTime: now,
    });
    if (!makretDatas) {
      isSuccess = false;
      throw new Error('거래 실패입니다!');
    }
    const temp = new MarketData({
      id: makretDatas.insertId,
      charId: data.charId,
      itemIndex: itemData.itemId,
      upgrade: itemData.rarity,
      price: data.gold,
      endTime: now,
      name: data.name,
    });
    console.log(temp,"새로운 / 기존 ",makretDatas);
    sendData(config.type.sell, requestServerId, {
      charId: data.charId,
      inventoryId: data.inventoryId,
      isSuccess,
    });
  } catch (err) {
    sendData(config.type.sell,requestServerId, {
      isSuccess,
    });
  }
};
