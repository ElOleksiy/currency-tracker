const API_KEY =
  "9a2e01e570c0b693006d832c67ecc7a80ffbb3ed27cfd73218a1c37395c2584c";

const tickers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);

    return;
  }

  socket.addEventListener(
    "close",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWebSocket(ticker) {
  sendToWebSocket({ action: "SubAdd", subs: [`5~CCCAGG~${ticker}~USD`] });
}

function unsubscribeToTickerOnWebSocket(ticker) {
  sendToWebSocket({ action: "SubRemove", subs: [`5~CCCAGG~${ticker}~USD`] });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickers.get(ticker) || [];
  tickers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWebSocket(ticker);
};
export const unsubscribeFromTicker = (ticker) => {
  tickers.delete(ticker);
  unsubscribeToTickerOnWebSocket(ticker);
};
export const getAllCurencyList = () =>
  fetch(`https://min-api.cryptocompare.com/data/all/coinlist`).then((res) =>
    res.json()
  );
