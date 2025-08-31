import { HttpStatus } from '@nestjs/common';

export class ResponseFormat {
  static success<T>(
    statusCode: HttpStatus,
    message = 'Success',
    data?: T,
  ): IResponseFormat<T> {
    const isEmpty =
      data === null ||
      data === undefined ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === 'object' && Object.keys(data).length === 0);

    return {
      status: 'success',
      statusCode,
      message,
      data: isEmpty ? [] : data,
    };
  }

  static error(
    error: any,
    message = 'Error',
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ): IResponseFormat {
    return {
      status: 'error',
      statusCode,
      message,
      error,
    };
  }
}

export interface IResponseFormat<T = any> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data?: T | [];
  error?: any;
}
