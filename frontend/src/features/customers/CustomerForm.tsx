"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import type { Customer } from "@/lib/api/types";

const schema = z.object({
  company_name: z.string().min(1, "Company name is required").max(255),
  contact_person: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").max(255).optional().or(z.literal("")),
  tin: z.string().max(50).optional().or(z.literal("")),
  vrn: z.string().max(50).optional().or(z.literal("")),
  physical_address: z.string().optional().or(z.literal("")),
  postal_address: z.string().optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type CustomerFormValues = z.infer<typeof schema>;

interface CustomerFormProps {
  defaultValues?: Partial<Customer>;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  submitLabel?: string;
}

export function CustomerForm({ defaultValues, onSubmit, submitLabel = "Save customer" }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: defaultValues?.company_name ?? "",
      contact_person: defaultValues?.contact_person ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      tin: defaultValues?.tin ?? "",
      vrn: defaultValues?.vrn ?? "",
      physical_address: defaultValues?.physical_address ?? "",
      postal_address: defaultValues?.postal_address ?? "",
      country: defaultValues?.country ?? "",
      city: defaultValues?.city ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input id="company_name" error={errors.company_name?.message} {...register("company_name")} />
          <FieldError>{errors.company_name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input id="contact_person" {...register("contact_person")} />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" error={errors.email?.message} {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="tin">TIN</Label>
          <Input id="tin" {...register("tin")} />
        </div>

        <div>
          <Label htmlFor="vrn">VRN</Label>
          <Input id="vrn" {...register("vrn")} />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country")} />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="physical_address">Physical Address</Label>
          <Textarea id="physical_address" rows={2} {...register("physical_address")} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="postal_address">Postal Address</Label>
          <Textarea id="postal_address" rows={2} {...register("postal_address")} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
