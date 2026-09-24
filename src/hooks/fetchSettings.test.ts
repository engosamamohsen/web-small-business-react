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
