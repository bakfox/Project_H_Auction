import { config } from '../config/config.js';
import { sendData } from '../server.js';

export const sellHandler = async (data) => {
  let isSuccess = true;
  const requestServerId = data.senderId;
  try {
    const [itemData] = getInventoryFromCharId(data.charId, data.inventoryId);
    if (!itemData) {
      isSuccess = false;
      throw new Error('인벤토리에 데이터가 없습니다.');
    }

    const now = new Date(Date.now() + 60 * 60 * 1000);
    const [marketData] = await addMarket({
      charId: data.charId,
      inventoryId: data.inventoryId,
      itemIndex: itemData.itemId,
      upgrade: itemData.rarity,
      price: data.gold,
      endTime: now,
    });
    if (!marketData) {
      isSuccess = false;
      throw new Error('거래 실패입니다!');
    }
    new marketData({
      id: marketData.insertId,
      charId: data.charId,
      itemIndex: itemData.itemId,
      upgrade: itemData.rarity,
      price: data.gold,
      endTime: now,
      name: data.name,
    });
    sendData(config.type.sell, requestServerId, {
      charId: data.charId,
      inventoryId: data.inventoryId,
      isSuccess,
    });
  } catch (err) {
    sendData(requestServerId, {
      isSuccess,
    });
  }
};
