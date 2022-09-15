import {CheerioAPI} from "cheerio";

export default function extractFromHinnavaatlus(cheerioApi: CheerioAPI, link: string) {
  const allPrices = cheerioApi('.offer-price')
    .text()
    .split('€')
    .map((price) => parseFloat(price))
    .filter(Boolean);
  console.log('allprices ', allPrices)
  const price = Math.min(...allPrices);
  const name = new URL(link as string).pathname
    .split('/')
    .filter(Boolean)[1];
  return { price, name};
}
