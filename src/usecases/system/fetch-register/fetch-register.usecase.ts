import { MainGateway } from '@src/domain/gateway/main.gateway';
import { Either, left, right } from '@src/utils/errors/either';
import { InvalidLectureFormat } from '@src/utils/errors/system-errors-formatter/invalid-lecture-format.error';
import { LectureConfirmedByMonthFormat } from '@src/utils/errors/system-errors-formatter/lecture-confirmed-by-month-format.error';

export type FetchRegisterInputDto = {
  measure_uuid: string;
  confirmed_value: number;
};

export type FetchRegisterOutputDto = {
  success: boolean;
};

interface UseCase<I, O> {
  execute(
    input: I,
  ): Promise<Either<InvalidLectureFormat | LectureConfirmedByMonthFormat, O>>;
}

export class FetchRegisterUseCase
  implements UseCase<FetchRegisterInputDto, FetchRegisterOutputDto>
{
  private constructor(private readonly mainGateway: MainGateway) {}

  public static create(mainGateway: MainGateway) {
    return new FetchRegisterUseCase(mainGateway);
  }

  public async execute(
    input: FetchRegisterInputDto,
  ): Promise<
    Either<
      InvalidLectureFormat | LectureConfirmedByMonthFormat,
      FetchRegisterOutputDto
    >
  > {
    const toUpdate = await this.mainGateway.confirmValue(input);

    if (toUpdate.isLeft()) {
      return left(toUpdate.value);
    }

    return right(this.normalizePresentData());
  }

  public normalizePresentData(): FetchRegisterOutputDto {
    return {
      success: true,
    };
  }
}
