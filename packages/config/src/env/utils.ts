import type { Context } from "../context.js";

export function getEnv(
  ctx: Context,
  key: string,
  deprecatedKey?: string
): string | undefined {
  let value = process.env[key];
  if (!value && deprecatedKey) {
    value = process.env[deprecatedKey];
    if (value) {
      ctx.logger.warn(
        `Environment variable (${deprecatedKey}) will be deprecated in favor of (${key})`
      );
    }
  }
  return value;
}

export function getEnvInt(
  ctx: Context,
  key: string,
  deprecatedKey?: string
): number | undefined {
  const value = getEnv(ctx, key, deprecatedKey);
  if (!value) {
    return undefined;
  }
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    throw Error(`Environment variable (${key}) is not a integer.`);
  }
  return parsed;
}
