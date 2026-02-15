import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("يجب أن يكون عنوان البريد الإلكتروني صالحًا"),
  password: z
    .string()
    .min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const formSchemaDefaultValues: FormSchemaType = {
  email: "",
  password: "",
};

export { formSchema, type FormSchemaType, formSchemaDefaultValues };
