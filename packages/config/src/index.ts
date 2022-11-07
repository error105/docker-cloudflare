import { assignWith, isUndefined } from "lodash-es";
import { readUserConfig } from "./user-config.js";
import { defaultConfig } from "./default-config.js";

import type { Config } from "./type.js";

export const readConfig = async (path: string): Promise<Config> => {
  const userConfig = await readUserConfig(path);
  return assignWith(userConfig, defaultConfig, (obj, src) =>
    isUndefined(obj) ? src : obj
  );
};

export * from "./type.js";
