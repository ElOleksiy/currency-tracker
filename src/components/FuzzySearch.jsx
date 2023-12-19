export default function FuzzySearch({
  fuzzySearchResult,
  setTickers,
  setInputValue,
  tickers,

  setCurrencyIsAlreadyAdd,
}) {
  function addTicker(ticker) {
    if (!tickers.find((item) => item.name === ticker.name)) {
      setTickers((prevTickers) => [
        ...prevTickers,
        {
          name: ticker.name,
          price: null,
        },
      ]);
      setInputValue("");
    } else {
      setCurrencyIsAlreadyAdd(true);
    }
  }

  return (
    <div className="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
      {fuzzySearchResult.map((item) => {
        return (
          <span
            onClick={() => addTicker(item)}
            key={item.name}
            className="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {item.name}
          </span>
        );
      })}
    </div>
  );
}
