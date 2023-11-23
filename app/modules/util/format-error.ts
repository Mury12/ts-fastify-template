export function formatError(message: string, statusCode: number, error?: any) {
  return {
    message,
    statusCode,
    error,
  };
}
