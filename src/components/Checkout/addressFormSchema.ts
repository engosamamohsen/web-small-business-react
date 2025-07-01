import { z } from "zod";

const addressFormSchema = z.object({
  governorate: z
    .any({
      required_error: "يرجى اختيار المحافظة",
    })

    .refine(
      (val: any) =>
        val?.value !== "" && val?.value !== null && val?.value !== undefined,
      {
        message: "يرجى اختيار المحافظة",
      },
    ),
  city: z
    .any({
      required_error: "يرجى اختيار المدينة",
    })
    .refine(
      (val: any) =>
        val?.value !== "" && val?.value !== null && val?.value !== undefined,
      {
        message: "يرجى اختيار المدينة",
      },
    ),
  branch_id: z
    .any({
      required_error: "يرجى اختيار الفرع",
    })
    .refine(
      (val: any) =>
        val?.value !== "" && val?.value !== null && val?.value !== undefined,
      {
        message: "يرجى اختيار الفرع",
      },
    ),
  name: z
    .string({
      required_error: "يرجى إدخال الاسم",
    })
    .min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
  email: z
    .string({
      required_error: "يرجى إدخال البريد الإلكتروني",
    })
    .email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string({
      required_error: "يرجى إدخال رقم الهاتف",
    })
    .length(11, "رقم الهاتف يجب أن يتكون من 11 رقم بالضبط")
    .refine(
      (val) => /^\d+$/.test(val),
      "رقم الهاتف يجب أن يحتوي على أرقام فقط",
    ),
  address: z
    .string({
      required_error: "يرجى إدخال العنوان",
    })
    .min(5, "العنوان يجب أن يحتوي على 5 أحرف على الأقل"),
  special_Sign: z
    .string({
      required_error: "يرجى إدخال علامة خاصة",
    })
    .min(2, "اسم علامة خاصة يجب أن يحتوي على حرفين على الأقل")
    .optional(),
  street: z
    .string({
      required_error: "يرجى إدخال اسم الشارع",
    })
    .min(2, "اسم الشارع يجب أن يحتوي على حرفين على الأقل"),
  building: z.string({
    required_error: "يرجى إدخال رقم المبنى",
  }),
  floor: z
    .string({
      required_error: "يرجى إدخال رقم الدور",
    })
    .refine(
      (val) => /^\d+$/.test(val),
      "رقم الدور يجب أن يتكون من رقم على الأقل",
    ),
  flat: z
    .string({
      required_error: "يرجى إدخال رقم الشقة",
    })
    .refine(
      (val) => /^\d+$/.test(val),
      "رقم الشقة يجب أن يتكون من رقم على الأقل",
    ),
});

type AddressFormSchemaType = z.infer<typeof addressFormSchema>;

const AddressFormSchemaDefaultValues: AddressFormSchemaType = {
  city: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  building: "" as any,
  street: "",
  special_Sign: "",
  floor: "" as any,
  flat: "" as any,
  governorate: "",
};

export {
  addressFormSchema,
  type AddressFormSchemaType,
  AddressFormSchemaDefaultValues,
};
