import { useState, useEffect } from "react";
import UserInput from "./components/UserInput";
import Container from "./components/Container";
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
      getCurrencyData(inputValue)
        .then((currencyData) => {
          console.log("currency", currencyData);
          setTickers((prevTickers) => [
            ...prevTickers,
            {
              name: inputValue,
              price: currencyData.USD + "$",
            },
          ]);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
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

  return (
    <>
      <Container>
        <UserInput
          handleButton={handleButton}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
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
      </Container>
    </>
  );
}

export default App;
