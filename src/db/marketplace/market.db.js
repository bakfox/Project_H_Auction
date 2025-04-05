import pools from '../database.js';
import { SQL_QUERIES } from './queries.js';

// 인벤토리 용도 쿼리
export const getInventoryFromCharId = async (charId) => {
  try {
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.GET_INVENTORY_FROM_CHAR_ID, [charId]);
    return rows;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 모든 데이터 받고 서버에서 관리 경매 종료를 위한 관리
export const getAllMarketData = async () => {
  const [data] = await pools.USER_DB.execute(SQL_QUERIES.GET_MARKET_DATAS);
  return data || null;
};
// 아이템 거래
export const sellInMarket = async (data) => {
  const connection = await pools.USER_DB.getConnection();
  try {
    await connection.beginTransaction();

    const itemData = await connection.execute(SQL_QUERIES.ADD_ITEM_TO_INVENTORY, [
      data.BuyCharId,
      data.itemId,
      data.rarity,
      false,
      1,
      null,
    ]);
    await connection.execute(SQL_QUERIES.REMOVE_MARKET_DATA, [data.marketId]);
    await connection.execute(SQL_QUERIES.UPDATE_SUBTRACT_GOLD, [data.gold, data.BuyCharId]);
    await connection.execute(SQL_QUERIES.UPDATE_ADD_GOLD, [data.gold, data.SellCharId]);

    await connection.commit();
    return itemData;
  } catch (err) {
    console.log(err);
    await connection.rollback();
  } finally {
    connection.release();
  }
};
// 아이템 등록
export const addMarket = async (data) => {
  const connection = await pools.USER_DB.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(SQL_QUERIES.REMOVE_ITEM_FROM_INVENTORY, [
      data.inventoryId,
      data.charId,
    ]);
    const marketData = await connection.execute(SQL_QUERIES.ADD_MARKET_DATA, [
      data.charId,
      data.itemIndex,
      data.upgrade,
      data.price,
      data.endTime,
    ]);
    await connection.commit();
    return marketData;
  } catch (err) {
    console.log(err);
    await connection.rollback();
  } finally {
    connection.release();
  }
};
// 아이템 등록 취소
export const cancelMarket = async (data) => {
  console.log(data);
  const connection = await pools.USER_DB.getConnection();
  try {
    await connection.beginTransaction();
    const item = await connection.execute(SQL_QUERIES.ADD_ITEM_TO_INVENTORY, [
      data.charId,
      data.itemId,
      data.rarity,
      0,
      1,
      null,
    ]);
    await connection.execute(SQL_QUERIES.REMOVE_MARKET_DATA, [data.makrketId]);
    await connection.commit();
  } catch (err) {
    console.log(err);
    await connection.rollback();
  } finally {
    connection.release();
  }
};
