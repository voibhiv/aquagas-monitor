import { Controller, Post } from '@overnightjs/core';
import { CreateRegisterUseCase } from '@src/usecases/system/create-register/create-register.usecase';
import { Request, Response } from 'express';
import { checkPostParameters } from '@src/utils/errors/validators/check-post-params.validator';
import { GenerateImagePromptUseCase } from '@src/usecases/gemini/generate-prompt-by-image/generate-prompt-by-image.usecase';
import { generateLocalFileImage } from '@src/utils/generate-local-file-image';
@Controller('')
export class MainController {
  public constructor(
    private readonly useCaseCreateRegister: CreateRegisterUseCase,
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

      return res.sendStatus(200).json(createUseCaseOrError.value);
    } catch (error) {
      return res.status(500);
    }
  }
}
