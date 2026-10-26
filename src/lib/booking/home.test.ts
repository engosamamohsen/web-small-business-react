import { describe, expect, it } from "vitest";
import { homeAreas, homeChoiceOffered, homeFee, locationErrors, locationPayload } from "./home";

const settings = {
  home: {
    offered: true,
    travel_minutes: 30,
    areas: [
      { city_id: 5, name: "مدينة نصر", fee: 50 },
      { city_id: 6, name: "الزمالك", fee: 0 },
      { city_id: 0, name: "bad", fee: 10 },
    ],
  },
};
const services = [{ id: 1, at_home: true }, { id: 2, at_home: true }, { id: 3, at_home: false }, { id: 4 }];

describe("homeChoiceOffered", () => {
  it("needs the store to offer it, an area, and every chosen service at home", () => {
    expect(homeChoiceOffered(settings, services, [1, 2])).toBe(true);
    expect(homeChoiceOffered(settings, services, [1, 3])).toBe(false);
    expect(homeChoiceOffered(settings, services, [4])).toBe(false);
    expect(homeChoiceOffered(settings, services, [])).toBe(false);
    expect(homeChoiceOffered({ home: { ...settings.home, offered: false } }, services, [1])).toBe(false);
    expect(homeChoiceOffered({ home: { ...settings.home, areas: [] } }, services, [1])).toBe(false);
    expect(homeChoiceOffered({}, services, [1])).toBe(false);
  });
});

describe("areas and fee", () => {
  it("drops areas without an id and finds the fee", () => {
    const areas = homeAreas(settings);
    expect(areas.map((a) => a.city_id)).toEqual([5, 6]);
    expect(homeFee(areas, 5)).toBe(50);
    expect(homeFee(areas, 6)).toBe(0);
    expect(homeFee(areas, null)).toBe(0);
    expect(homeAreas(null)).toEqual([]);
  });
});

describe("location fields", () => {
  const areas = homeAreas(settings);

  it("asks nothing for the salon", () => {
    expect(locationErrors({ location: "salon", cityId: null, address: "" }, areas)).toEqual({});
    expect(locationPayload({ location: "salon", cityId: 5, address: "x" })).toEqual({ location: "salon" });
  });

  it("needs a served area and an address for home", () => {
    expect(locationErrors({ location: "home", cityId: null, address: " " }, areas)).toEqual({ area: true, address: true });
    expect(locationErrors({ location: "home", cityId: 99, address: "شارع" }, areas)).toEqual({ area: true });
    expect(locationErrors({ location: "home", cityId: 5, address: "ا".repeat(501) }, areas)).toEqual({ address: true });
    expect(locationErrors({ location: "home", cityId: 5, address: "شارع 9" }, areas)).toEqual({});
  });

  it("sends location, city_id and the trimmed address", () => {
    expect(locationPayload({ location: "home", cityId: 5, address: "  شارع 9  " })).toEqual({ location: "home", city_id: 5, address: "شارع 9" });
  });
});
