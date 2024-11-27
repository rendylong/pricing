import puppeteer from 'puppeteer';

interface ScrapingResult {
  modelInfo: string;
  pricing: string;
  timestamp: string;
  source: string;
}

const scrapingConfigs = [
  {
    name: 'OpenAI',
    url: 'https://openai.com/pricing',
    waitForSelector: '.pricing-module',
    waitTime: 5000
  },
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/pricing#anthropic-api',
    waitForSelector: 'body',
    waitTime: 3000
  }
];

export class LLMPriceScraper {
  async scrapeAll(): Promise<ScrapingResult[]> {
    console.log('Starting price scraping...');
    const results: ScrapingResult[] = [];
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
      timeout: 60000
    });

    try {
      for (const config of scrapingConfigs) {
        try {
          console.log(`Starting to scrape ${config.name} from ${config.url}...`);
          const page = await browser.newPage();
          
          await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
          
          await page.setViewport({ width: 1920, height: 1080 });
          
          await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
          });

          await page.setRequestInterception(true);
          page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (['document', 'script', 'xhr', 'fetch'].includes(resourceType)) {
              request.continue();
            } else {
              request.abort();
            }
          });

          console.log(`Navigating to ${config.url}...`);
          await page.goto(config.url, { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
          });
          
          console.log(`Waiting for selector: ${config.waitForSelector}`);
          await page.waitForSelector(config.waitForSelector, { timeout: 10000 })
            .catch(e => console.log(`Selector wait failed: ${e.message}`));
          
          await page.waitForTimeout(config.waitTime);
          
          console.log(`Extracting content for ${config.name}...`);
          const pageContent = await page.evaluate(() => {
            const elementsToRemove = [
              'script',
              'style',
              'footer',
              'header',
              'nav',
              '[role="navigation"]',
              '.cookie-banner',
              '#cookie-banner',
              '.newsletter-signup',
              '.social-links'
            ];
            
            elementsToRemove.forEach(selector => {
              document.querySelectorAll(selector).forEach(el => el.remove());
            });
            
            const mainContent = document.body.innerText;
            return mainContent;
          });

          console.log(`Content extracted for ${config.name}, length: ${pageContent.length}`);
          
          await page.screenshot({ 
            path: `debug-${config.name.toLowerCase()}.png`,
            fullPage: true 
          });

          const result: ScrapingResult = {
            modelInfo: `${config.name} Raw Content`,
            pricing: pageContent,
            timestamp: new Date().toISOString(),
            source: config.url
          };

          console.log(`Successfully scraped ${config.name}`);
          results.push(result);
          await page.close();
        } catch (error) {
          console.error(`Error scraping ${config.name}:`, error);
          results.push({
            modelInfo: `${config.name} Error`,
            pricing: `Error fetching content: ${error.message}`,
            timestamp: new Date().toISOString(),
            source: config.url
          });
        }
      }
    } finally {
      await browser.close();
    }

    console.log('Scraping completed with', results.length, 'results');
    return results;
  }
} 