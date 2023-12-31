import UserInput from "./components/UserInput";
import CurrencyCard from "./components/CurrencyCard";
import Loading from "./components/Loading.jsx";
import { useState, useEffect } from "react";
import {
  subscribeToTicker,
  unsubscribeFromTicker,
  getAllCurencyList,
} from "./api.js";
import Fuse from "fuse.js";
import { formatPrice } from "./utils/utils.js";

const allCurencyList = getAllCurencyList();

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tickers, setTickers] = useState([]);
  const [currencyListIsLoading, setCurrencyListIsLoading] = useState(true);
  const [fuszzySearchResult, setFuzzySearchResult] = useState([]);

  useEffect(() => {
    allCurencyList.then(() => {
      setCurrencyListIsLoading(false);
    });
    const items = JSON.parse(localStorage.getItem("tickers"));
    if (items) {
      setTickers(items);
    }
    window.addEventListener("load", () => {
      const subscribers = JSON.parse(localStorage.getItem("tickers"));
      console.log(subscribers);
      if (subscribers) {
        subscribers.forEach((item) => {
          subscribeToTicker(item.name, (newPrice) =>
            updateTicker(item.name, newPrice)
          );
        });
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("tickers", JSON.stringify(tickers));
    tickers.forEach((item) => {
      subscribeToTicker(item.name, (newPrice) =>
        updateTicker(item.name, newPrice)
      );
    });
  }, [tickers]);

  useEffect(() => {
    allCurencyList.then((data) => {
      let structuredData = [];

      for (let key in data.Data) {
        structuredData.push({
          name: key,
          isTrading: data.Data[key].IsTrading,
        });
      }

      const fuse = new Fuse(structuredData, {
        keys: ["name"],
        includeScore: true,
      });
      const result = fuse.search(inputValue);
      const filteredResult = result
        .sort((a, b) => a.score - b.score)
        .slice(1, 5);

      setFuzzySearchResult(filteredResult.map((result) => result.item));
    });
  }, [inputValue]);

  function updateTicker(tickerName, price) {
    setTickers((prevTickers) =>
      prevTickers.map((ticker) => {
        if (ticker.name === tickerName) {
          const updatedTicker = {
            ...ticker,
            price: formatPrice(price),
          };

          return updatedTicker;
        }
        return ticker;
      })
    );
  }

  function addTicker() {
    if (inputValue && !tickers.find((ticker) => ticker.name === inputValue)) {
      const currentTicker = {
        name: inputValue,
        price: "-",
      };
      setTickers((prevTickers) => [...prevTickers, currentTicker]);

      setInputValue("");
    }
  }
  function deleteCard(name) {
    setTickers((prevTickers) =>
      prevTickers.filter((tickers) => tickers.name !== name)
    );
    unsubscribeFromTicker(name);
    const storedTickers = JSON.parse(localStorage.getItem("tickers"));
    setTickers(storedTickers.filter((ticker) => ticker.name !== name));
  }

  function validTickers() {
    return Boolean(tickers.length);
  }

  return (
    <div className="container mx-auto flex flex-col items-center bg-gray-100 p-4">
      {currencyListIsLoading && <Loading />}
      <div className="container">
        <UserInput
          setInputValue={setInputValue}
          handleButton={addTicker}
          inputValue={inputValue}
          fuzzySearchResult={fuszzySearchResult}
          setTickers={setTickers}
          tickers={tickers}
        />

        {validTickers() && (
          <hr className="w-full border-t border-gray-600 my-4" />
        )}
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {tickers.map((ticker) => {
            return (
              <CurrencyCard
                key={ticker.name}
                currencyName={ticker.name}
                price={ticker.price}
                deleteCard={() => deleteCard(ticker.name)}
                ticker={ticker}
              />
            );
          })}
        </dl>
        {validTickers() && (
          <hr className="w-full border-t border-gray-600 my-4" />
        )}
      </div>
    </div>
  );
}

export default App;
