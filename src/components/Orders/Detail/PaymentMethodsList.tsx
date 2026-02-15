import React from "react";
import Image from "@/components/common/Image";
import { PaymentMethod } from "@/lib/types";

type PaymentMethodsListProps = {
  paymentMethods: PaymentMethod[];
  selectedPaymentId: number | null;
  onSelectPaymentMethod: (paymentMethod: PaymentMethod) => void;
};

const PaymentMethodsList = ({
  paymentMethods,
  selectedPaymentId,
  onSelectPaymentMethod,
}: PaymentMethodsListProps) => {
  // VISA payment method has paymentId: 2 - used in parent component for initial selection

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {paymentMethods?.map((method) => (
          <div
            key={method.paymentId}
            onClick={() => onSelectPaymentMethod(method)}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 transition-all ${
              selectedPaymentId === method.paymentId
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <div className="flex flex-col items-start justify-center gap-3">
              <div className="relative h-10 w-16 shrink-0 overflow-hidden">
                <Image
                  src={method.logo}
                  alt={method.name_ar}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Fallback for broken images
                    e.currentTarget.src = "/payment-default.png";
                  }}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium">{method.name_ar}</h4>
                <p className="text-xs text-gray-500">{method.name_en}</p>
              </div>
            </div>
            <div
              className={`h-5 w-5 min-w-5 rounded-full border ${
                selectedPaymentId === method.paymentId
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300"
              } flex items-center justify-center`}
            >
              {selectedPaymentId === method.paymentId && (
                <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsList;
