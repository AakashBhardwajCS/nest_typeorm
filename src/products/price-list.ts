
const PRICE_LIST_HEADER = 'sku,price';


export function detectPriceList(bytes: Buffer): string | undefined {

  const text = new TextDecoder().decode(bytes);
  const header = text.split(/\r?\n/, 1)[0];
  
  return header === PRICE_LIST_HEADER ? 'text/csv; charset=utf-8' : undefined;
}
