/**
 * TransactionsPage Component - React Island
 * 
 * Displays payment transaction status (success/failed/pending)
 * Matches Next.js TransactionsPage behavior
 */
import { CheckCircle, XCircle, Clock, X, Printer } from 'lucide-react';

type PaymentStatus = 'success' | 'failed' | 'pending';

interface PaymentDetails {
  paymentType: string;
  phone: string;
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
  created_at?: string;
  customer_id?: number;
  id?: number;
  invoice_id?: string;
  invoice_key?: string;
  invoice_number?: string;
  payment_data?: {
    redirectTo?: string;
  };
  payment_type?: string;
  requires_redirect?: boolean;
  total?: string;
  netBanking?: string;
  phone?: string;
  email?: string;
}

interface TransactionsPageProps {
  invoiceData: InvoiceData;
  status?: string;
  invoiceId?: string | null;
}

const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  success: {
    title: 'Payment successful!!!',
    titleColor: 'text-green-500',
    icon: <CheckCircle size={60} />,
    iconColor: 'text-green-500',
  },
  failed: {
    title: 'Payment failed',
    titleColor: 'text-red-500',
    icon: <XCircle size={60} />,
    iconColor: 'text-red-500',
  },
  pending: {
    title: 'Payment pending',
    titleColor: 'text-yellow-500',
    icon: <Clock size={60} />,
    iconColor: 'text-yellow-500',
  },
};

function StatusHeader({ config }: { config: StatusConfig }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h2 className={`mb-4 text-xl font-medium ${config.titleColor}`}>
        {config.title}
      </h2>
      <div className={`mb-6 ${config.iconColor}`}>{config.icon}</div>
    </div>
  );
}

function PaymentDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="text-right text-sm font-medium">{value}</div>
      <div className="text-left text-sm text-gray-600">{label}</div>
    </>
  );
}

function PaymentDetailsSection({ details }: { details: PaymentDetails }) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="grid grid-cols-2 gap-y-3">
        <PaymentDetailRow label="Payment type" value={details.paymentType} />
        {details.netBanking && (
          <PaymentDetailRow label="Net banking" value={details.netBanking} />
        )}
        <PaymentDetailRow label="Mobile" value={details.phone} />
        <PaymentDetailRow label="Email" value={details.email} />
        <PaymentDetailRow label="Amount paid" value={details.amountPaid} />
        <PaymentDetailRow label="Transaction id" value={details.transactionId} />
      </div>
    </div>
  );
}

function ActionButtons({ onPrint, onClose }: { onPrint: () => void; onClose: () => void }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <button
        onClick={onClose}
        className="flex items-center justify-center gap-2 rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
      >
        <X size={18} /> CLOSE
      </button>
      <button
        onClick={onPrint}
        className="flex items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        <Printer size={18} /> PRINT
      </button>
    </div>
  );
}

export default function TransactionsPage({ invoiceData, status, invoiceId }: TransactionsPageProps) {
  // Parse status parameter
  const statusParam = (status as PaymentStatus) || 'success';
  
  // Get the appropriate status configuration
  const currentStatus = Object.keys(STATUS_CONFIG).includes(statusParam)
    ? statusParam
    : 'success';
  const currentConfig = STATUS_CONFIG[currentStatus as PaymentStatus];

  // Build payment details from invoice data
  const paymentDetails: PaymentDetails = {
    paymentType: invoiceData.payment_type || 'N/A',
    phone: invoiceData.phone ?? '',
    email: invoiceData.email ?? '',
    amountPaid: invoiceData.total || '0.00',
    transactionId: invoiceId || invoiceData.invoice_id || 'N/A',
    netBanking: invoiceData.netBanking ?? '',
  };

  // Event handlers
  const handlePrint = () => window.print();
  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = '/';
    }
  };

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
}
