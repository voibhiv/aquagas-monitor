import { PrismaClient } from '@prisma/client';
import { MainGateway } from '@src/domain/gateway/main.gateway';
import { Measure } from '@src/domain/measure/entity/measure.entity';
import { Either, left, right } from '@src/utils/errors/either';

export class MainRepositoryPrisma implements MainGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new MainRepositoryPrisma(prismaClient);
  }

  public async save(measure: Measure): Promise<void> {
    await this.prismaClient.measures.create({
      data: {
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
        measure_value: measure.measure_value,
        customer_code: measure.customer_code,
      },
    });
  }

  public async list(): Promise<Measure[]> {
    return [];
  }

  public async validateLectureByMonth(
    measure_type: string,
    date: string,
  ): Promise<Either<boolean, boolean>> {
    const dateTransform = new Date(date);
    const startOfMonth = new Date(
      dateTransform.getFullYear(),
      dateTransform.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      dateTransform.getFullYear(),
      dateTransform.getMonth() + 1,
      1,
    );

    const thereIsRegister = await this.prismaClient.measures.findFirst({
      where: {
        measure_type,
        measure_datetime: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    if (thereIsRegister) {
      return left(false);
    }

    return right(true);
  }
}
