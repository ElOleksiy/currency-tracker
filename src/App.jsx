import { useState, useEffect } from "react";
import UserInput from "./components/UserInput";
import CurrencyCard from "./components/CurrencyCard";
import { getCurrencyData } from "./api.js";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (tickers.length > 0) {
        const promises = tickers.map((ticker) => getCurrencyData(ticker.name));
        const newData = await Promise.all(promises);
        const updatedTickers = tickers.map((ticker, index) => ({
          ...ticker,
          price: newData[index].USD,
        }));
        setTickers(updatedTickers);
        localStorage.setItem("tickers", JSON.stringify(updatedTickers));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tickers]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("tickers"));
    console.log("setup");
    if (items) {
      setTickers(items);
    }
  }, []);

  function handleButton() {
    if (inputValue && !tickers.find((ticker) => ticker.name === inputValue)) {
      setTickers((prevTickers) => [
        ...prevTickers,
        {
          name: inputValue,
          price: null,
        },
      ]);
    }
    setInputValue("");
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
      <div className="container">
        <UserInput
          setInputValue={setInputValue}
          handleButton={handleButton}
          inputValue={inputValue}
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
