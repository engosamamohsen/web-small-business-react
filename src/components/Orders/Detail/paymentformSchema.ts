import { z } from "zod";

const paymentFormSchema = z.object({
  paymentMethod: z
    .any({
      required_error: "يرجى اختيار طريقة الدفع",
    })
    .refine(
      (val: any) =>
        val?.paymentId !== "" &&
        val?.paymentId !== null &&
        val?.paymentId !== undefined,
      {
        message: "يرجى اختيار طريقة الدفع",
      },
    ),
});

type PaymentFormSchemaType = z.infer<typeof paymentFormSchema>;

const paymentFormSchemaDefaultValues: PaymentFormSchemaType = {
  paymentMethod: "",
};

export {
  paymentFormSchema,
  type PaymentFormSchemaType,
  paymentFormSchemaDefaultValues,
};
