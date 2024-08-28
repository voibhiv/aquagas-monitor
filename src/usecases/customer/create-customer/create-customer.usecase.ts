import { UseCase } from '../../usecase';

export type CreateCustomerInputDto = {
  customer_code: string;
};

export type CreateCustomerOutputDto = {
  customer_code: string;
};

// export class CreateCustomerUseCase
//   implements UseCase<CreateCustomerInputDto, CreateCustomerOutputDto> {

//     private constructor(private readonly customerGateway: CustomerGateway) {
      
//     } 
    
//   }
