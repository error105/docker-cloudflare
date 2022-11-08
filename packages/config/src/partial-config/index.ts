import { verifySchema } from "./verify-schema.js";
import schema from "./config.schema.json" assert { type: "json" };

import type { PartialConfig } from "./schema.js";

export function verifyPartialConfig(input: unknown): PartialConfig {
  return verifySchema<PartialConfig>(schema, input);
}

export * from "./schema.js";
