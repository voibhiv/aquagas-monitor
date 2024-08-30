import { MainGateway } from '@src/domain/gateway/main.gateway';
import {
  Measure,
  MeasureProps,
} from '@src/domain/measure/entity/measure.entity';
import { Either, left, right } from '@src/utils/errors/either';
import { InvalidLectureFormat } from '@src/utils/errors/system-errors-formatter/invalid-lecture-format.error';

export type ReadRegistersInputDto = {
  measure_type: string;
  customer_code: string;
};

type MeasureWithoutCustomerCode = Omit<MeasureProps, 'customer_code'>;

export type ReadRegistersOutputDto = {
  customer_code: string;
  measures: MeasureWithoutCustomerCode[];
};

interface UseCase<I, O> {
  execute(input: I): Promise<Either<InvalidLectureFormat, O>>;
}

export class ReadRegistersUseCase
  implements UseCase<ReadRegistersInputDto, ReadRegistersOutputDto>
{
  private constructor(private readonly mainGateway: MainGateway) {}

  public static create(mainGateway: MainGateway) {
    return new ReadRegistersUseCase(mainGateway);
  }

  public async execute(
    input: ReadRegistersInputDto,
  ): Promise<Either<InvalidLectureFormat, ReadRegistersOutputDto>> {
    const list = await this.mainGateway.list(
      input.customer_code,
      input.measure_type,
    );

    if (list.isLeft()) {
      return left(list.value);
    }

    return right(this.normalizePresentData(list.value, input.customer_code));
  }

  public normalizePresentData(
    measures: Measure[],
    customer_code: string,
  ): ReadRegistersOutputDto {
    return {
      customer_code,
      measures: measures.map((measure) => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
        measure_value: measure.measure_value,
      })),
    };
  }
}
