import { merge } from "lodash-es";
import { readFileConfig } from "./file/index.js";
import { readEnvConfig } from "./env/index.js";
import { defaultConfig } from "./default-config.js";

import type { Config } from "./type.js";
import type { Context } from "./context.js";

export const readConfig = async (
  ctx: Context,
  path: string
): Promise<Config> => {
  const fileConfig = await readFileConfig(path);
  const envConfig = readEnvConfig();
  return merge({}, defaultConfig, fileConfig as any, envConfig as any);
};

export * from "./type.js";
