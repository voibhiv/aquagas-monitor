import { PrismaClient } from '@prisma/client';
import { Measure } from '@src/domain/measure/entity/measure.entity';
import { MeasureGateway } from '@src/domain/measure/gateway/measure.gateway';

export class MeasureRepositoryPrisma implements MeasureGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new MeasureRepositoryPrisma(prismaClient);
  }

  public async save(measure: Measure): Promise<void> {
    // await this.prismaClient
  }

  public async list(): Promise<Measure[]> {
    return [];
  }
}
