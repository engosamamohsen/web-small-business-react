import TransactionsPage from "@/components/Payment/Transactions/TransactionsPage";
import { fetchHook } from "@/hooks/fetch-hook";
import { notFound } from "next/navigation";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

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

  return (
    <TransactionsPage
      invoiceData={{ ...invoiceData.invoice, ...invoiceData.customer }}
    />
  );
}

export default PaymentTransactionsPage;

async function getInvoiceServices({ id }: { id: string }): Promise<{
  invoiceData: any;
}> {
  try {
    const response = await fetchHook({
      url: `invoices?invoice_number=${id}`,
      init: { next: { revalidate: 0 } },
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
