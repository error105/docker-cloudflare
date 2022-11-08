import { has } from "lodash-es";

export interface Auth {
  /**
   * Cloudflare API token
   */
  scopedToken: string;
}

export type RecordType = "A" | "AAAA";

export interface Webhook {
  run?: string;
  success?: string;
  failure?: string;
  formatter?: WebhookFormatter;
}

type MayBePromise<T> = T | Promise<T>;
export interface WebhookFormatter {
  (status: string, response?: unknown): MayBePromise<
    Record<string, any> | undefined
  >;
}

export interface BaseDomain {
  name: string;
  type: RecordType;
  proxied: boolean;
  create: boolean;
  webhook: Webhook;
}

export interface ZoneIdDomain extends BaseDomain {
  zoneId: string;
}

export interface ZoneNameDomain extends BaseDomain {
  zoneName: string;
}

export type Domain = ZoneIdDomain | ZoneNameDomain;

export const isZoneIdDomain = (domain: Domain): domain is ZoneIdDomain =>
  has(domain, "zoneId");

export interface IpEcho {
  type: string;
  url: string;
  [key: string]: unknown;
}

export interface Config {
  /**
   * Cloudflare V4 API url
   */
  api: string;
  auth: Auth;
  domains: Domain[];
  ipv4: IpEcho[];
  ipv6: IpEcho[];
  echoParsers: IpEchoParser[];
}

export interface IpEchoParser {
  resolve: string;
  alias?: string;
}
