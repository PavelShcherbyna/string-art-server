export class AppError extends Error {
  constructor(message: string, statusCode: string | number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }

  private statusCode: string | number;
  private status: string;
}
