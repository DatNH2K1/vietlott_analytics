import * as cheerio from "cheerio";

export interface ORenderInfo {
  SiteId: string;
  SiteAlias: string;
  UserSessionId: string;
  SiteLang: string;
  IsPageDesign: boolean;
  ExtraParam1: string;
  ExtraParam2: string;
  ExtraParam3: string;
  SiteURL: string;
  WebPage: string | null;
  SiteName: string;
  OrgPageAlias: string | null;
  PageAlias: string | null;
  RefKey: string | null;
  FullPageAlias: string | null;
}

export const orenderInfoDefault: ORenderInfo = {
  SiteId: "main.frontend.vi",
  SiteAlias: "main.vi",
  UserSessionId: "",
  SiteLang: "vi",
  IsPageDesign: false,
  ExtraParam1: "",
  ExtraParam2: "",
  ExtraParam3: "",
  SiteURL: "",
  WebPage: null,
  SiteName: "Vietlott",
  OrgPageAlias: null,
  PageAlias: null,
  RefKey: null,
  FullPageAlias: null,
};

export interface ProductConfig {
  name: string;
  url: string;
  gameId?: string;
  key?: string;
  dataFile: string;
  startPageIndex: number;
  getBody: (pageIndex: number) => Record<string, unknown>;
  parseHTML: (html: string) => Record<string, unknown>[];
}

export const productConfigs: ProductConfig[] = [
  {
    name: "keno",
    url: "https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.GameKenoCompareWebPart,Vietlott.PlugIn.WebParts.ashx",
    gameId: "6",
    dataFile: "data/keno.jsonl",
    startPageIndex: 1,
    getBody: (pageIndex) => ({
      DrawDate: "",
      GameDrawNo: "",
      GameId: "6",
      ORenderInfo: orenderInfoDefault,
      PageIndex: pageIndex,
      number: "",
    }),
    parseHTML: (html: string) => {
      const $ = cheerio.load(html);
      const rows: Record<string, unknown>[] = [];
      $("table tr").each((i: number, el) => {
        if (i === 0) return;
        const tds = $(el).find("td");
        if (tds.length < 2) return;
        const dateIdLinks = $(tds[0]).find("a");
        const dateRaw = $(dateIdLinks[0]).text().trim();
        const dateParts = dateRaw.split("/");
        if (dateParts.length < 3) return;
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const id = $(dateIdLinks[1]).text().trim();
        const result = $(tds[1])
          .find("span")
          .map((_: number, span) => parseInt($(span).text().trim()))
          .get();
        const bigSmall = $(tds[2]).text().trim();
        const oddEven = $(tds[3]).text().trim();
        rows.push({ date, id, result, big_small: bigSmall, odd_even: oddEven });
      });
      return rows;
    },
  },
  {
    name: "bingo18",
    url: "https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.GameBingoCompareWebPart,Vietlott.PlugIn.WebParts.ashx",
    gameId: "8",
    dataFile: "data/bingo18.jsonl",
    startPageIndex: 1,
    getBody: (pageIndex) => ({
      ORenderInfo: orenderInfoDefault,
      GameId: "8",
      GameDrawNo: "",
      number: "",
      DrawDate: "",
      PageIndex: pageIndex,
    }),
    parseHTML: (html: string) => {
      const $ = cheerio.load(html);
      const rows: Record<string, unknown>[] = [];
      const processTime = new Date().toISOString();
      $("table tr").each((i: number, el) => {
        if (i === 0) return;
        const tds = $(el).find("td");
        if (tds.length < 4) return;
        const dateIdLinks = $(tds[0]).find("a");
        const dateRaw = $(dateIdLinks[0]).text().trim();
        const dateParts = dateRaw.split("/");
        if (dateParts.length < 3) return;
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const id = $(dateIdLinks[1]).text().trim().replace("#", "");
        const result = $(tds[1])
          .find("span")
          .map((_: number, span) => parseInt($(span).text().trim()))
          .get();
        const total = parseInt($(tds[2]).text().trim());
        const largeSmall = $(tds[3]).text().trim();
        rows.push({ date, id, result, total, large_small: largeSmall, process_time: processTime });
      });
      return rows;
    },
  },
  {
    name: "power645",
    url: "https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.Game645CompareWebPart,Vietlott.PlugIn.WebParts.ashx",
    key: "8290fce2",
    dataFile: "data/power645.jsonl",
    startPageIndex: 0,
    getBody: (pageIndex) => ({
      ORenderInfo: orenderInfoDefault,
      Key: "8290fce2",
      GameDrawId: "",
      ArrayNumbers: Array(6).fill(Array(18).fill("")),
      CheckMulti: false,
      PageIndex: pageIndex,
    }),
    parseHTML: (html: string) => {
      const $ = cheerio.load(html);
      const rows: Record<string, unknown>[] = [];
      const processTime = new Date().toISOString();
      $("table tr").each((i: number, el) => {
        if (i === 0) return;
        const tds = $(el).find("td");
        if (tds.length < 3) return;
        const dateRaw = $(tds[0]).text().trim();
        const dateParts = dateRaw.split("/");
        if (dateParts.length < 3) return;
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const id = $(tds[1]).text().trim();
        const result = $(tds[2])
          .find("span")
          .map((_: number, span) => {
            const val = $(span).text().trim();
            return val === "|" ? null : parseInt(val);
          })
          .get()
          .filter((v) => v !== null);
        rows.push({ date, id, result, process_time: processTime });
      });
      return rows;
    },
  },
  {
    name: "power655",
    url: "https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.Game655CompareWebPart,Vietlott.PlugIn.WebParts.ashx",
    key: "23bbd667",
    dataFile: "data/power655.jsonl",
    startPageIndex: 0,
    getBody: (pageIndex) => ({
      ORenderInfo: orenderInfoDefault,
      Key: "23bbd667",
      GameDrawId: "",
      ArrayNumbers: Array(5).fill(Array(18).fill("")),
      CheckMulti: false,
      PageIndex: pageIndex,
    }),
    parseHTML: (html: string) => {
      const $ = cheerio.load(html);
      const rows: Record<string, unknown>[] = [];
      const processTime = new Date().toISOString();
      $("table tr").each((i: number, el) => {
        if (i === 0) return;
        const tds = $(el).find("td");
        if (tds.length < 3) return;
        const dateRaw = $(tds[0]).text().trim();
        const dateParts = dateRaw.split("/");
        if (dateParts.length < 3) return;
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const id = $(tds[1]).text().trim();
        const result = $(tds[2])
          .find("span")
          .map((_: number, span) => {
            const val = $(span).text().trim();
            return val === "|" ? null : parseInt(val);
          })
          .get()
          .filter((v) => v !== null);
        rows.push({ date, id, result, process_time: processTime });
      });
      return rows;
    },
  },
  {
    name: "power535",
    url: "https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.Game535CompareWebPart,Vietlott.PlugIn.WebParts.ashx",
    key: "d0ea794f",
    dataFile: "data/power535.jsonl",
    startPageIndex: 0,
    getBody: (pageIndex) => ({
      ORenderInfo: orenderInfoDefault,
      Key: "d0ea794f",
      GameDrawId: "",
      ArrayNumbers: Array(5).fill(Array(35).fill("")),
      CheckMulti: false,
      PageIndex: pageIndex,
    }),
    parseHTML: (html: string) => {
      const $ = cheerio.load(html);
      const rows: Record<string, unknown>[] = [];
      const processTime = new Date().toISOString();
      $("table tr").each((i: number, el) => {
        if (i === 0) return;
        const tds = $(el).find("td");
        if (tds.length < 3) return;
        const dateRaw = $(tds[0]).text().trim();
        const dateParts = dateRaw.split("/");
        if (dateParts.length < 3) return;
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const id = $(tds[1]).text().trim();
        const result = $(tds[2])
          .find("span")
          .map((_: number, span) => parseInt($(span).text().trim()))
          .get();
        rows.push({ date, id, result, process_time: processTime });
      });
      return rows;
    },
  },
];
