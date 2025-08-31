import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export function errorHandler(exception: any, context: ExecutionContext) {
  const ctx = context.switchToHttp();
  const response = ctx.getResponse();

  const status =
    exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

  let errorResponse;
  if (typeof exception.getResponse === 'function') {
    errorResponse = exception.getResponse();
  } else {
    errorResponse = {
      statusCode: 500,
      message: 'Internal server error',
      error: exception.message || 'Unknown error',
    };
  }

  response.status(status).json({
    success: false,
    statusCode: status,
    //   path: request.url,
    message: exception.message,
    data: errorResponse,
  });
}
