const baht = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 2 });

export function formatPrice(price: number | null) {
  return price === null ? "สอบถามราคา" : `${baht.format(price)} บาท`;
}

export function formatStartingPrice(price: number | null) {
  return price === null ? formatPrice(null) : `เริ่มต้น ${formatPrice(price)}`;
}
