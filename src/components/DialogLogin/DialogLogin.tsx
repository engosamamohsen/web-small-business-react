"use client";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDialogStore } from "@/lib/stores/DialogStore";
import { CircleX } from "lucide-react";
import { loginWithGoogle } from "@/firebase/firebase-hooks";

export default function DialogLogin({ globalData }: { globalData: any }) {
  const { isOpen, onClose } = useDialogStore((state) => state);
  return (
    <Dialog
      visible={isOpen}
      modal
      className="mx-10 flex w-full items-center justify-center shadow-none"
      onHide={() => {
        if (!isOpen) return;
        onClose();
      }}
      content={({ hide }) => (
        <div className="relative flex h-[280px] w-full max-w-[350px] flex-col items-center justify-center gap-2 rounded-sm bg-[var(--main-background)] p-4">
          <div className="absolute top-2 flex w-full items-center justify-between gap-2 px-4 text-[var(--second-font-color)]">
            <div className="flex w-full items-center gap-1">
              <span> مرحبًا بك في </span>
              <h4 className="text-[15px] font-semibold text-[var(--main-color)]">
                {globalData?.app_name}
              </h4>
            </div>
            <Button
              icon={<CircleX />}
              rounded
              text
              onClick={(e) => hide(e)}
              className="w-fit text-[var(--second-font-color)] !shadow-none !outline-none"
            />
          </div>

          <div className="mb-2 flex w-full items-center justify-center">
            يرجى تسجيل الدخول لإجراء الطلب
          </div>
          <div
            dir="ltr"
            className="flex w-full flex-col items-center justify-center gap-4"
          >
            {/* <Button
              label="Continue with Facebook"
              className="flex h-12 w-full items-center justify-center gap-2 bg-blue-600 px-4 text-center text-white !shadow-none !outline-none hover:bg-blue-700"
              icon={
                <i className="pi pi-facebook" style={{ fontSize: "18px" }}></i>
              }
            /> */}
            <Button
              label="Continue with Google"
              onClick={loginWithGoogle}
              className="flex h-12 w-full items-center justify-center gap-2 bg-[var(--main-color)] px-4 text-[var(--second-font-color)] !shadow-none !outline-none"
              icon={
                <i className="pi pi-google" style={{ fontSize: "18px" }}></i>
              }
            />
          </div>
        </div>
      )}
    ></Dialog>
  );
}

{
  /* <Button
label="Cancel"
onClick={(e) => hide(e)}
text
className="text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10 w-full p-3"
></Button> */
}
