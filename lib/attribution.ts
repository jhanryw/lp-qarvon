"use client";

import type { Attribution } from "./schema";

const STORAGE_KEY = "qarvon_attribution_v1";

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * Captures UTMs/fbclid/_fbp/_fbc on first load and persists them for the
 * whole session, so attribution survives internal navigation before submit.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") {
    return {
      page_url: "",
      referrer: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      fbclid: "",
      fbp: "",
      fbc: "",
      campaign_id: "",
      adset_id: "",
      ad_id: "",
      gclid: "",
      gbraid: "",
      wbraid: "",
    };
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  const params = new URLSearchParams(window.location.search);
  const newAttributionKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "campaign_id",
    "adset_id",
    "ad_id",
    "gclid",
    "gbraid",
    "wbraid",
  ];
  const hasNewUtm = newAttributionKeys.some((key) => params.get(key));

  if (stored && !hasNewUtm) {
    try {
      return JSON.parse(stored) as Attribution;
    } catch {
      // fall through and recompute
    }
  }

  const attribution: Attribution = {
    page_url: window.location.href,
    referrer: document.referrer ?? "",
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_content: params.get("utm_content") ?? "",
    utm_term: params.get("utm_term") ?? "",
    fbclid: params.get("fbclid") ?? "",
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    // Vêm da URL do anúncio (?campaign_id=...&adset_id=...&ad_id=...),
    // não de nenhum UTM padrão — ver lib/schema.ts.
    campaign_id: params.get("campaign_id") ?? "",
    adset_id: params.get("adset_id") ?? "",
    ad_id: params.get("ad_id") ?? "",
    gclid: params.get("gclid") ?? "",
    gbraid: params.get("gbraid") ?? "",
    wbraid: params.get("wbraid") ?? "",
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}
