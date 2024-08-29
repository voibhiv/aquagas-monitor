import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('')
export class MainController {
  @Post('upload')
  public uploadImage(req: Request, res: Response) {
    try {
      const { image, customer_code, measure_datetime, measure_type } = req.body;
      console.log(req.body);
      // console.log("image", image);
      res.send(200)
    } catch (error) {

    }
  }
}
