"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import { extractErrorMessage } from "@/lib/api/client";
import { submitCustomerIntake } from "@/lib/api/customerIntakes";

const schema = z
  .object({
    company_name: z.string().min(1, "Company name is required").max(255),
    contact_person: z.string().max(255).optional().or(z.literal("")),
    phone: z.string().max(30).optional().or(z.literal("")),
    email: z.string().email("Enter a valid email").max(255).optional().or(z.literal("")),
    tin: z.string().max(50).optional().or(z.literal("")),
    vrn: z.string().max(50).optional().or(z.literal("")),
    country: z.string().max(100).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    physical_address: z.string().optional().or(z.literal("")),
    postal_address: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.phone || data.email, {
    message: "Please provide a phone number or an email so we can reach you.",
    path: ["phone"],
  });

type IntakeFormValues = z.infer<typeof schema>;

interface PublicIntakeFormProps {
  onSubmitted: () => void;
}

export function PublicIntakeForm({ onSubmitted }: PublicIntakeFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IntakeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: "",
      contact_person: "",
      phone: "",
      email: "",
      tin: "",
      vrn: "",
      country: "",
      city: "",
      physical_address: "",
      postal_address: "",
      notes: "",
    },
  });

  const onSubmit = async (values: IntakeFormValues) => {
    try {
      await submitCustomerIntake(values);
      onSubmitted();
    } catch (error) {
      setError("root", { message: extractErrorMessage(error) });
    }
  };

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
          <Input id="phone" error={errors.phone?.message} {...register("phone")} />
          <FieldError>{errors.phone?.message}</FieldError>
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
          <Textarea id="notes" rows={3} placeholder="Anything else we should know?" {...register("notes")} />
        </div>
      </div>

      {errors.root?.message && <p className="text-sm text-[var(--danger)]">{errors.root.message}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send details
        </Button>
      </div>
    </form>
  );
}
