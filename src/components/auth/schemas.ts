import { z } from "zod";

export const ResetPasswordSchema = z
    .object({
        new_password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
        new_password_confirmation: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
        message: "كلمات المرور غير متطابقة",
        path: ["new_password_confirmation"],
    });

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ForgotPasswordSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

// Aliases for compatibility
export const formSchema = ForgotPasswordSchema;
export const formSchemaDefaultValues = { email: "" };
export type FormSchemaType = ForgotPasswordSchemaType;
