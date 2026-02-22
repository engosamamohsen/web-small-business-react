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
  branch_id: z.any().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const formSchemaDefaultValues: FormSchemaType = {
  desc: "",
  address: "",
  branch_id: "",
};

export { formSchema, type FormSchemaType, formSchemaDefaultValues };
