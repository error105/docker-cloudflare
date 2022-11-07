import type { Logger } from "@cloudflare-ddns/log";
import type { Config } from "@cloudflare-ddns/config";

export interface Context {
  logger: Logger;
  config: Config;
}
