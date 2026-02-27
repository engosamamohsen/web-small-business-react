"use client";

import { useProfileServices } from "@/hooks/profile/profile";
import PageLoader from "../PageLoader/PageLoader";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "@/lib/navigation";
import Image from "@/components/common/Image";

function Profile() {
  const { data, loading } = useProfileServices();
  const router = useRouter();
  if (loading) {
    return <PageLoader text="جاري تحميل الملف الشخصي" />;
  }

  if (!data) {
    return (
      <div className="p-4 text-center">
        <div className="mb-4 text-lg font-bold">
          لم يتم العثور على الملف الشخصي
        </div>
        <Button
          label="إنشاء ملف شخصي"
          icon="pi pi-user-edit"
          onClick={() => router.push("/profile/edit")}
          className="bg-[var(--main-color)] px-4 py-2 text-white"
        />
      </div>
    );
  }

  // Header with action buttons
  const header = (
    <div className="flex items-center justify-between pb-2">
      <h2 className="text-xl font-bold">الملف الشخصي</h2>
      <Button
        icon="pi pi-pencil"
        onClick={() => router.push("/profile/edit")}
        className="bg-[var(--main-color)] p-2 text-white"
        tooltip="تعديل الملف الشخصي"
        tooltipOptions={{ position: "bottom" }}
      />
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <Card className="mx-auto max-w-3xl shadow-md" header={header} dir="rtl">
        <div className="flex flex-col gap-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            {data.image_url ? (
              <div className="relative mx-auto h-[200px] w-[200px] overflow-hidden rounded-full">
                <Image
                  src={data.image_url}
                  alt={data.name ? `صورة الملف الشخصي لـ ${data.name}` : "صورة الملف الشخصي"}
                  width={200}
                  height={200}
                  className="h-[200px] min-h-[200px] w-[200px] rounded-full border object-cover"
                />
              </div>
            ) : (
              <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full bg-gray-200 text-4xl text-gray-500">
                <i className="pi pi-user"></i>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <i className="pi pi-user text-[var(--main-color)]"></i>
                <div className="font-semibold">الاسم</div>
              </div>
              <div className="text-lg">{data.name || "--"}</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <i className="pi pi-envelope text-[var(--main-color)]"></i>
                <div className="font-semibold">البريد الإلكتروني</div>
              </div>
              <div className="text-lg">{data.email || "--"}</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <i className="pi pi-phone text-[var(--main-color)]"></i>
                <div className="font-semibold">رقم الهاتف</div>
              </div>
              <div className="text-lg">{data.phone || "--"}</div>
            </div>

            {/* Additional profile info can be added here */}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
