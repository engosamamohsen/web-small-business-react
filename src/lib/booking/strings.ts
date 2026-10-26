// ─── Booking strings (docs/talent-booking.md 5, phase D4) ────────────────────
//
// Every word the booking pages show lives here. v1 is Arabic only (D20); English later is
// one more object with the same keys, picked by `bookingStrings(lang)`.

export type BookingLang = "ar";

const ar = {
  navBook: "احجز موعد",
  navBookShort: "احجز",

  servicesTitle: "خدماتنا",
  servicesIntro: "اختار الخدمة واحجز ميعادك في دقيقة.",
  servicesEmpty: "مفيش خدمات متاحة للحجز دلوقتي.",
  otherCategory: "خدمات أخرى",
  book: "احجز",
  bookNow: "احجز الآن",
  details: "التفاصيل",
  price: "السعر",
  backToServices: "كل الخدمات",
  whereTitle: "فين؟",
  atSalon: "في المحل",
  atSalonHint: "تيجي المحل في ميعادك",
  atHome: "في البيت",
  atHomeHint: "المحل يبعتلك حد بعد ما يأكد",
  area: "المنطقة",
  areaPick: "اختار المنطقة",
  address: "العنوان بالتفصيل",
  addressPlaceholder: "الشارع، رقم العمارة، الدور، الشقة، علامة مميزة",
  homeFee: "رسوم الزيارة",
  free: "مجاناً",
  errArea: "اختار المنطقة.",
  errAddress: "اكتب العنوان بالتفصيل.",
  homeBadge: "متاح في البيت",
  homeVisit: "زيارة منزلية",
  place: "المكان",
  homePending: "طلبك وصل، المحل هيأكد ويبعتلك حد في الميعاد.",
  serviceNotFound: "الخدمة دي مش متاحة للحجز دلوقتي.",
  minutes: (n: number) => (n === 1 ? "دقيقة" : n === 2 ? "دقيقتين" : n <= 10 ? `${n} دقائق` : `${n} دقيقة`),
  hours: (h: number) => (h === 1 ? "ساعة" : h === 2 ? "ساعتين" : h <= 10 ? `${h} ساعات` : `${h} ساعة`),
  and: "و",
  currency: "جنيه",
  priceWas: "السعر قبل الخصم",

  unavailableTitle: "الحجز غير متاح حالياً",
  unavailableBody: "المحل مش بيستقبل حجوزات أونلاين دلوقتي. تقدر تتواصل معاه مباشرة.",
  backHome: "الرجوع للرئيسية",
  loadFailed: "حصلت مشكلة في التحميل. جرّب تاني بعد شوية.",
  retry: "حاول تاني",

  bookTitle: "احجز موعد",
  stepServices: "اختار الخدمة",
  stepServicesHint: "تقدر تختار أكتر من خدمة.",
  stepBranch: "اختار الفرع",
  stepDate: "اختار اليوم",
  today: "النهارده",
  tomorrow: "بكرة",
  nextWeek: "الأسبوع الجاي",
  stepTime: "اختار الساعة",
  morning: "صباحاً",
  evening: "مساءً",
  loadingTimes: "بندوّر على المواعيد المتاحة…",
  noTimes: "مفيش مواعيد فاضية في اليوم ده. جرّب يوم تاني.",
  pickServicesFirst: "اختار خدمة الأول عشان نعرض المواعيد.",
  stepContact: "بياناتك",
  name: "الاسم",
  phone: "رقم الموبايل",
  phonePlaceholder: "01xxxxxxxxx",
  notes: "ملاحظات (اختياري)",
  notesPlaceholder: "أي حاجة تحب المحل يعرفها",
  honeypot: "اترك هذا الحقل فارغاً",
  summary: "ملخص الحجز",
  total: "الإجمالي",
  duration: "المدة",
  servicesCount: (n: number) => (n === 1 ? "خدمة واحدة" : n === 2 ? "خدمتين" : `${n} خدمات`),
  totalNote: "السعر حسب الخدمات اللي اخترتها.",
  assignNote: "المحل هيختار الشخص المناسب لخدمتك.",
  confirm: "تأكيد الحجز",
  sending: "جاري الحجز…",

  errName: "اكتب اسمك.",
  errPhone: "اكتب رقم موبايل صحيح، مثلاً 01012345678.",
  errServices: "اختار خدمة واحدة على الأقل.",
  errTime: "اختار ساعة من المواعيد المتاحة.",
  errSlotTaken: "الميعاد ده اتحجز للتو. اختار من المواعيد اللي جنبه:",
  errTooMany: "حاولت كتير. استنى دقيقة وجرّب تاني.",
  errNetwork: "مفيش اتصال بالإنترنت أو السيرفر مش بيرد. جرّب تاني.",
  errUnknown: "حصلت مشكلة. جرّب تاني.",
  errOff: "الحجز غير متاح حالياً.",

  statusTitle: "تفاصيل الحجز",
  statusPending: "بانتظار تأكيد المحل",
  statusConfirmed: "تم تأكيد الحجز",
  statusCancelled: "الحجز اتلغى",
  statusCompleted: "تمت الخدمة",
  statusNoShow: "لم يتم الحضور",
  pendingHint: "هنبعتلك لما المحل يأكد. تقدر تتواصل معاه على واتساب.",
  when: "الميعاد",
  customer: "باسم",
  services: "الخدمات",
  cancel: "إلغاء الحجز",
  cancelling: "جاري الإلغاء…",
  cancelConfirm: "متأكد إنك عايز تلغي الحجز؟",
  cancelYes: "أيوه، الغي",
  cancelNo: "لا، ارجع",
  cancelled: "تم إلغاء الحجز.",
  tooLate: "مينفعش تلغي دلوقتي، الميعاد قرّب. كلّم المحل.",
  whatsapp: "أرسل الحجز على واتساب",
  whatsappHint: "ابعت تفاصيل الحجز للمحل على واتساب عشان يوصله على طول.",
  whatsappMessage: (when: string, name: string) => (name ? `مرحباً، أنا ${name}، بخصوص حجزي ${when}.` : `مرحباً، بخصوص حجزي ${when}.`),
  notFound: "مش لاقيين الحجز ده. اتأكد من اللينك.",
  myBookings: "حجوزاتي على الجهاز ده",
  bookAnother: "احجز موعد تاني",
  saved: "احتفظ باللينك ده عشان ترجع لحجزك.",
} as const;

export type BookingStrings = typeof ar;

const STRINGS: Record<BookingLang, BookingStrings> = { ar };

export function bookingStrings(lang: BookingLang = "ar"): BookingStrings {
  return STRINGS[lang] ?? ar;
}

/** Shortcut for the only language of v1. */
export const t = ar;
