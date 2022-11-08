import { getEnv } from "./utils.js";
import { verifyPartialConfig } from "../partial-config/index.js";
import { parseZoneName } from "../utils.js";

import type { PartialConfig } from "../partial-config/index.js";
import type { Context } from "../context.js";
import type { Domain } from "../type.js";

function getEnvDomain(ctx: Context): Domain | undefined {
  const name = getEnv(ctx, "CF_DNS_HOST", "HOST");
  const type = getEnv(ctx, "CF_DNS_TYPE");
  const proxy = getEnv(ctx, "CF_DNS_PROXY", "PROXY") ?? "true";
  const forceCreate =
    getEnv(ctx, "CF_DNS_FORCE_CREATE", "FORCE_CREATE") ?? "false";
  if (!name) {
    return undefined;
  }
  const baseDomain = {
    name,
    type: type === "AAAA" ? "AAAA" : "A",
    proxied: proxy === "true",
    create: forceCreate === "true",
    webhook: {
      run: getEnv(ctx, "CF_DNS_WEBHOOK_RUN"),
      success: getEnv(ctx, "CF_DNS_WEBHOOK_SUCCESS"),
      failure: getEnv(ctx, "CF_DNS_WEBHOOK_FAILURE")
    }
  } as const;
  const zoneId = getEnv(ctx, "CF_DNS_ZONE_ID");
  if (zoneId) {
    return { ...baseDomain, zoneId };
  }
  const zoneName = getEnv(ctx, "CF_DNS_ZONE_NAME", "ZONE");
  if (zoneName) {
    return { ...baseDomain, zoneName };
  }
  return { ...baseDomain, zoneName: parseZoneName(name) };
}

export const readEnvConfig = (ctx: Context): PartialConfig => {
  const jsonConfig = getEnv(ctx, "CF_DNS_JSON_CONFIG");
  if (jsonConfig) {
    return verifyPartialConfig(JSON.parse(jsonConfig));
  }
  const scopedToken = getEnv(ctx, "CF_DNS_SCOPED_TOKEN");
  const domain = getEnvDomain(ctx);
  const domains = domain ? [domain] : [];
  return {
    api: getEnv(ctx, "CF_DNS_API"),
    auth: scopedToken ? { scopedToken } : undefined,
    domains
  };
};
