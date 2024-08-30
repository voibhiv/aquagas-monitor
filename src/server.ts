import './utils/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import * as http from 'http';
import cors from 'cors';
import { MainController } from './infra/controllers/main.controller';
import express from 'express';
import { CreateRegisterUseCase } from './usecases/system/create-register/create-register.usecase';
import { MainRepositoryPrisma } from './infra/repositories/main.repository.prisma';
import { prisma } from './package/prisma/prisma';
import {
  GenerativeModel,
  GoogleGenerativeAI,
  ModelParams,
} from '@google/generative-ai';
import { GenerateImagePromptUseCase } from './usecases/gemini/generate-prompt-by-image/generate-prompt-by-image.usecase';
import path from 'path';
import { FetchRegisterUseCase } from './usecases/system/fetch-register/fetch-register.usecase';
import { ReadRegistersUseCase } from './usecases/system/read-registers/read-registers.usecase';

export class SetupServer extends Server {
  private server?: http.Server;
  private geminiModel!: GenerativeModel;

  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupGeminiGoogle();
    this.setupStaticFiles();
    this.setupControllers();
  }

  private setupControllers(): void {
    const repository = MainRepositoryPrisma.create(prisma);
    const useCaseCreateRegister = CreateRegisterUseCase.create(repository);
    const useCaseFetchRegister = FetchRegisterUseCase.create(repository);
    const useCaseReadRegister = ReadRegistersUseCase.create(repository);
    const useCaseGenerateImage = GenerateImagePromptUseCase.create(
      this.geminiModel,
    );

    const mainController = new MainController(
      useCaseCreateRegister,
      useCaseFetchRegister,
      useCaseReadRegister,
      useCaseGenerateImage,
    );
    this.addControllers([mainController]);
  }

  private setupExpress(): void {
    this.app.use(
      bodyParser.json({
        limit: '50mb',
      }),
    );
    this.app.use(
      cors({
        origin: '*',
      }),
    );
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
  }

  private setupGeminiGoogle(): void {
    const modelParams: ModelParams = {
      model: 'gemini-1.5-flash',
    };
    const geminiApp = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
    const geminiModel = geminiApp.getGenerativeModel(modelParams);
    this.geminiModel = geminiModel;
  }

  private setupStaticFiles(): void {
    const imagesPath = path.join(__dirname, '../src/images');
    this.app.use('/images', express.static(imagesPath));
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
