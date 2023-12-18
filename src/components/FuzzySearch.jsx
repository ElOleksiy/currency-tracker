export default function FuzzySearch({ fuzzySearchResult }) {
  return (
    <div className="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
      {fuzzySearchResult.map((item) => {
        return (
          <span
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
