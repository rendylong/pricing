import express from 'express';
import { LLMPriceScraper } from '../scraper.js';

const router = express.Router();
const scraper = new LLMPriceScraper();

router.get('/api/prices', async (req, res) => {
  try {
    console.log('Fetching prices...');
    const prices = await scraper.scrapeAll();
    console.log('Prices fetched:', prices);
    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch pricing data' });
  }
});

export default router; 