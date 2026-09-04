"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { CustomerForm, type CustomerFormValues } from "@/features/customers/CustomerForm";
import { useCreateCustomer } from "@/features/customers/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

export default function NewCustomerPage() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      const customer = await createCustomer.mutateAsync(values);
      toast.success(`${customer.company_name} created.`);
      router.push("/customers");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader title="New Customer" description="Add a new customer to invoice" />
      <Card className="max-w-3xl">
        <CardContent>
          <CustomerForm onSubmit={handleSubmit} submitLabel="Create customer" />
        </CardContent>
      </Card>
    </div>
  );
}
