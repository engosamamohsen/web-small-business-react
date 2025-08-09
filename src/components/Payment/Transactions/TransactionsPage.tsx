"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, X, Printer, XCircle, Clock } from "lucide-react";

// Types definitions
type PaymentStatus = "success" | "failed" | "pending";

interface PaymentDetails {
  paymentType: string;
  mobile: string;
  email: string;
  amountPaid: string;
  transactionId: string;
  netBanking: string;
}

interface StatusConfig {
  title: string;
  titleColor: string;
  icon: React.ReactNode;
  iconColor: string;
}

interface InvoiceData {
  created_at: string;
  customer_id: number;
  id: number;
  invoice_id: string;
  invoice_key: string;
  invoice_number: string;
  payment_data: {
    redirectTo: string;
  };
  payment_type: string;
  requires_redirect: boolean;
  total: string;
  netBanking?: string;
  mobile?: string;
  email?: string;
}

// Status configuration object
const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  success: {
    title: "Payment successful!!!",
    titleColor: "text-green-500",
    icon: <CheckCircle size={60} />,
    iconColor: "text-green-500",
  },
  failed: {
    title: "Payment failed",
    titleColor: "text-red-500",
    icon: <XCircle size={60} />,
    iconColor: "text-red-500",
  },
  pending: {
    title: "Payment pending",
    titleColor: "text-yellow-500",
    icon: <Clock size={60} />,
    iconColor: "text-yellow-500",
  },
};

// Component for the payment status header
const StatusHeader: React.FC<{ config: StatusConfig }> = ({ config }) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <h2 className={`mb-4 text-xl font-medium ${config.titleColor}`}>
      {config.title}
    </h2>
    <div className={`mb-6 ${config.iconColor}`}>{config.icon}</div>
  </div>
);

// Component for displaying a single payment detail row
const PaymentDetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <>
    <div className="text-right text-sm font-medium">{value}</div>

    <div className="text-left text-sm text-gray-600">{label}</div>
  </>
);

// Component for the payment details section
const PaymentDetailsSection: React.FC<{ details: PaymentDetails }> = ({
  details,
}) => (
  <div className="border-t border-gray-200 pt-4">
    <div className="grid grid-cols-2 gap-y-3">
      <PaymentDetailRow label="Payment type" value={details.paymentType} />
      {details.netBanking && (
        <PaymentDetailRow label="Net banking" value={details.netBanking} />
      )}
      <PaymentDetailRow label="Mobile" value={details.mobile} />
      <PaymentDetailRow label="Email" value={details.email} />
      <PaymentDetailRow label="Amount paid" value={details.amountPaid} />
      <PaymentDetailRow label="Transaction id" value={details.transactionId} />
    </div>
  </div>
);

// Component for the action buttons
const ActionButtons: React.FC<{ onPrint: () => void; onClose: () => void }> = ({
  onPrint,
  onClose,
}) => (
  <div className="mt-6 grid grid-cols-2 gap-4">
    <button
      onClick={onClose}
      className="flex items-center justify-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      <X size={18} /> CLOSE
    </button>
    <button
      onClick={onPrint}
      className="flex items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      <Printer size={18} /> PRINT
    </button>
  </div>
);

// Main component
const TransactionsPage: React.FC<{ invoiceData: InvoiceData }> = ({
  invoiceData,
}) => {
  const searchParams = useSearchParams();

  // Parse query parameters
  const statusParam =
    (searchParams.get("status") as PaymentStatus) || "success";
  const invoice_id = searchParams.get("invoice_id");

  // Get the appropriate status configuration
  const currentStatus = Object.keys(STATUS_CONFIG).includes(statusParam)
    ? statusParam
    : "success";
  const currentConfig = STATUS_CONFIG[currentStatus as PaymentStatus];

  // Use real data from invoiceData prop
  const paymentDetails: PaymentDetails = {
    paymentType: invoiceData.payment_type || "N/A",
    mobile: invoiceData.mobile ?? "",
    email: invoiceData.email ?? "",
    amountPaid: invoiceData.total || "0.00",
    transactionId: invoice_id || invoiceData.invoice_id || "N/A",
    netBanking: invoiceData.netBanking ?? "",
  };

  // Event handlers
  const handlePrint = () => window.print();
  const handleClose = () => window.close();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Status Header */}
        <StatusHeader config={currentConfig} />

        {/* Receipt Details */}
        <div className="px-6 pb-6">
          <PaymentDetailsSection details={paymentDetails} />
          <ActionButtons onPrint={handlePrint} onClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
