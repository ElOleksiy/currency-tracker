import UserInput from "./components/UserInput";
import CurrencyCard from "./components/CurrencyCard";
import Loading from "./components/Loading.jsx";
import { useState, useEffect } from "react";
import { getCurrencyData, getAllCurencyList } from "./api.js";
import Fuse from "fuse.js";

const allCurencyList = getAllCurencyList();
allCurencyList.then((data) => console.log(data));
function App() {
  const [inputValue, setInputValue] = useState("");
  const [tickers, setTickers] = useState([]);
  const [currencyListIsLoading, setCurrencyListIsLoading] = useState(true);
  const [fuszzySearchResult, setFuzzySearchResult] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (tickers.length > 0) {
        const promises = tickers.map((ticker) => getCurrencyData(ticker.name));
        const newData = await Promise.all(promises);
        const updatedTickers = tickers.map((ticker, index) => ({
          ...ticker,
          price: newData[index].USD || "Not tradeble",
        }));
        setTickers(updatedTickers);
        localStorage.setItem("tickers", JSON.stringify(updatedTickers));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tickers]);
  useEffect(() => {
    allCurencyList.then(() => {
      setCurrencyListIsLoading(false);
    });

    const items = JSON.parse(localStorage.getItem("tickers"));
    console.log("setup");
    if (items) {
      setTickers(items);
    }
  }, []);

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
      console.log(filteredResult);
      setFuzzySearchResult(filteredResult.map((result) => result.item));
    });
  }, [inputValue]);

  function addTicker() {
    if (inputValue && !tickers.find((ticker) => ticker.name === inputValue)) {
      setTickers((prevTickers) => [
        ...prevTickers,
        {
          name: inputValue,
          price: null,
        },
      ]);
      setInputValue("");
    }
  }
  function checkIsCurrencyAdd() {
    !tickers.find((ticker) => ticker.name === inputValue);
  }
  function deleteCard(name) {
    setTickers((prevTickers) =>
      prevTickers.filter((tickers) => tickers.name !== name)
    );

    const storedTickers = JSON.parse(localStorage.getItem("tickers"));
    const updatedTickers = storedTickers.filter(
      (ticker) => ticker.name !== name
    );
    localStorage.setItem("tickers", JSON.stringify(updatedTickers));
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
          tickers={tickers}}
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
