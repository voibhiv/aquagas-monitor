import { Either, left, right } from '../either';
import { InvalidRequestFormat } from '../system-errors-formatter/invalid-request-format.error';
import { isEmpty } from './empty-validator';

export const checkPatchParameters = (data: {
  measure_uuid: string;
  confirmed_value: number;
}): Either<
  InvalidRequestFormat,
  {
    measure_uuid: string;
    confirmed_value: number;
  }
> => {
  if (
    isEmpty(data.measure_uuid) ||
    isEmpty(data.confirmed_value) ||
    !Number.isInteger(Number(data.confirmed_value))
  ) {
    return left(
      new InvalidRequestFormat(
        `Os dados fornecidos no corpo da requisição são inválidos`,
        400,
      ),
    );
  }

  data.confirmed_value = Number(data.confirmed_value);

  return right(data);
};
