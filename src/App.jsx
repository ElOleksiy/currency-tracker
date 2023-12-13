import { useState } from "react";
import UserInput from "./components/UserInput";
import Container from "./components/Container";

function App() {
  const API_KEY =
    "9a2e01e570c0b693006d832c67ecc7a80ffbb3ed27cfd73218a1c37395c2584c";

  const [inputValue, setInputValue] = useState("");
  const [tickers, setTickers] = useState([]);

  function handleButton() {
    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${inputValue}&tsyms=USD&${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data["Response"]) {
          tickers.push({
            name: inputValue,
            price: data["USD"],
          });
        }
      });

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
      </Container>
    </>
  );
}

export default App;
