import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assert } from "chai";
import pino from "pino";
import dotenv from "dotenv";

import { readConfig } from "../index.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const getConfigPath = (file: string): string =>
  join(currentDir, "..", "..", "data", file);

describe("readConfig", () => {
  it("should merge env, file and default config", async () => {
    const envPath = getConfigPath("merge.env");
    const filePath = getConfigPath("merge.yaml");
    dotenv.config({ path: envPath, override: true });
    const config = await readConfig({ logger: pino.default() }, filePath);

    assert.strictEqual(
      config.api,
      "https://api.cloudflare.com/client/v4/",
      "api"
    );
    assert.strictEqual(config.auth.scopedToken, "example2", "scopedToken");
    assert.strictEqual(config.domains.length, 1, "domains.length");

    const domain = config.domains?.[0];
    assert.exists(domain);
    if (!domain) {
      return;
    }
    assert.strictEqual(domain.name, "example1.com", "domain.name");
    assert.strictEqual(domain.type, "A", "domain.type");
    assert.strictEqual(domain.proxied, true, "domain.proxied");
    assert.strictEqual(domain.create, false, "domain.create");
  });
});
