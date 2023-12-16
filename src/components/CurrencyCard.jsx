export default function CurrencyCard({ currencyName, price, deleteCard }) {
  return (
    <>
      <h4>{currencyName}</h4>
      <p>{price}</p>
      <button onClick={() => deleteCard(currencyName)}>Delete</button>
    </>
  );
}
