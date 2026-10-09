"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { extractErrorMessage } from "@/lib/api/client";
import type { Product } from "@/lib/api/types";
import { toast } from "@/store/toast-store";
import { useCreateProduct, useUpdateProduct } from "./hooks";

const schema = z.object({
  name: z.string().min(1, "Required").max(255),
  sku: z.string().max(100).optional().or(z.literal("")),
  unit: z.string().min(1).max(20),
  description: z.string().optional().or(z.literal("")),
  cost_price: z.number().min(0).optional(),
  selling_price: z.number().min(0).optional(),
  reorder_level: z.number().min(0),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ open, onClose, product }: ProductModalProps) {
  const isEdit = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(product?.id ?? 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      unit: product?.unit ?? "pcs",
      description: product?.description ?? "",
      cost_price: product?.cost_price ?? undefined,
      selling_price: product?.selling_price ?? undefined,
      reorder_level: product?.reorder_level ?? 0,
      is_active: product?.is_active ?? true,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      sku: values.sku || null,
      description: values.description || null,
      cost_price: values.cost_price ?? null,
      selling_price: values.selling_price ?? null,
    };

    try {
      if (isEdit && product) {
        await updateProduct.mutateAsync(payload);
        toast.success(`${values.name} updated.`);
      } else {
        await createProduct.mutateAsync(payload);
        toast.success(`${values.name} added to the catalog.`);
      }
      handleClose();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={isEdit ? "Edit Product" : "New Product"} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" error={errors.name?.message} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="Optional" {...register("sku")} />
            <FieldError>{errors.sku?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" placeholder="pcs" {...register("unit")} />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={2} {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cost_price">Cost Price</Label>
            <Input
              id="cost_price"
              type="number"
              step="0.01"
              min={0}
              {...register("cost_price", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
            />
          </div>
          <div>
            <Label htmlFor="selling_price">Selling Price</Label>
            <Input
              id="selling_price"
              type="number"
              step="0.01"
              min={0}
              {...register("selling_price", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="reorder_level">Reorder Level</Label>
          <Input
            id="reorder_level"
            type="number"
            min={0}
            error={errors.reorder_level?.message}
            {...register("reorder_level", { setValueAs: (v) => (v === "" ? 0 : Number(v)) })}
          />
          <p className="mt-1 text-xs text-foreground-faint">
            You&apos;ll be flagged as low stock once quantity on hand drops to this level or below. Use 0 to turn
            off the alert for this product.
          </p>
        </div>

        {isEdit && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-[var(--border)]" />
            Active (shows up when adding invoice line items)
          </label>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Save changes" : "Add product"}
        </Button>
      </form>
    </Modal>
  );
}
