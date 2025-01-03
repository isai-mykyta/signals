import { CustomErrorType, HttpStatusCode } from "../types";

export class ApplicationError extends Error {
  public statusCode?: HttpStatusCode;
  public type: CustomErrorType;
  public details?: Record<string, unknown> | string | number | string[] | number[];

  constructor(options: { 
    message: string
    type: CustomErrorType, 
    details?: Record<string, unknown> | string | number | string[] | number[],
    statusCode?: HttpStatusCode,
  }) {
    super(options.message);
    this.type = options.type;
    this.statusCode = options.statusCode || this.getStatusCode();
    this.details = options.details;

    console.log(options);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  private getStatusCode(): HttpStatusCode {
    switch (this.type) {
    case CustomErrorType.VALIDATION_ERROR:
      return HttpStatusCode.BAD_REQUEST;
    case CustomErrorType.NOT_FOUND:
      return HttpStatusCode.NOT_FOUND;
    default:
      return HttpStatusCode.INTERNAL_ERROR;
    }
  }

  public getErrorData() {
    return {
      message: this.message,
      ...(this.details && { details: this.details })
    };
  }
}
