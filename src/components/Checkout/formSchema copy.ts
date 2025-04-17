import { z } from "zod";

const addressSchema = z.discriminatedUnion("hasAddress", [
  z.object({
    hasAddress: z.literal(true),
    getAddress: z
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
  }),
  z.object({
    hasAddress: z.literal(false),
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
      .min(11, "رقم الهاتف يجب أن يتكون من 11 رقم على الأقل"),
    address: z
      .string({
        required_error: "يرجى إدخال العنوان",
      })
      .min(5, "العنوان يجب أن يحتوي على 5 أحرف على الأقل"),
    area: z
      .string({
        required_error: "يرجى إدخال المنطقة",
      })
      .min(2, "اسم المنطقة يجب أن يحتوي على حرفين على الأقل"),
    street: z
      .string({
        required_error: "يرجى إدخال اسم الشارع",
      })
      .min(2, "اسم الشارع يجب أن يحتوي على حرفين على الأقل"),
  }),
]);
const formSchema = z
  .object({
    desc: z.string().optional(),
  })
  .and(addressSchema);

type FormSchemaType = z.infer<typeof formSchema>;

const formSchemaDefaultValues: FormSchemaType = {
  hasAddress: false,
  city: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  area: "",
  street: "",
  desc: "",
};

export { formSchema, type FormSchemaType, formSchemaDefaultValues };

// import { z } from "zod";

// const formSchema = z
//   .object({
//     address: z.object({
//       label: z.string(),
//       value: z.number(),
//     }),
//     governorate: z
//       .object({
//         label: z.string(),
//         value: z.number(),
//       })
//       .optional(),
//     city: z
//       .object({
//         label: z.string(),
//         value: z.number(),
//       })
//       .optional(),
//     name: z.string(),
//   })
//   .refine(
//     (data) => {
//       // إذا لم يكن هناك عنوان، يجب أن يكون هناك محافظة ومدينة
//       if (!data.address) {
//         return data.governorate && data.city;
//       }
//       return true;
//     },
//     {
//       message: "يجب تحديد المحافظة والمدينة إذا لم يتم تحديد العنوان",
//     },
//   );

// type FormSchemaType = z.infer<typeof formSchema>;

// const formSchemaDefaultValues: FormSchemaType = {
//   address: {
//     label: "",
//     value: 0,
//   },
//   governorate: {
//     label: "",
//     value: 0,
//   },
//   city: {
//     label: "",
//     value: 0,
//   },
//   name: "",
// };

// export { formSchema, type FormSchemaType, formSchemaDefaultValues };
