import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { captureAttribution } from "./attribution";

function setUrl(search: string): void {
  window.history.pushState({}, "", `/${search}`);
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
  document.cookie = "_fbp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "_fbc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});

describe("captureAttribution", () => {
  it("captura campaign_id/adset_id/ad_id/gclid/gbraid/wbraid da querystring do anúncio", () => {
    setUrl("?campaign_id=120212&adset_id=120213&ad_id=120214&gclid=g1&gbraid=gb1&wbraid=wb1");

    const attribution = captureAttribution();

    expect(attribution).toMatchObject({
      campaign_id: "120212",
      adset_id: "120213",
      ad_id: "120214",
      gclid: "g1",
      gbraid: "gb1",
      wbraid: "wb1",
    });
  });

  it("persiste os novos campos na sessão (não perde na navegação interna sem novos params)", () => {
    setUrl("?campaign_id=120212&utm_source=meta");
    captureAttribution();

    setUrl(""); // navegação interna, sem parâmetros novos
    const attribution = captureAttribution();

    expect(attribution.campaign_id).toBe("120212");
    expect(attribution.utm_source).toBe("meta");
  });

  it("recaptura quando um novo campaign_id chega mesmo com sessão já existente", () => {
    setUrl("?campaign_id=first");
    captureAttribution();

    setUrl("?campaign_id=second");
    const attribution = captureAttribution();

    expect(attribution.campaign_id).toBe("second");
  });
});
