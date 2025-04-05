import { sendData } from '../server.js';

export const getDataHandler = async (data, client) => {
  try {
    const startIndex = (data.page - 1) * data.count;
    const endIndex = startIndex + data.count;
    const keys = await client.lRange('marketList', start, end);
    const marketData = [];
    for (let key of keys) {
      let data = client.hGetAll(key);
      if (data) {
        marketData.push({
          marketId: data.id,
          itemId: data.itemIndex,
          name: data.name,
          upgrade: data.upgrade,
          endTime: data.endTime,
          price: data.price,
        });
      }
    }
    sendData(requestServerId, {
      marketData,
    });
  } catch (err) {
    console.error(err);
  }
};
