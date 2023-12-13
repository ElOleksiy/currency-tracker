import { useState } from "react"
import UserInput from "./components/UserInput"
import Container from "./components/Container";

const tickers = [{
  name: 'BTC',
  value: 1
},
{
  name: 'DOGE',
  value: 3
}];

function App() {

  const API_KEY = '9a2e01e570c0b693006d832c67ecc7a80ffbb3ed27cfd73218a1c37395c2584c'

  const [inputValue, setInputValue] = useState('');

  function handleButton(){
    fetch(`https://min-api.cryptocompare.com/data/price?fsym=${inputValue}&tsyms=USD&${API_KEY}`).then((res) => res.json()).then(data => console.log(data));
    setInputValue('');
  }

  return (
    <>
      <Container>
        <UserInput handleButton={handleButton} inputValue={inputValue} setInputValue={setInputValue} />
      </Container>
    </>
  )
}

export default App
