import type { ErrorObject } from "ajv";

export class SchemaViolationError extends Error {
  public errors: ErrorObject[];
  public constructor(errors: ErrorObject[]) {
    const messages = errors.map(error => error.message).join("\n");
    super(`Failed to validate schema Errors:\n${messages}`);
    this.errors = errors;
  }
}
