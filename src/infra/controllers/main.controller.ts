import { Controller, Patch, Post } from '@overnightjs/core';
import { CreateRegisterUseCase } from '@src/usecases/system/create-register/create-register.usecase';
import { Request, Response } from 'express';
import { checkPostParameters } from '@src/utils/errors/validators/check-post-params.validator';
import { GenerateImagePromptUseCase } from '@src/usecases/gemini/generate-prompt-by-image/generate-prompt-by-image.usecase';
import { generateLocalFileImage } from '@src/utils/generate-local-file-image';
import { checkPatchParameters } from '@src/utils/errors/validators/check-patch-parameters.validator';
import { FetchRegisterUseCase } from '@src/usecases/system/fetch-register/fetch-register.usecase';
@Controller('')
export class MainController {
  public constructor(
    private readonly useCaseCreateRegister: CreateRegisterUseCase,
    private readonly useCaseFetchRegister: FetchRegisterUseCase,
    private readonly useCaseGenerateImage: GenerateImagePromptUseCase,
  ) {}

  @Post('upload')
  public async uploadImage(req: Request, res: Response) {
    try {
      const validateOrData = checkPostParameters(req.body);

      if (validateOrData.isLeft())
        return res
          .status(validateOrData.value.statusCode)
          .json(validateOrData.value);

      const { customer_code, image, measure_datetime, measure_type } =
        validateOrData.value;

      const returnGeminiData = await this.useCaseGenerateImage.execute(image);
      const image_url = await generateLocalFileImage(
        image,
        returnGeminiData.mimeType,
      );

      const createUseCaseOrError = await this.useCaseCreateRegister.execute({
        measure_datetime,
        measure_type,
        has_confirmed: false,
        image_url,
        customer_code,
        measure_value: parseInt(returnGeminiData.text),
      });

      if (createUseCaseOrError.isLeft())
        return res
          .status(createUseCaseOrError.value.statusCode)
          .json(createUseCaseOrError.value);

      return res.status(200).json(createUseCaseOrError.value);
    } catch (error) {
      return res.status(500);
    }
  }

  @Patch('confirm')
  public async fetchData(req: Request, res: Response) {
    try {
      const validateOrData = checkPatchParameters(req.body);
      if (validateOrData.isLeft())
        return res
          .status(validateOrData.value.statusCode)
          .json(validateOrData.value);

      const { measure_uuid, confirmed_value } = req.body;

      const updatedValueMeasureOrError =
        await this.useCaseFetchRegister.execute({
          measure_uuid,
          confirmed_value,
        });

      if (updatedValueMeasureOrError.isLeft()) {
        return res
          .status(updatedValueMeasureOrError.value.statusCode)
          .json(updatedValueMeasureOrError.value);
      }

      return res.status(200).json(updatedValueMeasureOrError.value);
    } catch (error) {
      return res.status(500);
    }
  }
}
