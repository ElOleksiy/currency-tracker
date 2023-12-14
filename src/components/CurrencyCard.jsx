export default function CurrencyCard({ currencyName, price }) {
  return (
    <>
      <h4>{currencyName}</h4>
      <p>{price}</p>
      <button>Delete</button>
    </>
  );
}
