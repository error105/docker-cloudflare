import ajv from "ajv";
import ajvFormats from "ajv-formats";
import { SchemaViolationError } from "./schema-violation-error.js";

const Ajv = ajv.default;
const addFormats = ajvFormats.default;

import type { FuncKeywordDefinition } from "ajv";

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

export const verifySchema = <T>(
  schema: Record<string, unknown>,
  data: unknown
): T => {
  const ajv = new Ajv();
  addFormats(ajv);
  ajv.addKeyword(instanceOfFunc);
  const validate = ajv.compile<T>(schema);
  if (validate(data)) {
    return data;
  }
  throw new SchemaViolationError(validate.errors || []);
};
