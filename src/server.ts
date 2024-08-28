import './utils/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { MainController } from './controllers/main.controller';
import { Application } from 'express';
import * as http from 'http';
import cors from 'cors';

export class SetupServer extends Server {
  private server?: http.Server;

  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
    console.log('oi');
  }

  private setupControllers(): void {
    const mainController = new MainController();
    this.addControllers([mainController]);
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: '*',
      }),
    );
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log('Server listening on port: ' + this.port);
    });
  }
}
