import { z } from "zod";

const formSchema = z.object({
  desc: z.string().optional(),
  address: z
    .any({
      required_error: "يرجى اختيار عنوان",
    })

    .refine(
      (val: any) => val?.id !== "" && val?.id !== null && val?.id !== undefined,
      {
        message: "يرجى اختيار عنوان",
      },
    ),
  paymentMethod: z
    .any({
      required_error: "يرجى اختيار طريقة الدفع",
    })
    .refine(
      (val: any) => val?.paymentId !== "" && val?.paymentId !== null && val?.paymentId !== undefined,
      {
        message: "يرجى اختيار طريقة الدفع",
      },
    ),
});

type FormSchemaType = z.infer<typeof formSchema>;

const formSchemaDefaultValues: FormSchemaType = {
  desc: "",
  address: "",
  paymentMethod: "",
};

export { formSchema, type FormSchemaType, formSchemaDefaultValues };
