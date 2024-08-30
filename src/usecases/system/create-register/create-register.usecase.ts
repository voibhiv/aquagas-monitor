import { MainGateway } from '@src/domain/gateway/main.gateway';
import { Measure } from '@src/domain/measure/entity/measure.entity';
import { Either, left, right } from '@src/utils/errors/either';
import { LectureRegisteredFormat } from '@src/utils/errors/system-errors-formatter/lecture-registered-format.error';

export type CreateRegisterInputDto = {
  measure_datetime: string;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  customer_code: string;
  measure_value: number;
};

export type CreateRegisterOutputDto = {
  measure_uuid: string;
  measure_value: number;
  image_url: string;
};

interface UseCase<I, O> {
  execute(input: I): Promise<Either<LectureRegisteredFormat, O>>;
}

export class CreateRegisterUseCase
  implements UseCase<CreateRegisterInputDto, CreateRegisterOutputDto>
{
  private constructor(private readonly mainGateway: MainGateway) {}

  public static create(mainGateway: MainGateway) {
    return new CreateRegisterUseCase(mainGateway);
  }

  public async execute(
    input: CreateRegisterInputDto,
  ): Promise<Either<LectureRegisteredFormat, CreateRegisterOutputDto>> {
    const isAvaiableToSave = await this.mainGateway.validateLectureByMonth(
      input.measure_type,
      input.measure_datetime,
    );

    if (isAvaiableToSave.isLeft()) {
      return left(
        new LectureRegisteredFormat(`Leitura do mês já realizada`, 409),
      );
    }

    const aMeasure: Measure = Measure.create(
      new Date(input.measure_datetime),
      input.measure_type,
      input.has_confirmed,
      input.image_url,
      input.measure_value,
      input.customer_code,
    );

    await this.mainGateway.save(aMeasure);

    return right(this.normalizePresentData(aMeasure));
  }

  public normalizePresentData(measure: Measure): CreateRegisterOutputDto {
    return {
      measure_uuid: measure.measure_uuid,
      measure_value: measure.measure_value,
      image_url: measure.image_url,
    };
  }
}
