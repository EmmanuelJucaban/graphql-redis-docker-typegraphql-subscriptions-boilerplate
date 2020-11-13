import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

export { app };
