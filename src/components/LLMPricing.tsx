import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress, 
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { useGeminiAnalyzer } from '../services/geminiAnalyzer';

interface PriceData {
  modelInfo: string;
  pricing: string;
  timestamp: string;
  source: string;
}

interface Progress {
  stage: 'scraping' | 'analyzing';
  provider: string;
  percent: number;
  message: string;
}

export const LLMPricing: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({ 
    stage: 'scraping', 
    provider: '', 
    percent: 0,
    message: 'Starting...' 
  });
  const [prompt, setPrompt] = useState<string>('');
  const { analyzePricing } = useGeminiAnalyzer();

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);
      setProgress({ stage: 'scraping', provider: 'OpenAI', percent: 0, message: 'Starting web scraping...' });
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/prices`, {
        headers: {
          'Accept': 'text/event-stream',
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setProgress({ stage: 'scraping', provider: '', percent: 100, message: 'Web scraping completed' });
      
      // 使用 Gemini 分析价格数据
      setProgress({ stage: 'analyzing', provider: '', percent: 0, message: 'Starting Gemini analysis...' });
      const { analyzedData, usedPrompt } = await analyzePricing(data, (provider, percent) => {
        setProgress({ 
          stage: 'analyzing', 
          provider, 
          percent, 
          message: `Analyzing ${provider} pricing data...` 
        });
      });
      
      setPrompt(usedPrompt);
      setPriceData(analyzedData);
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to fetch pricing data');
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => (
    <Box mb={3}>
      <Typography variant="subtitle1" gutterBottom>
        {progress.stage === 'scraping' ? 'Scraping Progress' : 'Analysis Progress'}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress.percent} 
        sx={{ mb: 1 }} 
      />
      <Typography variant="caption" color="textSecondary">
        {progress.message}
      </Typography>
    </Box>
  );

  const renderPrompt = () => (
    <Box mb={3}>
      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" gutterBottom>
          Gemini Prompt:
        </Typography>
        <Typography variant="body2" component="pre" sx={{ 
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '0.875rem'
        }}>
          {prompt}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          LLM API Pricing
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchPriceData}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Fetching...' : '🔄 Refresh Prices'}
        </Button>
      </Box>

      {loading && renderProgress()}
      {error && (
        <Box mb={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {prompt && renderPrompt()}
      
      <Grid container spacing={3}>
        {priceData.map((item, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.modelInfo}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {item.pricing}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Last updated: {new Date(item.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Source: {item.source}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 