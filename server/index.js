import dotenv from 'dotenv';
import Koa from 'koa';

dotenv.config();

const app = new Koa();

app.use(function index(ctx) {
  console.log('Hello Friends 👋');
  ctx.body = 'Hello Friends 👋';
});

export default app;
