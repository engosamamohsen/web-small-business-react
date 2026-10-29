// "Who serves you?" on /book (BookingWizard). Off by default: only when the store turns on
// "customers choose who serves them" does the catalogue carry settings.staff_choice = true, the
// staff list ([{id, name, bio, branch_id}]) and each service's staff_ids (Laravel
// API\V1\BookingController::services). Pure, so the filter is unit-tested.

import type { BookingCatalog, BookingService, BookingStaffMember } from "./types";

/** The wizard asks "who serves you?": the store allows it and has someone to choose from. */
export function staffChoiceOn(catalog: Pick<BookingCatalog, "settings" | "staff">): boolean {
  return catalog.settings?.staff_choice === true && Array.isArray(catalog.staff) && catalog.staff.length > 0;
}

/**
 * The staff a customer may choose for these services at this branch: whoever does EVERY chosen
 * service (the intersection of their staff_ids; a service without staff_ids has nobody) and works
 * at the branch (branch_id null = every branch; no branch chosen = no branch filter). With no
 * service chosen yet, everyone at the branch. Keeps the store's order.
 */
export function eligibleStaff(
  staff: BookingStaffMember[] | null | undefined,
  services: Pick<BookingService, "id" | "staff_ids">[],
  selectedIds: number[],
  branchId: number | null,
): BookingStaffMember[] {
  if (!Array.isArray(staff) || staff.length === 0) return [];
  const chosen = services.filter((s) => selectedIds.includes(s.id));
  return staff.filter(
    (member) =>
      (member.branch_id === null || member.branch_id === undefined || branchId === null || Number(member.branch_id) === branchId) &&
      chosen.every((s) => Array.isArray(s.staff_ids) && s.staff_ids.includes(member.id)),
  );
}

/** The chosen staff member while they still qualify, else null ("anyone available"). */
export function keepChosenStaff(eligible: BookingStaffMember[], staffId: number | null): BookingStaffMember | null {
  if (staffId === null) return null;
  return eligible.find((member) => member.id === staffId) ?? null;
}

/**
 * Avatar letters (there are no staff photos): the first letter of the first two words, kept apart
 * with a zero-width non-joiner so Arabic letters don't join ("منى أحمد" → "م‌أ"). "؟" when empty.
 */
export function staffInitials(name: string | null | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((word) => Array.from(word)[0]);
  return letters.length ? letters.join("‌").toUpperCase() : "؟";
}
