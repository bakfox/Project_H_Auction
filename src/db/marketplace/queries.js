export const SQL_QUERIES = {
  ADD_MARKET_DATA: 'INSERT INTO Market (charId,itemIndex,upgrade,price,endTime) VALUES (?,?,?,?,?)',
  REMOVE_MARKET_DATA: 'DELETE FROM Market WHERE id = ?',
  GET_MARKET_DATAS: `
    SELECT M.id, M.charId, M.itemIndex, M.upgrade, M.price, M.endTime, T.name
    FROM Market AS M
    JOIN Items AS T ON M.itemIndex = T.id`,
  // 인벤토리
  ADD_ITEM_TO_INVENTORY:
    'INSERT INTO Inventory (charId, itemId, rarity, equipped, quantity, position) VALUES (?, ?, ?, ?, ?, ?)',
  GET_INVENTORY_FROM_CHAR_ID: `
    SELECT I.id, I.itemId, T.itemType, T.name, T.price, T.stat, I.rarity, I.equipped, I.quantity, I.position, T.imgsrc, T.stackable
    FROM Inventory AS I
    JOIN Characters AS C ON I.charId = C.id
    JOIN Items AS T ON I.itemId = T.id
    WHERE I.charId = ?
  `,
  REMOVE_ITEM_FROM_INVENTORY: 'DELETE FROM Inventory WHERE id = ? AND charId = ?',
  // 유저
  UPDATE_ADD_GOLD: 'UPDATE Characters SET gold = gold + ? WHERE id = ?',
  UPDATE_SUBTRACT_GOLD: 'UPDATE Characters SET gold = gold - ? WHERE id = ?',
};
