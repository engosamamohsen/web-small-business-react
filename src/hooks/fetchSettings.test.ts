import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchSettings } from "./fetchSettings";

// Each tenant's setting-profile returns its own pixel.
const TRACKING: Record<string, string> = {
  "https://admin-roka.cashierthru.com/api/": "111111111",
  "https://admin-asly.cashierthru.com/api/": "222222222",
};

function mockApi() {
  const calls: string[] = [];
  vi.stubGlobal("fetch", async (url: string) => {
    calls.push(url);
    const base = Object.keys(TRACKING).find((b) => url.startsWith(b))!;
    return new Response(
      JSON.stringify({
        data: { id: 1 },
        tracking: [{ ref: "r", type: "meta_pixel", id: TRACKING[base] }],
      }),
    );
  });
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

describe("fetchSettings tracking (multi-tenant)", () => {
  it("keeps each tenant's tracking separate, including from the server cache", async () => {
    const calls = mockApi();
    const roka = "https://admin-roka.cashierthru.com/api/";
    const asly = "https://admin-asly.cashierthru.com/api/";

    const [a, b] = await Promise.all([fetchSettings(undefined, true, roka), fetchSettings(undefined, true, asly)]);
    expect(a.tracking?.[0].id).toBe("111111111");
    expect(b.tracking?.[0].id).toBe("222222222");

    // Served from the per-tenant cache: no new request, still the right tenant.
    const cachedB = await fetchSettings(undefined, false, asly);
    const cachedA = await fetchSettings(undefined, false, roka);
    expect(cachedA.tracking?.[0].id).toBe("111111111");
    expect(cachedB.tracking?.[0].id).toBe("222222222");
    expect(calls).toHaveLength(2);
  });

  it("treats a missing or malformed tracking field as none", async () => {
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ data: { id: 1 }, tracking: "oops" })));
    const res = await fetchSettings(undefined, true, "https://admin-other.cashierthru.com/api/");
    expect(res.tracking).toEqual([]);
  });
});

describe("fetchSettings for a deleted store", () => {
  const base = "https://admin-gone.cashierthru.com/api/";
  const notFound = () =>
    new Response(JSON.stringify({ status: false, message: "المتجر غير موجود.", data: null }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  const live = () => new Response(JSON.stringify({ data: { id: 1, name: "Old store" } }), { headers: { "Content-Type": "application/json" } });

  afterEach(() => vi.useRealTimers());

  it("flags the API's 404 as notFound", async () => {
    vi.stubGlobal("fetch", async () => notFound());
    const res = await fetchSettings(undefined, true, base);
    expect(res.ok).toBe(false);
    expect(res.notFound).toBe(true);
  });

  it("does not flag a 5xx, a network error or an HTML 404", async () => {
    vi.stubGlobal("fetch", async () => new Response("oops", { status: 503 }));
    expect((await fetchSettings(undefined, true, base)).notFound).toBe(false);
    vi.stubGlobal("fetch", async () => new Response("<html>", { status: 404, headers: { "Content-Type": "text/html" } }));
    expect((await fetchSettings(undefined, true, base)).notFound).toBe(false);
    vi.stubGlobal("fetch", async () => {
      throw new TypeError("fetch failed");
    });
    const res = await fetchSettings(undefined, true, base);
    expect(res.ok).toBe(false);
    expect(res.notFound).toBeFalsy();
  });

  it("drops the host's cached settings on a 404, so the old store is never served again", async () => {
    const host = "https://admin-deleted.cashierthru.com/api/";
    vi.stubGlobal("fetch", async () => live());
    expect((await fetchSettings(undefined, true, host)).data?.name).toBe("Old store");

    vi.stubGlobal("fetch", async () => notFound());
    expect((await fetchSettings(undefined, true, host)).notFound).toBe(true);

    // Not served from the cache any more: the next request asks the API again.
    let calls = 0;
    vi.stubGlobal("fetch", async () => {
      calls++;
      return notFound();
    });
    const again = await fetchSettings(undefined, false, host);
    expect(calls).toBe(1);
    expect(again.notFound).toBe(true);
    expect(again.data).toBeUndefined();
  });

  it("refreshes a cached store in the background after a minute and forgets it when it's gone", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const host = "https://admin-later.cashierthru.com/api/";
    vi.stubGlobal("fetch", async () => live());
    await fetchSettings(undefined, true, host);

    vi.setSystemTime(Date.now() + 2 * 60 * 1000);
    let calls = 0;
    vi.stubGlobal("fetch", async () => {
      calls++;
      return notFound();
    });
    // Still served from the cache this once (no blocking request)…
    expect((await fetchSettings(undefined, false, host)).data?.name).toBe("Old store");
    await new Promise((r) => setTimeout(r, 0));
    expect(calls).toBe(1);
    // …and the background 404 dropped it: the next request sees the store is gone.
    expect((await fetchSettings(undefined, false, host)).notFound).toBe(true);
  });

  it("a temporary failure keeps a cached store's settings", async () => {
    const host = "https://admin-blip.cashierthru.com/api/";
    vi.stubGlobal("fetch", async () => live());
    await fetchSettings(undefined, true, host);
    vi.stubGlobal("fetch", async () => new Response("down", { status: 502 }));
    await fetchSettings(undefined, true, host);
    vi.stubGlobal("fetch", async () => {
      throw new Error("must come from the cache");
    });
    expect((await fetchSettings(undefined, false, host)).data?.name).toBe("Old store");
  });
});
