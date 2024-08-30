import { Either, left, right } from '../either';
import { InvalidMeasureTypeFormat } from '../system-errors-formatter/invalid-measure-type-format.error';
import { InvalidRequestFormat } from '../system-errors-formatter/invalid-request-format.error';
import { isEmpty } from './empty-validator';

export const checkGetParameters = (
  customer_code: string,
  measure_type: string,
): Either<InvalidRequestFormat | InvalidMeasureTypeFormat, string> => {
  if (isEmpty(customer_code)) {
    return left(
      new InvalidRequestFormat(
        `Os dados fornecidos no corpo da requisição são inválidos`,
        400,
      ),
    );
  }

  if (measure_type && !['WATER', 'GAS'].includes(measure_type)) {
    return left(
      new InvalidMeasureTypeFormat(`Tipo de medição não permitida`, 400),
    );
  }

  return right(customer_code);
};
