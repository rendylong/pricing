import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pricesRouter from './routes/prices.js';

const app = express();
const port = process.env.PORT || 3001;

// 启用 CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/', pricesRouter);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

export default app; 