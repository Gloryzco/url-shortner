import { ExecutionContext } from '@nestjs/common';

export function responseHandler(
  res: Record<string, unknown>,
  context: ExecutionContext,
  defaultMessage = 'Request processed successfully',
) {
  const ctx = context.switchToHttp();
  const response = ctx.getResponse();

  const statusCode = res?.statusCode ?? response.statusCode ?? 200;
  response.status(statusCode);
  const message = res?.message ?? defaultMessage;
  const data = res?.data ?? res;

  return {
    success: true,
    statusCode,
    message,
    data,
  };
}
