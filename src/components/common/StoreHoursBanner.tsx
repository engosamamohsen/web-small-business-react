import { Clock } from "lucide-react";
import { useStoreHours } from "@/hooks/useStoreHours";
import type { StoreHoursSetting } from "@/lib/store-hours";

/**
 * "We are closed now. We open tomorrow at 10:00." — a strip at the top of every page while
 * the store doesn't take website orders (opening hours, docs/talent-booking.md 4). Draws
 * nothing while the store is open, so the page looks exactly as before. Re-checked every
 * minute. Styles: .ct-hours-bar in src/styles/themes.css (theme tokens; neutral on Classic).
 */
export default function StoreHoursBanner({ hours, now }: { hours: StoreHoursSetting; now: string }) {
  const { closed, text } = useStoreHours(hours, now);
  if (!closed || !text) return null;

  return (
    <div className="ct-hours-bar" role="status">
      <Clock className="ct-hours-bar__icon" size={18} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
