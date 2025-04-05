import dotenv from 'dotenv';
import { createClient } from 'redis';
import { config } from './config/config.js';
import { buyHandler } from './handler/buy_handler.js';
import { getSearchDataHandler } from './handler/getSearch_handler.js';
import { sellHandler } from './handler/sell_handler.js';
import { getDataHandler } from './handler/get_handler.js';
import { initMarketSesion } from './util/market/getAllData.js';

dotenv.config();

const client = createClient({
  url: config.redis.name + config.redis.host + config.redis.port, // 로컬 Redis 서버 연결
});

//에러 처리용도
client.on('error', (err) => console.log('Redis Error:', err));

await client.connect();
console.log(`레디스 연결 : ${config.redis.host + config.redis.port}`);

// 초기화 한번
await client.flushDb();
initMarketSesion();

// 대기 처리
async function listenForMessages() {
  await Promise.all([
    (async () => {
      while (true) {
        const res = await client.blPop('Sell', 0);
        const message = JSON.parse(res.element);
        sellHandler(message);
      }
    })(),
    (async () => {
      while (true) {
        const res = await client.blPop('Buy', 0);
        const message = JSON.parse(res.element);
        buyHandler(message);
      }
    })(),
    (async () => {
      while (true) {
        const res = await client.blPop('Get', 0);
        const message = JSON.parse(res.element);
        getDataHandler(message, client);
      }
    })(),
    (async () => {
      while (true) {
        //검색 기능 따로 한 이유 : 검색을 이용하는 사람보다 그냥 이용하는 사람이 많을거 같아서.
        const res = await client.blPop('GetSearch', 0);
        const message = JSON.parse(res.element);
        getSearchDataHandler(message, client);
      }
    })(),
  ]);
}

//아래는 그 레디스 연결 이용해서 하는 용도 입니다.

/**레디스 데이터 보내기 용도!*/
async function sendData(targetServerId, data) {
  if (!targetServerId) {
    console.log('서버가 없습니다.');
    return;
  }
  // 자기 자신 서버 리스폰 구독하면 받을수 있음
  message.senderId = serverId;
  await client.rPush(`Response:${targetServerId}`, JSON.stringify(data));
}
export default sendData;

/**레디스 데이터 지우기 용도!*/
export const dataDelet = async (id, name) => {
  await client.hDel(id);
  await client.lRem('marketList', 1, id);
  await client.sRem('index:name:' + name, id);
};
/**레디스 해당 id 데이터 가져오기 */
export const getdata = async (id) => {
  return await client.hGetAll(id);
};
/**레디스 현재 저장 데이터 길이찾기*/
export const getSize = async () => {
  return await client.lLen('marketList');
};
/**레디스 데이터 넣기 용도!*/
export const setData = async (data) => {
  await client.hSet(
    data.id,
    'charId',
    data.charId,
    'name',
    data.name,
    'itemIndex',
    data.itemIndex,
    'rarity',
    data.rarity,
    'price',
    data.price,
    'endTime',
    data.endTime,
  );
  //인덱스 추가
  await client.sAdd('index:name:' + data.name, data.id);
  await client.rPush('marketList', data.id);
};

listenForMessages().catch(console.error);
