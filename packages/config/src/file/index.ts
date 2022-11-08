import { cosmiconfig } from "cosmiconfig";
import { verifyPartialConfig } from "../partial-config/index.js";
import { parseZoneName } from "../utils.js";

import type {
  Domain as FileDomain,
  PartialConfig
} from "../partial-config/index.js";
import type { Domain } from "../type.js";

const mapDomain = (domain: FileDomain): Domain => {
  const {
    name,
    type,
    proxied = true,
    create = false,
    zoneId,
    zoneName,
    webhook = {}
  } = domain;
  const baseDomain = {
    name,
    type: type === "AAAA" ? "AAAA" : "A",
    proxied,
    create,
    webhook
  } as const;
  if (zoneId) {
    return { ...baseDomain, zoneId };
  }
  if (zoneName) {
    return { ...baseDomain, zoneName };
  }
  return { ...baseDomain, zoneName: parseZoneName(name) };
};

export const readFileConfig = async (path: string): Promise<PartialConfig> => {
  const cc = cosmiconfig("cloudflare");
  const cfg = await cc.load(path);
  const fileCfg = verifyPartialConfig(cfg?.config);
  const { domains, ...others } = fileCfg;
  return { ...others, domains: domains?.map(mapDomain) };
};
