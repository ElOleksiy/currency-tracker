export function isUniqueName(inputValue, arr) {
  let isUnique = true;
  for (let item in arr) {
    if (item.name === inputValue) {
      console.log(item.name);
      isUnique = false;
    }
  }
  return isUnique;
}

const tickers = [
  {
    name: "BTC",
    value: 1,
  },
  { name: "ZXC", value: 1000 - 7 },
  { name: "ZXC", value: 1000 - 7 },
];
console.log(isUniqueName("ZXC", tickers));
