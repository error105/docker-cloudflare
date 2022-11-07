import ajv from "ajv";
import ajvFormats from "ajv-formats";
import { SchemaViolationError } from "./schema-violation-error.js";

const Ajv = ajv.default;
const addFormats = ajvFormats.default;

import type { FuncKeywordDefinition } from "ajv";
import type { Logger } from "pino";

const customType = {
  Function: Function
};

const instanceOfFunc: FuncKeywordDefinition = {
  keyword: "instanceOf",
  compile: function (schema) {
    return function (data) {
      return data instanceof customType[schema];
    };
  }
};

export interface VerifySchemaOptions {
  logger?: Logger;
}

export const verifySchema = <T>(
  schema: Record<string, unknown>,
  data: unknown,
  opts: VerifySchemaOptions = {}
): T => {
  const ajv = new Ajv();
  addFormats(ajv);
  ajv.addKeyword(instanceOfFunc);
  const validate = ajv.compile<T>(schema);
  if (validate(data)) {
    return data;
  }
  const logger = opts.logger?.child({ module: "schema" });
  logger?.error({ data, schema, msg: "Failed to verify schema" });
  throw new SchemaViolationError(validate.errors || []);
};
