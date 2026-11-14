// ─── Words of the carrier site (shipping company public site, phase 3) ───────────────────────────
//
// Arabic first, English second; both objects have the same keys (checked by strings.test.ts).
// The company's own texts (welcome, after booking, booking soon) come from its profile instead.

import type { Bilingual, CarrierLang } from "./types";

const ar = {
    dir: "rtl",
    langName: "العربية",
    otherLangName: "English",
    switchLang: "Switch to English",

    navHome: "الرئيسية",
    navShip: "أرسل شحنة",
    navTrack: "تتبع شحنة",
    skipToContent: "تخطَّ إلى المحتوى",

    // Home
    sendShipment: "أرسل شحنة",
    trackTitle: "تتبع شحنتك",
    trackHint: "اكتب رقم التتبع اللي وصلك عند الحجز.",
    trackNumber: "رقم التتبع",
    trackPlaceholder: "اكتب رقم التتبع هنا",
    trackButton: "تتبع",
    areasTitle: "المحافظات اللي بنخدمها",
    areasEmpty: "اتصل بنا لمعرفة المناطق اللي بنخدمها.",
    contactTitle: "تواصل معنا",
    call: "اتصال",
    whatsapp: "واتساب",
    howTitle: "إزاي تبعت شحنتك",
    how1: "املأ بيانات الراسل والمستلم والشحنة.",
    how2: "الشركة تتصل بيك لتأكيد السعر وميعاد الاستلام.",
    how3: "تابع شحنتك برقم التتبع لحد ما توصل.",
    bookingClosedTitle: "الحجز أونلاين قريباً",

    // Booking form
    shipTitle: "أرسل شحنة",
    shipIntro: "املأ البيانات وهنتواصل معاك لتأكيد السعر وميعاد الاستلام.",
    stepSender: "الراسل",
    stepRecipient: "المستلم",
    stepParcel: "الشحنة",
    stepReview: "المراجعة",
    stepOf: (n: number, total: number) => `خطوة ${n} من ${total}`,
    next: "التالي",
    back: "رجوع",
    edit: "تعديل",
    submit: "أرسل الطلب",
    sending: "جاري الإرسال…",
    required: "مطلوب",
    optional: "اختياري",

    senderName: "اسم الراسل",
    senderPhone: "موبايل الراسل",
    recipientName: "اسم المستلم",
    recipientPhone: "موبايل المستلم",
    recipientPhone2: "موبايل تاني للمستلم",
    governorate: "المحافظة",
    governoratePick: "اختار المحافظة",
    area: "المنطقة / الحي",
    address: "العنوان بالتفصيل",
    addressPlaceholder: "الشارع، رقم العمارة، الدور، الشقة، علامة مميزة",
    pickupNotes: "ملاحظات للاستلام",
    deliveryNotes: "ملاحظات للتسليم",
    phonePlaceholder: "01xxxxxxxxx",

    category: "نوع الشحنة",
    description: "وصف المحتوى",
    descriptionPlaceholder: "مثال: فستانين",
    packages: "عدد الطرود",
    weight: "الوزن التقريبي (كجم)",
    moreDetails: "تفاصيل إضافية",
    length: "الطول (سم)",
    width: "العرض (سم)",
    height: "الارتفاع (سم)",
    declaredValue: "قيمة المحتوى",
    specialHandling: "تعامل خاص",
    specialHandlingPlaceholder: "مثال: قابل للكسر",
    cod: "مبلغ التحصيل عند التسليم",
    codHint: "المبلغ اللي المندوب يحصّله من المستلم. اتركه فاضي لو مفيش تحصيل.",
    whoPays: "مين يدفع الشحن؟",
    preferredDate: "ميعاد التسليم المفضّل",
    notes: "ملاحظات للشركة",
    noPriceNote: "السعر النهائي هتأكده الشركة معاك بالتليفون قبل الاستلام.",

    reviewTitle: "راجع طلبك",
    reviewFrom: "من",
    reviewTo: "إلى",
    reviewParcel: "الشحنة",
    securityChecking: "جاري فحص الأمان…",
    securityReady: "تم فحص الأمان",
    securityFailed: "فحص الأمان فشل. اضغط لإعادة المحاولة.",
    retry: "حاول تاني",
    reload: "تحديث الصفحة",

    // Success
    bookedTitle: "طلبك وصل!",
    bookedNumber: "رقم التتبع",
    copy: "نسخ",
    copied: "اتنسخ",
    shareWhatsapp: "شارك على واتساب",
    shareText: (company: string, number: string, url: string) =>
        `شحنتي مع ${company}: رقم التتبع ${number}\nتتبعها من هنا: ${url}`,
    trackNow: "تتبع الشحنة",
    anotherShipment: "أرسل شحنة تانية",

    // Tracking
    trackPageTitle: "تتبع شحنة",
    trackNotFound: "مفيش شحنة بالرقم ده. اتأكد من الرقم وحاول تاني.",
    trackBadNumber: "رقم التتبع لازم يكون من 6 لـ 32 حرف أو رقم.",
    currentStatus: "الحالة الحالية",
    from: "من",
    to: "إلى",
    expected: "التسليم المتوقع",
    bookedOn: "تاريخ الطلب",
    timelineTitle: "خط سير الشحنة",
    detailsTitle: "تفاصيل أكثر",
    detailsHint: "اكتب آخر 4 أرقام من موبايل الراسل أو أي موبايل للمستلم.",
    last4: "آخر 4 أرقام",
    showDetails: "اعرض التفاصيل",
    detailsWrong: "الأرقام مش مطابقة.",
    detailsShort: "اكتب 4 أرقام.",
    detailsNoScript: "شغّل JavaScript في المتصفح علشان تشوف التفاصيل. الخط الزمني ظاهر عادي.",
    detailsLocked: "محاولات كتير غلط من الجهاز ده. التفاصيل مقفولة عليه لمدة ساعة، والخط الزمني ظاهر عادي.",
    detailsLockedAll: "علشان أمان الشحنة، التفاصيل مخفية مؤقتًا بعد محاولات كتير غلط. الخط الزمني ظاهر عادي، ولو محتاج مساعدة كلّم الشركة.",
    detailsUnavailable: "مش ممكن نعرض التفاصيل دلوقتي. الخط الزمني ظاهر عادي.",
    detailsChecking: "بنتأكد من الطلب…",
    senderFirst: "الراسل",
    recipientFirst: "المستلم",
    codDue: "مبلغ التحصيل",
    noCod: "لا يوجد",

    // Errors
    errRequired: "الحقل ده مطلوب.",
    errPhone: "اكتب رقم موبايل صحيح، مثل 01012345678.",
    errNumber: "اكتب رقم صحيح.",
    errPackages: "عدد الطرود من 1 لـ 999.",
    errTooLong: (max: number) => `الحد الأقصى ${max} حرف.`,
    errGovernorate: "اختار محافظة من المحافظات اللي بنخدمها.",
    errCodRequired: "اكتب مبلغ التحصيل لو الشحن هيتخصم منه.",
    errDatePast: "اختار تاريخ من النهارده أو بعده.",
    errDateFar: "اختار تاريخ خلال 90 يوم.",
    errNetwork: "مفيش اتصال. اتأكد من الإنترنت وحاول تاني.",
    errServer: "حصلت مشكلة عندنا. حاول تاني بعد شوية.",
    errFixFields: "راجع الحقول اللي عليها ملاحظات.",

    notFoundTitle: "الصفحة مش موجودة",
    notFoundBody: "الرابط ده مش موجود. تقدر ترجع للرئيسية أو تتبع شحنتك.",
    poweredBy: "بواسطة CashierThru",
    needsJs: "نموذج الحجز محتاج JavaScript. فعّله في المتصفح أو اتصل بينا.",
} as const;

type Strings = { [K in keyof typeof ar]: (typeof ar)[K] extends (...args: infer A) => string ? (...args: A) => string : string };

const en: Strings = {
    dir: "ltr",
    langName: "English",
    otherLangName: "العربية",
    switchLang: "التحويل إلى العربية",

    navHome: "Home",
    navShip: "Send a shipment",
    navTrack: "Track",
    skipToContent: "Skip to content",

    sendShipment: "Send a shipment",
    trackTitle: "Track your shipment",
    trackHint: "Type the tracking number you got when you booked.",
    trackNumber: "Tracking number",
    trackPlaceholder: "Type the tracking number",
    trackButton: "Track",
    areasTitle: "Governorates we serve",
    areasEmpty: "Call us to find out which areas we serve.",
    contactTitle: "Contact us",
    call: "Call",
    whatsapp: "WhatsApp",
    howTitle: "How it works",
    how1: "Fill in the sender, recipient and parcel details.",
    how2: "The company calls you to confirm the price and pickup time.",
    how3: "Follow your shipment with its tracking number until it arrives.",
    bookingClosedTitle: "Online booking opens soon",

    shipTitle: "Send a shipment",
    shipIntro: "Fill in the details and we will call you to confirm the price and pickup time.",
    stepSender: "Sender",
    stepRecipient: "Recipient",
    stepParcel: "Parcel",
    stepReview: "Review",
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    next: "Next",
    back: "Back",
    edit: "Edit",
    submit: "Send request",
    sending: "Sending…",
    required: "Required",
    optional: "Optional",

    senderName: "Sender name",
    senderPhone: "Sender mobile",
    recipientName: "Recipient name",
    recipientPhone: "Recipient mobile",
    recipientPhone2: "Recipient second mobile",
    governorate: "Governorate",
    governoratePick: "Choose a governorate",
    area: "Area / district",
    address: "Full address",
    addressPlaceholder: "Street, building, floor, flat, landmark",
    pickupNotes: "Pickup notes",
    deliveryNotes: "Delivery notes",
    phonePlaceholder: "01xxxxxxxxx",

    category: "Shipment type",
    description: "What is inside",
    descriptionPlaceholder: "e.g. two dresses",
    packages: "Number of parcels",
    weight: "Approximate weight (kg)",
    moreDetails: "More details",
    length: "Length (cm)",
    width: "Width (cm)",
    height: "Height (cm)",
    declaredValue: "Value of the contents",
    specialHandling: "Special handling",
    specialHandlingPlaceholder: "e.g. fragile",
    cod: "Cash to collect on delivery",
    codHint: "What the courier collects from the recipient. Leave it empty if there is nothing to collect.",
    whoPays: "Who pays for shipping?",
    preferredDate: "Preferred delivery date",
    notes: "Notes for the company",
    noPriceNote: "The company confirms the final price with you by phone before pickup.",

    reviewTitle: "Check your request",
    reviewFrom: "From",
    reviewTo: "To",
    reviewParcel: "Parcel",
    securityChecking: "Running the security check…",
    securityReady: "Security check done",
    securityFailed: "The security check failed. Tap to try again.",
    retry: "Try again",
    reload: "Reload the page",

    bookedTitle: "Request received!",
    bookedNumber: "Tracking number",
    copy: "Copy",
    copied: "Copied",
    shareWhatsapp: "Share on WhatsApp",
    shareText: (company: string, number: string, url: string) =>
        `My shipment with ${company}: tracking number ${number}\nTrack it here: ${url}`,
    trackNow: "Track the shipment",
    anotherShipment: "Send another shipment",

    trackPageTitle: "Track a shipment",
    trackNotFound: "No shipment has this number. Check it and try again.",
    trackBadNumber: "A tracking number has 6 to 32 letters or digits.",
    currentStatus: "Current status",
    from: "From",
    to: "To",
    expected: "Expected delivery",
    bookedOn: "Requested on",
    timelineTitle: "Shipment history",
    detailsTitle: "More details",
    detailsHint: "Type the last 4 digits of the sender's mobile or either of the recipient's mobiles.",
    last4: "Last 4 digits",
    showDetails: "Show details",
    detailsWrong: "Those digits don't match.",
    detailsShort: "Type 4 digits.",
    detailsNoScript: "Turn on JavaScript in your browser to see the details. The history stays visible.",
    detailsLocked: "Too many wrong tries from this device. The details are locked here for an hour; the history stays visible.",
    detailsLockedAll: "To keep this shipment safe, its details are hidden for now after many wrong tries. The history stays visible; call the company if you need help.",
    detailsUnavailable: "The details can't be shown right now. The history stays visible.",
    detailsChecking: "Checking the request…",
    senderFirst: "Sender",
    recipientFirst: "Recipient",
    codDue: "Cash to collect",
    noCod: "None",

    errRequired: "This field is required.",
    errPhone: "Type a valid mobile number, such as 01012345678.",
    errNumber: "Type a valid number.",
    errPackages: "Between 1 and 999 parcels.",
    errTooLong: (max: number) => `At most ${max} characters.`,
    errGovernorate: "Choose one of the governorates we serve.",
    errCodRequired: "Type the cash to collect when shipping is taken from it.",
    errDatePast: "Choose today or a later date.",
    errDateFar: "Choose a date within 90 days.",
    errNetwork: "No connection. Check your internet and try again.",
    errServer: "Something went wrong on our side. Please try again shortly.",
    errFixFields: "Check the fields marked below.",

    notFoundTitle: "Page not found",
    notFoundBody: "This link doesn't exist. Go back home or track your shipment.",
    poweredBy: "Powered by CashierThru",
    needsJs: "The booking form needs JavaScript. Turn it on in your browser or call us.",
};

const STRINGS: Record<CarrierLang, Strings> = { ar: ar as unknown as Strings, en };

export type CarrierStrings = Strings;

export function carrierStrings(lang: CarrierLang): CarrierStrings {
    return STRINGS[lang] ?? STRINGS.ar;
}

/** Cookie that remembers the visitor's language on a carrier site. */
export const CARRIER_LANG_COOKIE = "ct_ship_lang";

export function isCarrierLang(value: unknown): value is CarrierLang {
    return value === "ar" || value === "en";
}

/** ?lang= wins (and is remembered), then the cookie, then Arabic. */
export function pickCarrierLang(query: string | null, cookie: string | undefined): CarrierLang {
    if (isCarrierLang(query)) return query;
    if (isCarrierLang(cookie)) return cookie;
    return "ar";
}

/** One of the company's bilingual texts, falling back to the other language when one is empty. */
export function pickText(text: Bilingual | null | undefined, lang: CarrierLang): string {
    if (!text) return "";
    const own = (text[lang] ?? "").trim();
    return own || (text[lang === "ar" ? "en" : "ar"] ?? "").trim();
}

/** Label of an option or governorate in the visitor's language. */
export function optionLabel(option: { label_ar?: string; label_en?: string; name_ar?: string; name_en?: string }, lang: CarrierLang): string {
    return lang === "en"
        ? option.label_en || option.name_en || option.label_ar || option.name_ar || ""
        : option.label_ar || option.name_ar || option.label_en || option.name_en || "";
}

/** For tests: both languages define every key. */
export const __STRING_SETS = { ar: ar as unknown as Strings, en };
