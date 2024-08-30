import { Either } from '@src/utils/errors/either';
import { Measure } from '../measure/entity/measure.entity';

export interface MainGateway {
  save(measure: Measure): Promise<void>;
  list(customer_code: string): Promise<Measure[]>;
  validateLectureByMonth(
    measure_type: string,
    date: string,
  ): Promise<Either<boolean, boolean>>;
}
