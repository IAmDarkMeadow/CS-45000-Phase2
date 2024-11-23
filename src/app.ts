// app.ts
import express from 'express';
import uploadRouter from './routes/upload';
import downloadRouter from './routes/download';

const app = express();

app.use(express.json());
app.use('/', uploadRouter);
app.use('/', downloadRouter);

export default app;
