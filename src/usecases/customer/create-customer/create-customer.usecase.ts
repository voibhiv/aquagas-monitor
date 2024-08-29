import { UseCase } from '../../usecase';
import { CustomerGateway } from '@src/domain/customer/gateway/customer.gateway';
import { Customer } from '@src/domain/customer/entity/customer.entity';

export type CreateCustomerInputDto = {
  customer_code: string;
};

export type CreateCustomerOutputDto = {};

export class CreateCustomerUseCase
  implements UseCase<CreateCustomerInputDto, CreateCustomerOutputDto>
{
  private constructor(private readonly customerGateway: CustomerGateway) {}

  public static create(costumerGateway: CustomerGateway) {
    return new CreateCustomerUseCase(costumerGateway);
  }

  public async execute(
    input: CreateCustomerInputDto,
  ): Promise<CreateCustomerOutputDto> {
    const aCostumer = Customer.create(input.customer_code);

    await this.customerGateway.save(aCostumer);

    return aCostumer;
  }
}
