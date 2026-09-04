"use client";

import { Loader2, Receipt } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CustomerForm, type CustomerFormValues } from "@/features/customers/CustomerForm";
import { useCustomer, useUpdateCustomer } from "@/features/customers/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customerId = Number(id);
  const router = useRouter();

  const { data: customer, isLoading } = useCustomer(customerId);
  const updateCustomer = useUpdateCustomer(customerId);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      await updateCustomer.mutateAsync(values);
      toast.success("Customer updated.");
      router.push("/customers");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  if (isLoading || !customer) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-foreground-faint" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Customer"
        description={customer.company_name}
        actions={
          <Link href={`/customers/${customerId}/statement`} className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}>
            <Receipt className="h-4 w-4" /> Statement
          </Link>
        }
      />
      <Card className="max-w-3xl">
        <CardContent>
          <CustomerForm defaultValues={customer} onSubmit={handleSubmit} submitLabel="Save changes" />
        </CardContent>
      </Card>
    </div>
  );
}
