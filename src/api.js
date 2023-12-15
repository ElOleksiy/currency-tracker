const API_KEY =
  "9a2e01e570c0b693006d832c67ecc7a80ffbb3ed27cfd73218a1c37395c2584c";

export const getCurrencyData = (inputValue) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${inputValue}&tsyms=USD&${API_KEY}`
  ).then((res) => res.json());
