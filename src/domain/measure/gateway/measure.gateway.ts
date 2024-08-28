import { Measure } from '../entity/measure.entity';

export interface MeasureGateway {
  save(measure: Measure): Promise<void>;
  list(customer_code: string): Promise<Measure[]>;
}
