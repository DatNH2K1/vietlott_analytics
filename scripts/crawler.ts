import axios from "axios";
import * as fs from "fs";
import { productConfigs } from "./product-configs";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "Content-Type": "text/plain; charset=utf-8",
  "X-AjaxPro-Method": "ServerSideDrawResult",
  "X-Requested-With": "XMLHttpRequest",
  Origin: "https://vietlott.vn",
  Connection: "keep-alive",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
};

const MAX_PAGES = 300; // Safety limit for backfilling

async function fetchPage(url: string, body: Record<string, unknown>) {
  try {
    const response = await axios.post(url, JSON.stringify(body), {
      headers: HEADERS,
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

interface LotteryRecord {
  date: string;
  id: string;
  [key: string]: unknown;
}

function readJSONL(filePath: string): LotteryRecord[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8");
  return content
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line));
}

function writeJSONL(filePath: string, data: LotteryRecord[]) {
  const content = data.map((row) => JSON.stringify(row)).join("\n") + "\n";
  fs.writeFileSync(filePath, content, "utf-8");
}

async function runCrawler() {
  console.log("Starting crawler (with gap-bridging support)...");

  for (const config of productConfigs) {
    console.log(`Processing product: ${config.name}...`);
    
    // Read existing data to identify already crawled records
    const existingData = readJSONL(config.dataFile);
    const existingIds = new Set(existingData.map((row) => row.id));
    
    const allNewData: LotteryRecord[] = [];
    let currentPage = config.startPageIndex;
    let pagesFetched = 0;

    while (pagesFetched < MAX_PAGES) {
      console.log(`  Fetching page ${currentPage} for ${config.name}...`);
      const response = await fetchPage(config.url, config.getBody(currentPage));
      
      if (!response || !response.value) {
        console.warn(`  No response for ${config.name} at page ${currentPage}`);
        break;
      }

      const html = response.value.HtmlContent || response.value;
      if (typeof html !== "string") {
        console.warn(`  Unexpected HTML format for ${config.name} at page ${currentPage}`);
        break;
      }

      const crawledPageData = config.parseHTML(html) as LotteryRecord[];
      
      if (["3d", "3d_pro"].includes(config.name)) {
        console.log(`  [DEBUG] ${config.name} page ${currentPage} results count: ${crawledPageData.length}`);
        if (crawledPageData.length > 0) {
          console.log(`  [DEBUG] Dates on page: ${crawledPageData.map(r => r.date).join(", ")}`);
        }
      }

      if (crawledPageData.length === 0) {
        console.log(`  Page ${currentPage} is empty. Stopping.`);
        break;
      }

      const newInThisPage = crawledPageData.filter((row) => !existingIds.has(row.id));
      
      if (newInThisPage.length > 0) {
        console.log(`  Found ${newInThisPage.length} new records on page ${currentPage}`);
        allNewData.push(...newInThisPage);
        
        // Add new IDs to the set to avoid duplicates within the same run
        newInThisPage.forEach(row => existingIds.add(row.id));
      } else {
        console.log(`  No new records on page ${currentPage}. Stopping.`);
        break;
      }

      currentPage++;
      pagesFetched++;
    }

    if (allNewData.length > 0) {
      console.log(`  Total new records for ${config.name}: ${allNewData.length}`);
      
      // Merge and sort
      const mergedData = [...existingData, ...allNewData];
      mergedData.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.id.localeCompare(b.id);
      });

      writeJSONL(config.dataFile, mergedData);
      console.log(`  Updated ${config.dataFile}`);
    } else {
      console.log(`  No update needed for ${config.name}`);
    }
  }

  console.log("Crawler finished.");
}

runCrawler().catch((err) => {
  console.error("Crawler failed:", err);
  process.exit(1);
});
