export default function UserInput({ inputValue, setInputValue, handleButton }) {
  return (
    <section className="user-input">
      <label>Enter currency name: </label>
      <input
        required
        name="input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
      />
      <button onClick={handleButton}>Add currency</button>
    </section>
  );
}
