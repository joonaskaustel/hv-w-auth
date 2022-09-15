import type {NextApiRequest, NextApiResponse} from 'next';
import * as cheerio from 'cheerio';
import {SiteEnums} from "../../../enums/siteEnums";
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

type Data = {
    name: string;
};

type Query = {
    query:  { url: string, siteHost: string };
};

type ScrapedData = {
    price: number,
    imageUrl: string,
    url: string,
    name: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { url: link, siteHost } = req.query;

    if (!(siteHost as string in SiteEnums)) throw new Error(`SiteHost is invalid ${siteHost}`);

    console.log('before browser')
    const browser = await puppeteer.launch(
      process.env.NODE_ENV === 'production'
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
      }
      : {});
    console.log({browser})
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
    await page.goto(link as string);
    const data = await page.evaluate(() => document.querySelector('.inner > h1')?.outerHTML);

    console.log(data);

    await browser.close();


    try {
        const response = await fetch(link as string);
        const htmlString = await response.text();
        // console.log('htmlString ', htmlString)
        const cheerioAPI = cheerio.load(htmlString);
        // console.log("cheerioAPI ", cheerioAPI.html())
        // const { price, name } = extractFromSite(cheerioAPI, link as string, siteHost as SiteEnums);
        // const scrapedData: ScrapedData = {
        //     price,
        //     imageUrl: 'image url todo',
        //     url: link,
        //     name,
        // };
        res.status(200).json({ name: data || 'test'});
    } catch (e) {
        res.status(400);
    }
}
