import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv-safe';
import path from 'path';

import routes from './routes';

dotenv.config();
class App {
  public express: express.Application;

  private DB_HOST: string = process.env.MONGO_HOST;
  private DB_PORT: string = process.env.MONGO_PORT;
  private DB_USER: string = process.env.MONGO_USER;
  private DB_PASS: string = process.env.MONGO_PASS;
  private DB_DATABASE: string = process.env.MONGO_DATABASE;

  public constructor() {
    this.express = express();

    this.middlewares();
    this.database();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use('/images', express.static(path.resolve(__dirname, '..', 'uploads')));
    this.express.use(routes);
  }

  private database(): void {
    mongoose.connect(`mongodb://${this.DB_USER}:${this.DB_PASS}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_DATABASE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
  }
}

export default new App().express;
