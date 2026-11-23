// ─── Words of the store reviews page (/reviews) ───────────────────────────────────────────────
//
// Laravel change: openspec/changes/store-reviews (talent-dashboard repo). Arabic first, English
// second; both objects have the same keys (checked by strings.test.ts). The page picks the
// language from ?lang=en (default Arabic, like the rest of the storefront).

export type ReviewsLang = "ar" | "en";

const ar = {
    dir: "rtl",
    otherLangName: "English",
    switchLang: "Switch to English",
    navLink: "آراء العملاء",

    title: "شاركنا رأيك",
    lead: "رأيك بيفرق معانا. قولنا تجربتك في دقيقة.",
    reviewsCount: (n: number) => (n === 1 ? "رأي واحد" : n === 2 ? "رأيين" : n <= 10 ? `${n} آراء` : `${n} رأي`),
    starsLabel: (n: number) => `${n} من 5 نجوم`,

    formTitle: "اكتب رأيك",
    formLead: "رقم موبايلك للمتجر بس، مش هيظهر لحد.",
    ratingLegend: "تقييمك",
    ratingHint: "اضغط على النجوم",
    name: "اسمك",
    namePlaceholder: "مثلاً: محمد أحمد",
    phone: "رقم الموبايل",
    phonePlaceholder: "01xxxxxxxxx",
    phoneHint: "للمتجر بس، مش هيتنشر.",
    message: "رأيك",
    messagePlaceholder: "احكي لنا عن تجربتك…",
    branch: "الفرع اللي زرته",
    branchPlaceholder: "اختار الفرع",
    branchFromReceipt: "اخترنا فرع الإيصال، وتقدر تغيّره.",
    send: "ابعت رأيك",
    sending: "جاري الإرسال…",
    sentTitle: "شكرًا لرأيك!",
    sentBody: "رأيك وصل للمتجر.",
    redirecting: "بنرجعك للمتجر…",
    backToStore: "ارجع للمتجر",

    homeTitle: "آراء عملائنا",
    homeCta: "شاركنا رأيك",
    footerLink: "شاركنا رأيك",

    errRating: "اختار عدد النجوم من 1 لـ 5.",
    errName: "اكتب اسمك (حرفين على الأقل).",
    errPhone: "اكتب رقم موبايل صحيح (من 8 لـ 15 رقم).",
    errMessage: "اكتب رأيك (3 حروف على الأقل).",
    errTooMany: "بعت آراء كتير النهارده. جرّب تاني بكرة.",
    errNetwork: "مفيش اتصال بالإنترنت. حاول تاني.",
    errUnknown: "حصلت مشكلة. حاول تاني بعد شوية.",
    errClosed: "المتجر مش بيستقبل آراء دلوقتي.",
    errBranch: "اختار الفرع اللي زرته.",
};

type Strings = { [K in keyof typeof ar]: (typeof ar)[K] extends (...args: infer A) => string ? (...args: A) => string : string };

const en: Strings = {
    dir: "ltr",
    otherLangName: "العربية",
    switchLang: "التحويل للعربية",
    navLink: "Reviews",

    title: "Share your feedback",
    lead: "Your opinion matters to us. Tell us about your visit in a minute.",
    reviewsCount: (n: number) => (n === 1 ? "1 review" : `${n} reviews`),
    starsLabel: (n: number) => `${n} out of 5 stars`,

    formTitle: "Write a review",
    formLead: "Your mobile number is for the store only and never shown.",
    ratingLegend: "Your rating",
    ratingHint: "Tap the stars",
    name: "Your name",
    namePlaceholder: "e.g. Mohamed Ahmed",
    phone: "Mobile number",
    phonePlaceholder: "01xxxxxxxxx",
    phoneHint: "For the store only, never published.",
    message: "Your review",
    messagePlaceholder: "Tell us about your experience…",
    branch: "The branch you visited",
    branchPlaceholder: "Choose a branch",
    branchFromReceipt: "We picked the branch on your receipt. You can change it.",
    send: "Send review",
    sending: "Sending…",
    sentTitle: "Thank you!",
    sentBody: "The store has your review.",
    redirecting: "Taking you back to the store…",
    backToStore: "Back to the store",

    homeTitle: "What our customers say",
    homeCta: "Share your feedback",
    footerLink: "Share your feedback",

    errRating: "Please choose 1 to 5 stars.",
    errName: "Please enter your name (at least 2 letters).",
    errPhone: "Please enter a valid mobile number (8 to 15 digits).",
    errMessage: "Please write your review (at least 3 letters).",
    errTooMany: "You have sent many reviews today. Please try again tomorrow.",
    errNetwork: "No internet connection. Please try again.",
    errUnknown: "Something went wrong. Please try again shortly.",
    errClosed: "The store is not taking reviews right now.",
    errBranch: "Please choose the branch you visited.",
};

export type ReviewsStrings = Strings;

export function reviewsStrings(lang: ReviewsLang): ReviewsStrings {
    return lang === "en" ? en : (ar as Strings);
}

export function pickReviewsLang(query: string | null | undefined): ReviewsLang {
    return query === "en" ? "en" : "ar";
}

/**
 * Link to the /reviews form in the given language, keeping a clean utm_source (e.g. `receipt`) and the receipt's
 * branch (only a preselect, the customer may change it).
 */
export function reviewsHref(lang: ReviewsLang, source?: string | null, branch?: number | null): string {
    const params = new URLSearchParams();
    if (lang === "en") params.set("lang", "en");
    if (source) params.set("utm_source", source);
    if (branch) params.set("branch", String(branch));
    const query = params.toString();
    return query ? `/reviews?${query}` : "/reviews";
}

/** The store's home page in the given language (the reviews strip follows ?lang=en). */
export function homeHref(lang: ReviewsLang): string {
    return lang === "en" ? "/?lang=en" : "/";
}

export const __STRING_SETS = { ar: ar as Strings, en };
