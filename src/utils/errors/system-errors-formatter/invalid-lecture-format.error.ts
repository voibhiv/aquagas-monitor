export class InvalidLectureFormat extends Error {
  private error_description: string;
  private error_code: number;

  constructor(message: string, statusCode = 404) {
    super(message);
    this.error_code = statusCode;
    this.error_description = message;
  }

  get message() {
    return this.error_description;
  }

  get statusCode() {
    return this.error_code;
  }
}
