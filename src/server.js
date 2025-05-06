import dotenv from 'dotenv';
import { createClient } from 'redis';
import { config } from './config/config.js';
import { buyHandler } from './handler/buy_handler.js';
import { getSearchDataHandler } from './handler/getSearch_handler.js';
import { sellHandler } from './handler/sell_handler.js';
import { getDataHandler } from './handler/get_handler.js';
import { initMarketSesion } from './util/market/getAllData.js';
import { v1 } from 'uuid';

dotenv.config();

const client = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`, // 로컬 Redis 서버 연결
});

//에러 처리용도
client.on('error', (err) => console.log('Redis Error:', err));

await client.connect();
console.log(`레디스 연결 : ${config.redis.host + config.redis.port}`);
listenForMessages(client).catch(console.error); // 연결되었을 때 대기 시작

// 초기화 한번
await client.flushDb();
initMarketSesion();

await client.rPush('BUY', "hello");

// 대기 처리
async function listenForMessages(redisClient) {
  await Promise.all([
    (async () => {
      while (true) {
        try {
          console.log("대기중 sell");
          const res = await redisClient.blPop('SELL', 0);
          if (!res || res.length < 2) {
            console.warn("SELL 응답 형식이 이상함:", res);
            continue;
          }
          const message = JSON.parse(res[1]);
          
          await sellHandler(message);
        } catch (err) {
          console.error("SELL 처리 중 오류:", err);
        }
      }
    })(),
    (async () => {
      while (true) {
        try {
          console.log("대기중 buy");
          const res = await redisClient.blPop('BUY', 0);
          if (!res || res.length < 2) {
            console.warn("SELL 응답 형식이 이상함:", res);
            continue;
          }
          const message = JSON.parse(res[1]);
          
          console.log("받은 BUY 메시지:", message);
          await buyHandler(message);
        } catch (err) {
          console.error("BUY 처리 중 오류:", err);
        }
      }
    })(),
  ]);
}

//아래는 그 레디스 연결 이용해서 하는 용도 입니다.

/**레디스 데이터 보내기 용도!*/
export async function sendData(type,targetServerId, data ) {
  if (!targetServerId) {
    console.log('서버가 없습니다.');
    return;
  }
  // 자기 자신 서버 리스폰 구독하면 받을수 있음
  await client.rPush(type + `:RES:${targetServerId}`, JSON.stringify(data));
}

/**레디스 데이터 지우기 용도!*/
export const dataDelet = async (id, name) => {
  const key = String(id);

  const exists = await client.exists(key);
  if (!exists) {
    console.warn("현재 데이터 없음");
    return;
  }
  
  await client.del(key);
  await client.lRem('marketList', 1, id);
  await client.sRem('index:name:' + name, id);
};
/**레디스 해당 id 데이터 가져오기 */
export const getdata = async (id) => {
  return await client.hGetAll(id);
};
/**레디스 데이터 넣기 용도!*/
export const setData = async (data) => {
  console.log(data);
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
    data.endTime.toISOString(),
  );
  //인덱스 추가
  await client.sAdd('index:name:' + data.name, data.id);
  await client.rPush('marketList', data.id);
};