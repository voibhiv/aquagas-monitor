import { Controller, Get, Patch, Post } from '@overnightjs/core';
import { CreateRegisterUseCase } from '@src/usecases/system/create-register/create-register.usecase';
import { Request, Response } from 'express';
import { checkPostParameters } from '@src/utils/errors/validators/check-post-params.validator';
import { GenerateImagePromptUseCase } from '@src/usecases/gemini/generate-prompt-by-image/generate-prompt-by-image.usecase';
import { generateLocalFileImage } from '@src/utils/generate-local-file-image';
import { checkPatchParameters } from '@src/utils/errors/validators/check-patch-parameters.validator';
import { FetchRegisterUseCase } from '@src/usecases/system/fetch-register/fetch-register.usecase';
import { checkGetParameters } from '@src/utils/errors/validators/check-get-parameters.validator';
import { ReadRegistersUseCase } from '@src/usecases/system/read-registers/read-registers.usecase';
@Controller('')
export class MainController {
  public constructor(
    private readonly useCaseCreateRegister: CreateRegisterUseCase,
    private readonly useCaseFetchRegister: FetchRegisterUseCase,
    private readonly useCaseReadRegister: ReadRegistersUseCase,
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
      console.log(error);
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
      console.log(error);
      return res.status(500);
    }
  }

  @Get(':customer_code/list')
  public async getList(req: Request, res: Response) {
    try {
      const { query, params } = req;

      const customer_code =
        typeof params.customer_code === 'string' ? params.customer_code : '';

      const measure_type =
        typeof query.measure_type === 'string' ? query.measure_type : '';

      const validateOrData = checkGetParameters(customer_code, measure_type);

      if (validateOrData.isLeft()) {
        return res
          .status(validateOrData.value.statusCode)
          .json(validateOrData.value);
      }

      const listOrError = await this.useCaseReadRegister.execute({
        customer_code,
        measure_type,
      });

      if (listOrError.isLeft()) {
        return res.status(listOrError.value.statusCode).json(listOrError.value);
      }

      return res.status(200).json(listOrError.value);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
