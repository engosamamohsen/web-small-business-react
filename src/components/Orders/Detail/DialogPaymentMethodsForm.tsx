import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { useForm } from "react-hook-form";
import { CircleX } from "lucide-react";
import PaymentMethodsList from "./PaymentMethodsList";
import {
  paymentFormSchema,
  paymentFormSchemaDefaultValues,
  PaymentFormSchemaType,
} from "./paymentformSchema";
import { usePaymentMethods } from "@/hooks/payment/Payments";
import { useEffect } from "react";
import { usePayment } from "@/hooks/order";
import { useRouter } from "@/lib/navigation";

function DialogPaymentMethodsForm({
  showDialog,
  setShowDialog,
  orderId,
}: {
  showDialog: boolean;
  setShowDialog: any;
  orderId: string | number;
}) {
  const router = useRouter();
  const { data: paymentMethods, loading: paymentLoading } = usePaymentMethods();
  const { handleSubmit, setValue, setError, watch } =
    useForm<PaymentFormSchemaType>({
      mode: "all",
      defaultValues: paymentFormSchemaDefaultValues,
      resolver: zodResolver(paymentFormSchema),
    });

  // Auto-select VISA payment method (paymentId: 2) when payment methods are loaded
  useEffect(() => {
    if (paymentMethods?.length) {
      // Find VISA payment method (paymentId: 2)
      const visaMethod = paymentMethods.find(
        (method) => method.paymentId === 2,
      );
      if (visaMethod) {
        setValue("paymentMethod", visaMethod);
      }
    }
  }, [paymentMethods, setValue]);

  const { createPayment, loading } = usePayment();
  const onSubmit = async (inputs: any) => {
    const { data } = await createPayment(
      inputs.paymentMethod.paymentId,
      orderId,
    );

    if (data?.status === 200 && data?.data?.requires_redirect) {
      router.push(data?.data?.payment_url);
    }
  };
  return (
    <>
      <Dialog
        visible={showDialog}
        modal
        className="mx-4 flex w-full items-center justify-center shadow-none"
        onHide={() => {
          if (!showDialog) return;
          setShowDialog(false);
        }}
        content={({ hide }) => (
          <div className="h-full w-fit overflow-y-auto rounded-md max-md:max-h-[700px] max-sm:max-h-[550px]">
            <div className="relative flex h-fit min-h-fit w-full max-w-[550px] flex-col items-center justify-start gap-2 overflow-y-auto rounded-md bg-[var(--main-background)] p-6 py-10">
              <div className="absolute top-1 flex w-full items-center justify-between gap-2 px-4 text-[var(--second-font-color)]">
                <div className="flex w-full items-center gap-1">
                  <h4 className="text-[15px] font-semibold text-[var(--main-color)]">
                    اختر طريقة الدفع
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

              <div className="flex h-full w-full flex-col items-center justify-start gap-4">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full space-y-4"
                >
                  <>
                    {paymentLoading ? (
                      <div className="mt-6 min-w-[500px] animate-pulse space-y-4">
                        <div className="h-6 w-1/4 rounded bg-gray-200"></div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          <div className="h-32 rounded bg-gray-200"></div>
                          <div className="h-32 rounded bg-gray-200"></div>
                          <div className="h-32 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    ) : (
                      <PaymentMethodsList
                        paymentMethods={paymentMethods as any}
                        selectedPaymentId={
                          watch("paymentMethod")?.paymentId || null
                        }
                        onSelectPaymentMethod={(selectedPayment) => {
                          setValue("paymentMethod", selectedPayment);
                          setError("paymentMethod", {
                            type: "manual",
                            message: "",
                          });
                        }}
                      />
                    )}
                  </>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    تأكيد الدفع
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      ></Dialog>
    </>
  );
}

export default DialogPaymentMethodsForm;
