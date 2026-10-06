"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Pencil, MapPin, Plus, Trash2, Star, ClipboardList, LogOut } from "lucide-react";
import { useProfileServices, useProfileUpdate } from "@/hooks/profile/profile";
import { useAddressBook, useGetAddress, type SavedAddress } from "@/hooks/addressHook";
import PageLoader from "../PageLoader/PageLoader";
import Image from "@/components/common/Image";
import DialogAddressForm from "@/components/Checkout/DialogAddressForm";
import { cn } from "@/utils/utils";

// My account (full e-commerce plans): profile details, saved addresses, orders, sign out.

function ProfileCard({ data, onSaved }: { data: any; onSaved: () => void }) {
  const { updateProfile } = useProfileUpdate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState<string>(data?.name ?? "");
  const [phone, setPhone] = useState<string>(data?.phone ?? "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile({ name: name.trim(), phone: phone.trim() });
    setSaving(false);
    if (result.success) {
      setEditing(false);
      onSaved();
    }
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6" aria-labelledby="account-details">
      <div className="flex items-center justify-between gap-3">
        <h2 id="account-details" className="text-lg font-semibold text-gray-900">بياناتي</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[var(--main-color)]"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" /> تعديل
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-2xl text-gray-500">
          {data?.image_url ? (
            <Image src={data.image_url} alt="" width={80} height={80} className="h-20 w-20 object-cover" />
          ) : (
            <span aria-hidden="true">{(data?.name || "?").charAt(0)}</span>
          )}
        </div>

        {editing ? (
          <form onSubmit={save} className="grid flex-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              الاسم
              <input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              رقم الهاتف
              <input
                id="profile-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                inputMode="tel"
                pattern="01[0125][0-9]{8}"
                title="رقم مصري من 11 رقمًا يبدأ بـ 010 أو 011 أو 012 أو 015"
                dir="ltr"
                className="rounded-lg border border-gray-300 px-3 py-2 text-right"
              />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" disabled={saving} className="rounded-lg bg-[var(--main-color)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "جارٍ الحفظ…" : "حفظ"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700">
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid flex-1 gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-gray-500">الاسم</dt>
              <dd className="font-medium text-gray-900">{data?.name || "—"}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-gray-500">البريد الإلكتروني</dt>
              <dd className="break-words font-medium text-gray-900">{data?.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">رقم الهاتف</dt>
              <dd className="font-medium text-gray-900" dir="ltr">{data?.phone || "—"}</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}

function AddressCard({
  address,
  busy,
  onEdit,
  onDelete,
  onDefault,
}: {
  address: SavedAddress;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDefault: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <li className={cn("rounded-xl border p-4", address.is_default ? "border-[var(--main-color)] bg-[var(--main-color)]/5" : "border-gray-200")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="font-medium text-gray-900">
            {address.city_name}، {address.area_name}
            {address.is_default && (
              <span className="ms-2 rounded-full bg-[var(--main-color)] px-2 py-0.5 text-xs font-semibold text-white">الافتراضي</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            شارع {address.street}، عمارة {address.building}، الدور {address.floor}، شقة {address.flat}
          </p>
          {address.special_sign && address.special_sign !== "-" && (
            <p className="text-sm text-gray-600">علامة مميزة: {address.special_sign}</p>
          )}
          <p className="text-sm text-gray-600" dir="ltr">{address.phone}</p>
        </div>
        <MapPin className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
      </div>

      {confirmDelete ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-red-50 p-2 text-sm text-red-800">
          <span>حذف هذا العنوان؟</span>
          <button type="button" disabled={busy} onClick={onDelete} className="rounded-md bg-red-600 px-3 py-1 font-semibold text-white disabled:opacity-60">
            حذف
          </button>
          <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700">
            تراجع
          </button>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-[var(--main-color)]">
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> تعديل
          </button>
          {!address.is_default && (
            <button type="button" disabled={busy} onClick={onDefault} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-[var(--main-color)] disabled:opacity-60">
              <Star className="h-3.5 w-3.5" aria-hidden="true" /> اجعله الافتراضي
            </button>
          )}
          <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> حذف
          </button>
        </div>
      )}
    </li>
  );
}

function AddressBook() {
  const { value: addresses, loading, retry } = useGetAddress();
  const { deleteAddress, makeDefault, loading: busy } = useAddressBook();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SavedAddress | null>(null);

  const list: SavedAddress[] = Array.isArray(addresses) ? addresses : [];

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <section id="addresses" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6" aria-labelledby="account-addresses">
      <div className="flex items-center justify-between gap-3">
        <h2 id="account-addresses" className="text-lg font-semibold text-gray-900">عناويني</h2>
        <button type="button" onClick={openNew} className="inline-flex items-center gap-1 rounded-lg bg-[var(--main-color)] px-3 py-1.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" aria-hidden="true" /> إضافة عنوان
        </button>
      </div>

      {loading && !list.length ? (
        <p className="mt-4 text-sm text-gray-500">جارٍ تحميل العناوين…</p>
      ) : list.length === 0 ? (
        <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          لم تضف أي عنوان بعد. أضف عنوانك ليظهر تلقائيًا عند إتمام الطلب.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {list.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              busy={busy}
              onEdit={() => {
                setEditing(address);
                setDialogOpen(true);
              }}
              onDelete={async () => {
                await deleteAddress(address.id);
                retry();
              }}
              onDefault={async () => {
                await makeDefault(address.id);
                retry();
              }}
            />
          ))}
        </ul>
      )}

      <DialogAddressForm showDialog={dialogOpen} setShowDialog={setDialogOpen} retryAddress={retry} address={editing} />
    </section>
  );
}

function Profile() {
  const { data, loading, reload } = useProfileServices();

  if (loading && !data) {
    return <PageLoader text="جاري تحميل حسابك" />;
  }

  const signOut = () => {
    Cookies.remove("app_token");
    window.location.href = "/";
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl space-y-5 px-4 pb-12" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">حسابي</h1>
        <div className="flex gap-2">
          <a href="/user/orders" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-[var(--main-color)]">
            <ClipboardList className="h-4 w-4" aria-hidden="true" /> طلباتي
          </a>
          <button type="button" onClick={signOut} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-red-300 hover:text-red-600">
            <LogOut className="h-4 w-4" aria-hidden="true" /> تسجيل الخروج
          </button>
        </div>
      </div>

      {data ? (
        <ProfileCard key={`${data?.name}-${data?.phone}`} data={data} onSaved={reload} />
      ) : (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">تعذر تحميل بياناتك. حدّث الصفحة.</p>
      )}

      <AddressBook />
    </div>
  );
}

export default Profile;
