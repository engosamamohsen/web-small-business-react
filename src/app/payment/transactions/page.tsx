import TransactionsPage from "@/components/Payment/Transactions/TransactionsPage";
import { fetchingData } from "@/hooks/fetching";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Payment Transactions",
  description: "View payment transaction status",
};

async function PaymentTransactionsPage(params: { searchParams: any }) {
  const searchParams = await params?.searchParams;
  const { invoiceData } = await getInvoiceServices({
    id: searchParams?.invoice_number,
  });
  if (!invoiceData) {
    return notFound();
  }

  return <TransactionsPage invoiceData={invoiceData} />;
}

export default PaymentTransactionsPage;
// /payment/transactions?status=success&invoice_number=INV_1754472816_439&invoice_id=1067664
// payment/transactions?status=(success,failed,pending)&invoice_number=INV_1754472816_439&invoice_id=1067664

async function getInvoiceServices({ id }: { id: string }): Promise<{
  invoiceData: any;
}> {
  try {
    const response = await fetchingData({
      url: `invoices?invoice_number=${id}`,
      type: { next: { revalidate: 0 } },
    });
    const invoiceData = response?.data?.data;
    if (!invoiceData) {
      return {
        invoiceData: null,
      };
    }

    return {
      invoiceData,
    };
  } catch (error) {
    console.log(error);
    return {
      invoiceData: null,
    };
  }
}
