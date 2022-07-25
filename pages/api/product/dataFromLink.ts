// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url: link } = req.query;
  try {
    const response = await fetch(link as string);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const allPrices = $('.offer-price').text().split('€').map((price ) => parseFloat(price)).filter(Boolean);
    const lowestPrice = Math.min(...allPrices);
    const name = new URL(link as string).pathname.split('/').filter(Boolean)[1];
    const scrapedData = {
      lowestPrice,
      imageUrl: 'image url todo',
      url: link,
      name
    };
    res.status(200).json(scrapedData as any);
  } catch (e) {
    res.status(400);
  }
}
