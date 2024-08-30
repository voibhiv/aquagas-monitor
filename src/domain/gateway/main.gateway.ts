import { Either } from '@src/utils/errors/either';
import { Measure } from '../measure/entity/measure.entity';
import { InvalidLectureFormat } from '@src/utils/errors/system-errors-formatter/invalid-lecture-format.error';
import { LectureConfirmedByMonthFormat } from '@src/utils/errors/system-errors-formatter/lecture-confirmed-by-month-format.error';

export interface MainGateway {
  save(measure: Measure): Promise<void>;
  list(customer_code: string): Promise<Measure[]>;
  validateLectureByMonth(
    measure_type: string,
    date: string,
  ): Promise<Either<boolean, boolean>>;
  confirmValue(data: {
    measure_uuid: string;
    confirmed_value: number;
  }): Promise<
    Either<InvalidLectureFormat | LectureConfirmedByMonthFormat, boolean>
  >;
}
