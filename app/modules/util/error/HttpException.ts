import { FastifyError, ValidationResult } from "fastify";

export class HttpException extends Error implements FastifyError {
  code: string;
  statusCode?: number;
  validation?: ValidationResult[];

  constructor(message: any, statusCode: number, data?: unknown) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
