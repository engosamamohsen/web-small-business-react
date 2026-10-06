"use client";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import "@/styles/primereact-theme";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { $api } from "@/client";
import { cn } from "@/utils/utils";

const LABELS = ["", "سيئ", "مقبول", "جيد", "جيد جداً", "ممتاز"];

/** Stars only (read-only): a rated order in the list. */
export function RatingStars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`التقييم ${value} من 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/**
 * Rate a delivered order: 1–5 stars and an optional comment (POST v1/ratings/submit).
 * The store sees it in its panel (Ratings). One rating per order.
 */
export default function RateOrderDialog({
  orderId,
  visible,
  onHide,
  onRated,
}: {
  orderId: number;
  visible: boolean;
  onHide: () => void;
  onRated: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [sending, setSending] = useState(false);
  const shown = hover || rating;

  const submit = async () => {
    if (!rating) {
      toast.error("اختر عدد النجوم أولاً", { rtl: true });
      return;
    }
    setSending(true);
    try {
      const { data } = await $api.post("v1/ratings/submit", { order_id: orderId, rating, review: review.trim() || null });
      toast.success(data?.message || "شكراً لتقييمك", { rtl: true });
      onRated();
      onHide();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "تعذر إرسال التقييم، حاول مرة أخرى", { rtl: true });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`قيّم الطلب #${orderId}`}
      dismissableMask
      draggable={false}
      className="w-[min(92vw,440px)]"
      contentClassName="!pb-5"
    >
      <div className="flex flex-col items-center gap-4 text-right" dir="rtl">
        <p className="text-sm text-gray-500">كيف كانت تجربتك مع هذا الطلب؟</p>

        <div className="flex flex-row-reverse items-center gap-1" role="radiogroup" aria-label="عدد النجوم">
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} من 5 — ${LABELS[n]}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="rounded-lg p-1.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-color)]"
            >
              <Star className={cn("h-9 w-9", n <= shown ? "fill-amber-400 text-amber-400" : "text-gray-300")} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="h-5 text-sm font-semibold text-gray-700" aria-live="polite">{LABELS[shown]}</p>

        <label htmlFor={`review-${orderId}`} className="w-full text-sm font-medium text-gray-700">
          تعليقك <span className="text-gray-400">(اختياري)</span>
        </label>
        <textarea
          id={`review-${orderId}`}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="اكتب رأيك في الطلب والخدمة…"
          className="-mt-2 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm focus:border-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]/20"
        />

        <button
          type="button"
          onClick={submit}
          disabled={sending}
          className="w-full rounded-xl bg-[var(--main-color)] py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {sending ? "جارٍ الإرسال…" : "إرسال التقييم"}
        </button>
      </div>
    </Dialog>
  );
}
