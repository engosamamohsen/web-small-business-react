// Shapes of the public booking API (Laravel app/Http/Controllers/API/V1/BookingController.php).

export interface BookingCategory {
  id: number;
  name: string;
}

export interface BookingService {
  id: number;
  category_id: number | null;
  name: string;
  description?: string | null;
  price: number;
  sale_price: number | null;
  duration_minutes: number;
  branch_ids: number[];
  /** "91-قص-شعر": the service page is /services/<slug> (only the leading id counts). */
  slug?: string | null;
  /** Can be done at the customer's home (home visits). */
  at_home?: boolean;
}

export type BookingLocation = "salon" | "home";

export interface HomeArea {
  city_id: number;
  name: string;
  fee: number;
}

/** settings.home: home visits (the store sends someone after accepting). */
export interface HomeVisitSettings {
  offered: boolean;
  travel_minutes: number;
  areas: HomeArea[];
}

/** GET v1/booking/services/{slug}: one bookable service, for its own page. */
export interface BookingServiceDetail {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number;
  sale_price: number | null;
  duration_minutes: number;
  branch_ids: number[];
  updated_at?: string | null;
  at_home?: boolean;
}

export interface BookingBranch {
  id: number;
  name: string;
}

export interface BookingPublicSettings {
  slot_step_minutes: number;
  max_days_ahead: number;
  min_notice_minutes: number;
  cancel_until_minutes: number;
  auto_confirm: boolean;
  branches: BookingBranch[];
  home?: HomeVisitSettings;
}

export interface BookingCatalog {
  categories: BookingCategory[];
  services: BookingService[];
  settings: BookingPublicSettings;
}

export interface SlotsResult {
  date: string;
  times: string[];
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | string;

export interface AppointmentView {
  token: string;
  status: AppointmentStatus;
  status_label?: string;
  starts_at: string;
  ends_at: string;
  branch_id: number | null;
  customer_name: string;
  services: { name: string; price: number; duration_minutes: number }[];
  /** Includes home_fee. */
  total: number;
  can_cancel: boolean;
  location?: BookingLocation | string;
  address?: string | null;
  home_fee?: number;
}

export interface BookingRequest {
  service_ids: number[];
  branch_id?: number | null;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  notes?: string;
  location?: BookingLocation;
  /** Home visits only: one of settings.home.areas, and the address. */
  city_id?: number | null;
  address?: string;
  /** Honeypot: always empty from a person. */
  website: string;
}

/** POST v1/booking 201 → top-level `whatsapp`: the booking sent to the store's WhatsApp (free wa.me flow). */
export interface BookingWhatsApp {
  number: string;
  message: string;
  url: string;
}

/** `setting-profile` → `booking`. */
export interface BookingSetting {
  enabled: boolean;
}
