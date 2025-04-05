import { sendData } from '../server.js';

export const sellHandler = async (data) => {
  try {
    const [itemData] = getInventoryFromCharId(data.charId, data.inventoryId);
    if (!itemData) {
      throw new Error('인벤토리에 데이터가 없습니다.');
    }
    const requestServerId = data.senderId;

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
    sendData(requestServerId, { charId: data.charId, inventoryId: data.inventoryId });
  } catch (err) {
    console.error(err);
  }
};
