export const formatPrice = (price) => {
  if (price === "-") {
    return price;
  }
  return price > 1 ? price.toFixed(2) : price.toPrecision(3);
};
