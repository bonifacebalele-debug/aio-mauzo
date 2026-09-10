"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import type { Company } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  name: z.string().min(1, "Company name is required").max(255),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  tin: z.string().max(50).optional().or(z.literal("")),
  vrn: z.string().max(50).optional().or(z.literal("")),
  business_registration_number: z.string().max(50).optional().or(z.literal("")),
  invoice_prefix: z.string().max(20).optional().or(z.literal("")),
  invoice_number_format: z.string().max(50).optional().or(z.literal("")),
  footer_text: z.string().optional().or(z.literal("")),
  terms_conditions: z.string().optional().or(z.literal("")),
  payment_instructions: z.string().optional().or(z.literal("")),
  primary_color: z.string().max(7).optional().or(z.literal("")),
  secondary_color: z.string().max(7).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function CompanySettingsForm({
  company,
  onSubmit,
}: {
  company: Company;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const canEdit = useAuthStore((s) => s.hasPermission("settings.edit"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company.name,
      address: company.address ?? "",
      phone: company.phone ?? "",
      email: company.email ?? "",
      website: company.website ?? "",
      tin: company.tin ?? "",
      vrn: company.vrn ?? "",
      business_registration_number: company.business_registration_number ?? "",
      invoice_prefix: company.invoice_prefix,
      invoice_number_format: company.invoice_number_format,
      footer_text: company.footer_text ?? "",
      terms_conditions: company.terms_conditions ?? "",
      payment_instructions: company.payment_instructions ?? "",
      primary_color: company.primary_color,
      secondary_color: company.secondary_color,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {!canEdit && (
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--neutral-bg)] px-4 py-3 text-sm text-foreground-muted">
          You have view-only access to company settings. Contact an administrator to make changes.
        </div>
      )}

      <fieldset disabled={!canEdit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" error={errors.name?.message} {...register("name")} />
              <FieldError>{errors.name?.message}</FieldError>
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
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("website")} />
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
              <Label htmlFor="business_registration_number">Business Registration No.</Label>
              <Input id="business_registration_number" {...register("business_registration_number")} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" rows={2} {...register("address")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Numbering &amp; Branding</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="invoice_prefix">Invoice Prefix</Label>
              <Input id="invoice_prefix" {...register("invoice_prefix")} />
            </div>
            <div>
              <Label htmlFor="invoice_number_format">Number Format</Label>
              <Input id="invoice_number_format" {...register("invoice_number_format")} />
            </div>
            <div>
              <Label htmlFor="primary_color">Primary Color</Label>
              <Input id="primary_color" type="color" className="h-10 w-20 p-1" {...register("primary_color")} />
            </div>
            <div>
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <Input id="secondary_color" type="color" className="h-10 w-20 p-1" {...register("secondary_color")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Defaults</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="payment_instructions">Payment Instructions</Label>
              <Textarea id="payment_instructions" rows={3} {...register("payment_instructions")} />
            </div>
            <div>
              <Label htmlFor="terms_conditions">Terms &amp; Conditions</Label>
              <Textarea id="terms_conditions" rows={3} {...register("terms_conditions")} />
            </div>
            <div>
              <Label htmlFor="footer_text">Footer Text</Label>
              <Textarea id="footer_text" rows={2} {...register("footer_text")} />
            </div>
          </CardContent>
        </Card>
      </fieldset>

      {canEdit && (
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save settings
          </Button>
        </div>
      )}
    </form>
  );
}
