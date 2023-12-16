import { useState, useEffect } from "react";
import UserInput from "./components/UserInput";
import Container from "./components/Container";
import CurrencyCard from "./components/CurrencyCard";
import { getCurrencyData } from "./api.js";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    localStorage.setItem("tickers", JSON.stringify(tickers));
  }, [tickers]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("tickers"));
    console.log("setup");
    if (items) {
      setTickers(items);
    }
  }, []);

  function handleButton() {
    getCurrencyData(inputValue)
      .then((currencyData) => {
        console.log("currency", currencyData);
        setTickers((prevTickers) => [
          ...prevTickers,
          {
            name: inputValue,
            price: currencyData.USD,
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    setInputValue("");
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
            />
          );
        })}
      </Container>
    </>
  );
}

export default App;
