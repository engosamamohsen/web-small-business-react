import { describe, expect, it } from "vitest";
import { eligibleStaff, keepChosenStaff, staffChoiceOn, staffInitials } from "./staff";
import type { BookingCatalog, BookingStaffMember } from "./types";

const mona: BookingStaffMember = { id: 1, name: "منى أحمد", bio: "شعر وصبغة", branch_id: null };
const sara: BookingStaffMember = { id: 2, name: "سارة", bio: null, branch_id: 10 };
const hala: BookingStaffMember = { id: 3, name: "هالة", bio: null, branch_id: 20 };
const staff = [mona, sara, hala];

const services = [
  { id: 100, staff_ids: [1, 2, 3] }, // haircut: everyone
  { id: 101, staff_ids: [1, 2] }, // colour
  { id: 102, staff_ids: [2] }, // nails
  { id: 103 }, // no staff_ids sent
];

const settings = { slot_step_minutes: 15, max_days_ahead: 14, min_notice_minutes: 0, cancel_until_minutes: 60, auto_confirm: false, branches: [] };

describe("staffChoiceOn", () => {
  it("needs the store's switch and someone to choose", () => {
    expect(staffChoiceOn({ settings: { ...settings, staff_choice: true }, staff })).toBe(true);
    expect(staffChoiceOn({ settings: { ...settings, staff_choice: true }, staff: [] })).toBe(false);
    expect(staffChoiceOn({ settings: { ...settings, staff_choice: true } } as Pick<BookingCatalog, "settings" | "staff">)).toBe(false);
    expect(staffChoiceOn({ settings: { ...settings, staff_choice: false }, staff })).toBe(false);
    expect(staffChoiceOn({ settings, staff })).toBe(false);
  });
});

describe("eligibleStaff", () => {
  it("keeps whoever does every chosen service", () => {
    expect(eligibleStaff(staff, services, [100], null)).toEqual([mona, sara, hala]);
    expect(eligibleStaff(staff, services, [100, 101], null)).toEqual([mona, sara]);
    expect(eligibleStaff(staff, services, [101, 102], null)).toEqual([sara]);
  });

  it("filters by branch: null works everywhere, no branch chosen means no filter", () => {
    expect(eligibleStaff(staff, services, [100], 10)).toEqual([mona, sara]);
    expect(eligibleStaff(staff, services, [100], 20)).toEqual([mona, hala]);
    expect(eligibleStaff(staff, services, [102], 20)).toEqual([]);
  });

  it("offers nobody for a service without staff_ids, and everyone before a service is chosen", () => {
    expect(eligibleStaff(staff, services, [100, 103], null)).toEqual([]);
    expect(eligibleStaff(staff, services, [], 10)).toEqual([mona, sara]);
  });

  it("copes with no staff list", () => {
    expect(eligibleStaff(undefined, services, [100], null)).toEqual([]);
    expect(eligibleStaff(null, services, [100], null)).toEqual([]);
  });
});

describe("keepChosenStaff", () => {
  it("drops a choice that no longer qualifies", () => {
    const eligible = eligibleStaff(staff, services, [101], null);
    expect(keepChosenStaff(eligible, 2)).toBe(sara);
    expect(keepChosenStaff(eligible, 3)).toBeNull();
    expect(keepChosenStaff(eligible, null)).toBeNull();
  });
});

describe("staffInitials", () => {
  it("takes the first letter of two words, kept apart", () => {
    expect(staffInitials("منى أحمد علي")).toBe("م‌أ");
    expect(staffInitials("  sara  ")).toBe("S");
    expect(staffInitials("john doe")).toBe("J‌D");
    expect(staffInitials("")).toBe("؟");
    expect(staffInitials(null)).toBe("؟");
  });
});
