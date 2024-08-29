import { MeasureGateway } from '@src/domain/measure/gateway/measure.gateway';
import { UseCase } from '../../usecase';
import { Measure } from '@src/domain/measure/entity/measure.entity';

export type CreateMeasureInputDto = {
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
};

export type CreateMeasureOutputDto = {
  // measure_uuid: string;
  // measure_datetime: Date;
  // measure_type: string;
  // has_confirmed: boolean;
  // image_url: string;
};

export class CreateMeasureUseCase
  implements UseCase<CreateMeasureInputDto, CreateMeasureOutputDto>
{
  private constructor(private readonly measureGateway: MeasureGateway) {}

  public static create(measureGateway: MeasureGateway) {
    return new CreateMeasureUseCase(measureGateway);
  }

  public async execute(
    input: CreateMeasureInputDto,
  ): Promise<CreateMeasureOutputDto> {
    const aMeasure: Measure = Measure.create(
      input.measure_datetime,
      input.measure_type,
      input.has_confirmed,
      input.image_url,
    );

    await this.measureGateway.save(aMeasure);

    return aMeasure;
  }
}
