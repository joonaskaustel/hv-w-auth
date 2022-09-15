import {CheerioAPI} from "cheerio";
import {SiteEnums} from "../enums/siteEnums";
import extractFromHinnavaatlus from "./siteParsers/extractFromHinnavaatlus";
import extractFromKv from "./siteParsers/extractFromKv";

export default function extractFromSite(cheerioAPI: CheerioAPI, link: string, siteHost: SiteEnums) {
  const sites = {
    [SiteEnums.kv]: () => extractFromKv(cheerioAPI, link),
    [SiteEnums.hinnavaatlus]: () => extractFromHinnavaatlus(cheerioAPI, link),
  }
  return sites[siteHost]();
}
