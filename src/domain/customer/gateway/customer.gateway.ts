import { Customer } from "../entity/customer.entity";

export interface CustomerGateway {
  save(measure: Customer): Promise<void>;
}