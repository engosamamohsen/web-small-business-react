// Home visits (the store sends someone to the customer after accepting): when the choice is
// offered, the fee of an area, and the location fields of a booking. Display only; the server
// checks the area, the address and the fee again.

import type { BookingLocation, BookingPublicSettings, BookingService, HomeArea } from "./types";

export const MAX_ADDRESS_LENGTH = 500;

/** The store's areas with a usable id (fee never negative). */
export function homeAreas(settings: Pick<BookingPublicSettings, "home"> | null | undefined): HomeArea[] {
  const areas = settings?.home?.areas;
  if (!Array.isArray(areas)) return [];
  return areas
    .filter((a) => a && Number.isInteger(Number(a.city_id)) && Number(a.city_id) > 0)
    .map((a) => ({ city_id: Number(a.city_id), name: String(a.name ?? ""), fee: Math.max(0, Number(a.fee) || 0) }));
}

/**
 * "In the salon / at home" is asked only when the store offers home visits (with at least one
 * area) and every chosen service can be done at home.
 */
export function homeChoiceOffered(
  settings: Pick<BookingPublicSettings, "home"> | null | undefined,
  services: Pick<BookingService, "id" | "at_home">[],
  selectedIds: number[],
): boolean {
  if (!settings?.home?.offered || homeAreas(settings).length === 0 || selectedIds.length === 0) return false;
  const byId = new Map(services.map((s) => [s.id, s]));
  return selectedIds.every((id) => byId.get(id)?.at_home === true);
}

/** Fee of the chosen area (0 when none is chosen or it is unknown). */
export function homeFee(areas: HomeArea[], cityId: number | null | undefined): number {
  return areas.find((a) => a.city_id === cityId)?.fee ?? 0;
}

export interface LocationChoice {
  location: BookingLocation;
  cityId: number | null;
  address: string;
}

export type LocationErrors = { area?: true; address?: true };

/** What is missing for a home visit (nothing for the salon). */
export function locationErrors(choice: LocationChoice, areas: HomeArea[]): LocationErrors {
  if (choice.location !== "home") return {};
  const errors: LocationErrors = {};
  if (!areas.some((a) => a.city_id === choice.cityId)) errors.area = true;
  const address = choice.address.trim();
  if (!address || address.length > MAX_ADDRESS_LENGTH) errors.address = true;
  return errors;
}

/** The location part of POST v1/booking. */
export function locationPayload(choice: LocationChoice): { location: BookingLocation; city_id?: number; address?: string } {
  if (choice.location !== "home" || choice.cityId === null) return { location: "salon" };
  return { location: "home", city_id: choice.cityId, address: choice.address.trim().slice(0, MAX_ADDRESS_LENGTH) };
}
