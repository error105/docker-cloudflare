import readEnvVars from "read-env-vars";
import { isArray, isNil } from "lodash-es";

import { parseZoneName } from "../utils.js";

import type { PartialConfig } from "../partial-config/index.js";
import type { Domain, ZoneIdDomain, ZoneNameDomain } from "../type.js";

export const readEnvConfig = (): PartialConfig => {
  const variables = readEnvVars("CF_DNS");
  if (isArray(variables.domains)) {
    const domains = variables.domains as Partial<Domain>[];
    variables.domains = domains.map(domain => {
      if (isNil(domain.type)) {
        domain.type = "A";
      }
      if (isNil(domain.proxied)) {
        domain.proxied = true;
      }
      if (isNil(domain.create)) {
        domain.create = false;
      }
      if (
        isNil((domain as Partial<ZoneIdDomain>).zoneId) &&
        isNil((domain as Partial<ZoneNameDomain>).zoneName) &&
        !isNil(domain.name)
      ) {
        (domain as Partial<ZoneNameDomain>).zoneName = parseZoneName(
          domain.name
        );
      }
      return domain;
    });
  }
  return variables;
};
