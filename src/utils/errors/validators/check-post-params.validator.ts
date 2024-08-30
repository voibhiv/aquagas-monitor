import { Either, left, right } from '../either';
import { InvalidBase64Format } from '../system-errors-formatter/invalid-base64-format.error';
import { InvalidRequestFormat } from '../system-errors-formatter/invalid-request-format.error';
import { isEmpty } from './empty-validator';

export const checkPostParameters = (data: {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: 'WATER' | 'GAS';
}): Either<
  InvalidBase64Format | InvalidRequestFormat,
  {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: 'WATER' | 'GAS';
  }
> => {
  const base64ImagePattern =
    /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
  const isBase64Image = base64ImagePattern.test(data.image);

  if (!isBase64Image) {
    return left(
      new InvalidBase64Format(
        `O formato fornecido de base64 não é compatível com uma imagem`,
        400,
      ),
    );
  }

  if (
    isEmpty(data.image) ||
    isEmpty(data.customer_code) ||
    isEmpty(data.measure_datetime) ||
    isEmpty(data.measure_type) ||
    typeof data.customer_code !== 'string' ||
    typeof data.measure_datetime !== 'string' ||
    !['WATER', 'GAS'].includes(data.measure_type)
  ) {
    return left(
      new InvalidRequestFormat(
        `Os dados fornecidos no corpo da requisição são inválidos`,
        400,
      ),
    );
  }

  return right(data);
};
