import { useState } from "react";
import UserInput from "./components/UserInput";
import Container from "./components/Container";
import CurrencyCard from "./components/CurrencyCard";
import { getCurrencyData } from "./api.js";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tickers, setTickers] = useState([]);

  function handleButton() {
    setInterval(async () => {
      const currencyData = await getCurrencyData(inputValue);
      console.log(currencyData);
      setTickers((prevTickers) => [
        ...prevTickers,
        {
          name: inputValue,
          price: currencyData.USD,
        },
      ]);
      const updatedTickers = tickers.map((ticker) => {
        return { ...ticker, price: currencyData.USD };
      });
      console.log(updatedTickers);
      setTickers(updatedTickers);
    }, 5000);

    console.log(tickers);
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
