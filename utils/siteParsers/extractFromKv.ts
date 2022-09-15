import {CheerioAPI} from "cheerio";

export default function extractFromKv(cheerioApi: CheerioAPI, link: string) {
  const price = cheerioApi('.inner > h1')
  console.log('kv price ', price)
  const name = new URL(link).pathname
    .split('/')
    .filter(Boolean)[1];
  console.log('kv name ', name)
  return {price: 1, name};
}
