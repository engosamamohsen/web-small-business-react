import { z } from "zod";

// Required: name, phone, governorate, city and the street address. Building, floor, flat,
// landmark and email are optional; the branch comes from the city on the server.
const selected = (message: string) =>
  z
    .any({ required_error: message })
    .refine(
      (val: any) =>
        val?.value !== "" && val?.value !== null && val?.value !== undefined,
      { message },
    );

const optionalNumber = (message: string) =>
  z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), message);

const addressFormSchema = z.object({
  governorate: selected("يرجى اختيار المحافظة"),
  city: selected("يرجى اختيار المدينة أو المنطقة"),
  name: z
    .string({ required_error: "يرجى إدخال الاسم" })
    .trim()
    .min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
  phone: z
    .string({ required_error: "يرجى إدخال رقم الهاتف" })
    .trim()
    .regex(
      /^01[0125]\d{8}$/,
      "رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015",
    ),
  street: z
    .string({ required_error: "يرجى إدخال العنوان" })
    .trim()
    .min(3, "اكتب الشارع والمنطقة"),
  building: z.string().optional(),
  floor: optionalNumber("رقم الدور يكون أرقاماً فقط"),
  flat: optionalNumber("رقم الشقة يكون أرقاماً فقط"),
  special_Sign: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "البريد الإلكتروني غير صحيح",
    ),
});

type AddressFormSchemaType = z.infer<typeof addressFormSchema>;

const AddressFormSchemaDefaultValues: AddressFormSchemaType = {
  governorate: "",
  city: "",
  name: "",
  phone: "",
  street: "",
  building: "",
  floor: "",
  flat: "",
  special_Sign: "",
  email: "",
};

export {
  addressFormSchema,
  type AddressFormSchemaType,
  AddressFormSchemaDefaultValues,
};
