var items = require('./items');
var loadAlltItems = items.loadAllItems();
var promotions = require('./promotions');
var loadPromotions = promotions.loadPromotions();

module.exports = function bestCharge(inputs) {
  let itemList = sumPriceForm(inputs, loadAlltItems);
  // console.log(itemList);
  let resultCharge = chooseCharge(itemList, loadPromotions);
  // console.log(resultCharge);
  let result = printString(resultCharge, itemList, loadPromotions);
  // console.log(result.trim());
  return result;
}

function sumPriceForm(inputs, loadAllItems) {
  let itemList = [];
  let result = caculateCount(inputs);
  // console.log(result);
  for (let item of loadAllItems) {
    let obj = item;
    for (let term of result) {
      if (obj.id === term.key.trim()) {
        obj.count = term.count;
        obj.sumPrice = item.price * term.count;
        itemList.push(obj);
        break;
      }
    }
  }
  // console.log(itemList);
  return itemList;
}

function caculateCount(inputs) {
  let countList = [];
  for (let item of inputs) {
    let arr = item.split('x');
    countList.push({key: arr[0], count: arr[1]});
  }
  // console.log(result);
  return countList;

}

function chooseCharge(itemList, loadPromotions) {
  let sumHalfPrice = 0;
  let sumDecPrice = 0;
  let flag = 0, ifCharge = 0;
  let resultCharge = {};
  // console.log(loadPromotions[1].items);
  for (let item of itemList) {
    for (let term of loadPromotions[1].items) {
      if (term === item.id) {
        sumHalfPrice += item.sumPrice / 2;
        // resultCharge.key.push(item.name);
        flag = 1;
        ifCharge = 1;
        break;
      } else {
        flag = 0;
      }
    }
    if (flag = 0) {
      sumHalfPrice += item.sumPrice;
    }
    sumDecPrice += item.sumPrice;
  }
  // console.log(sumDecPrice);
  if (sumDecPrice >= 30) {
    if (sumDecPrice - 6 <= sumDecPrice - sumHalfPrice) {
      resultCharge.charge = loadPromotions[0].type;
      resultCharge.save = 6;
      resultCharge.count = sumDecPrice - 6;
      return resultCharge;
    } else {
      resultCharge.charge = loadPromotions[1].type;
      resultCharge.save = sumHalfPrice;
      resultCharge.count = sumDecPrice - sumHalfPrice;
      return resultCharge;
    }
  }
  else if (sumDecPrice < 30 && ifCharge === 0) {
    resultCharge.count = sumDecPrice;
    resultCharge.charge = '';
    return resultCharge;
  }
  else
    return '';
}

function printString(resultCharge, itemList, loadPromotions) {
  let result = '============= 订餐明细 =============\n';
  for (let item of itemList) {
    result += item.name + ' x' + item.count + ' = ' + item.sumPrice + '元\n';
  }
  result += '-----------------------------------\n';
  if (resultCharge.charge === loadPromotions[0].type) {
    result += '使用优惠:\n' + resultCharge.charge + '，' + '省' + resultCharge.save + '元' + '\n';
    result += '-----------------------------------\n';
  }
  if (resultCharge.charge === loadPromotions[1].type) {
    result += '使用优惠:\n' + resultCharge.charge + '(';
    let num = 0;
    for (let item of itemList) {
      for (let term of loadPromotions[1].items) {
        if (item.id === term) {
          result += item.name;
          num++;
          if (num < loadPromotions[1].items.length)
            result += '，';
        }
      }
    }
    result += ')' + '，省' + resultCharge.save + '元' + '\n';
    result += '-----------------------------------\n';
  }
  result += '总计：' + resultCharge.count + '元\n';
  result += '===================================';
  console.log(result);
  return result.trim();
}


