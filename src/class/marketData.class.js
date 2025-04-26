import { cancelMarket } from '../db/marketplace/market.db.js';
import { dataDelet, setData } from '../server.js';

class marketData {
  constructor(data) {
    this.id = data.id;
    this.charId = data.charId;
    this.name = data.name;
    this.itemIndex = data.itemIndex;
    this.rarity = data.upgrade;
    this.price = data.price;
    this.endTime = data.endTime;
    this.delay = this.endTime - new Date(); // 남은 시간 계산 (밀리초)
    console.log(this.id, ' 가 새션에 들어감!');
    setData(this);
    if (this.delay > 0) {
      setTimeout(this.endData.bind(this), this.delay);
    } else {
      this.endData();
    }
  }
  endData() {
    cancelMarket({
      makrketId: this.id,
      charId: this.charId,
      itemId: this.itemIndex,
      rarity: this.rarity,
    });
    dataDelet(this.id, this.name);
  }
}
export default marketData;
