import { z } from "zod";

// Schema for initial email form
export const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صالح" }),
});

export type FormSchemaType = z.infer<typeof formSchema>;

export const formSchemaDefaultValues: FormSchemaType = {
  email: "",
};

// Schema for reset password form
export const resetPasswordSchema = z
  .object({
    email: z.string(),
    otp: z.string(),
    new_password: z
      .string()
      .min(8, { message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف" }),
    new_password_confirmation: z
      .string()
      .min(1, { message: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["new_password_confirmation"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const resetPasswordDefaultValues: ResetPasswordSchemaType = {
  otp: "",
  new_password: "",
  new_password_confirmation: "",
  email: "",
};
