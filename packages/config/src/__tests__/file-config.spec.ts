import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readFileConfig } from "../file-config.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const getConfigPath = (file: string): string =>
  join(currentDir, "..", "..", "data", file);

describe("file-config", () => {
  it("minimal.yaml", async () => {
    const cfgPath = getConfigPath("minimal.yaml");
    await readFileConfig(cfgPath);
  });
});
