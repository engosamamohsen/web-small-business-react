"use client";

import React, { useState, useRef, useEffect } from "react";
import { useProfileServices, useProfileUpdate } from "@/hooks/profile/profile";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import PageLoader from "@/components/PageLoader/PageLoader";
import { z } from "zod";

const ProfileFormSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string({
      required_error: "يرجى إدخال رقم الهاتف",
    })
    .length(11, "رقم الهاتف يجب أن يتكون من 11 رقم بالضبط")
    .refine(
      (val) => /^\d+$/.test(val),
      "رقم الهاتف يجب أن يحتوي على أرقام فقط",
    ),
});

// Define TypeScript type from Zod schema
type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

function ProfileEditPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileUploadRef = useRef<any>(null);
  const router = useRouter();

  // Function to trigger file input click
  const triggerFileUpload = () => {
    if (fileUploadRef.current) {
      // Find the hidden input element within the FileUpload component
      const inputEl =
        fileUploadRef.current.getInput?.() ||
        fileUploadRef.current.input ||
        fileUploadRef.current.querySelector?.('input[type="file"]');
      if (inputEl) {
        inputEl.click();
      }
    }
  };

  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Fetch user profile data
  const { data: profileData, loading } = useProfileServices();
  const { updateProfile } = useProfileUpdate();

  useEffect(() => {
    // Set initial form values when data is loaded
    if (profileData) {
      reset({
        name: profileData.name || "",
        phone: profileData.phone || "",
      });

      if (profileData.image_url) {
        setImagePreview(profileData.image_url || null);
      }
    }
  }, [profileData, reset]);

  const handleImageChange = (e: any) => {
    if (e.files && e.files.length > 0) {
      const file = e.files[0];
      setImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await updateProfile({
        name: data.name,
        phone: data.phone,
        image,
      });

      if (result.success) {
        router.push("/profile");
      } else {
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormErrorMessage = (name: keyof ProfileFormValues) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : null;
  };

  if (loading) {
    return <PageLoader text="جاري تحميل الملف الشخصي" />;
  }

  return (
    <div className="p-4 md:p-6">
      <Card
        title="تعديل الملف الشخصي"
        className="mx-auto max-w-3xl shadow-md"
        dir="rtl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-1 flex-col gap-4">
              <label className="text-sm font-medium">صورة الملف الشخصي</label>
              <div className="flex flex-col items-stretch gap-4 md:items-stretch">
                <div className="flex-1">
                  <FileUpload
                    ref={fileUploadRef}
                    mode="basic"
                    name="profile-image"
                    accept="image/*"
                    maxFileSize={1000000}
                    className="hidden"
                    chooseLabel="اختر صورة"
                    onSelect={handleImageChange}
                    auto
                  />
                </div>
                {imagePreview && (
                  <div
                    className="relative mx-auto h-[200px] w-[200px] cursor-pointer overflow-hidden rounded-full"
                    onClick={triggerFileUpload}
                    title="انقر لتغيير الصورة"
                  >
                    <Image
                      src={imagePreview}
                      alt="معاينة الصورة الشخصية"
                      width="200"
                      preview
                      className="h-[200px] w-[200px] rounded-full border"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 transition-opacity hover:opacity-100">
                      <span className="rounded bg-white bg-opacity-70 px-2 py-1 text-sm">
                        تغيير الصورة
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full flex-1 flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">
                  الاسم
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "الاسم مطلوب" }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={classNames(
                          "w-full rounded-md border border-gray-400 px-2 py-3",
                          {
                            "p-invalid": fieldState.error,
                          },
                        )}
                        placeholder="أدخل اسمك"
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm font-medium">
                  رقم الهاتف
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "رقم الهاتف مطلوب",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "يجب أن يكون رقم الهاتف من 10 إلى 15 رقم",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={classNames(
                          "w-full rounded-md border border-gray-400 px-2 py-3",
                          {
                            "p-invalid": fieldState.error,
                          },
                        )}
                        placeholder="أدخل رقم هاتفك"
                        type="tel"
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full justify-between gap-3">
            <Button
              type="button"
              label="إلغاء"
              severity="secondary"
              text
              onClick={() => router.push("/profile")}
              disabled={isSubmitting}
              className="gap-2 bg-gray-400 px-3 py-3 text-white"
            />
            <Button
              type="submit"
              label="حفظ"
              icon="pi pi-check"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="gap-2 bg-[var(--main-color)] px-3 py-3 text-white"
            />
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfileEditPage;
