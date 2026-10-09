"use client";

import { AlertTriangle, Boxes, Package, Plus, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ProductModal } from "@/features/inventory/ProductModal";
import { StockModal } from "@/features/inventory/StockModal";
import { useProducts } from "@/features/inventory/hooks";
import type { Product } from "@/lib/api/types";
import { formatMoney } from "@/lib/utils/format";
import { useAuthStore } from "@/store/auth-store";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [productModal, setProductModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManage = hasPermission("inventory.manage");

  const { data, isLoading } = useProducts({
    search: search || undefined,
    low_stock: lowStockOnly || undefined,
    page,
    per_page: 15,
  });

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Track stock levels for the products you sell"
        actions={
          canManage && (
            <Button className="gap-2" onClick={() => setProductModal({ open: true, product: null })}>
              <Plus className="h-4 w-4" /> New Product
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
          <Input
            placeholder="Search by name or SKU…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setLowStockOnly((v) => !v);
            setPage(1);
          }}
          className={`flex items-center gap-1.5 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors ${
            lowStockOnly
              ? "border-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger)]"
              : "border-[var(--border)] text-foreground-muted"
          }`}
        >
          <AlertTriangle className="h-4 w-4" /> Low stock only
        </button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : !data?.data.length ? (
          <EmptyState
            icon={Boxes}
            title="No products found"
            description={
              search || lowStockOnly ? "Try a different search or filter." : "Add your first product to get started."
            }
            action={
              canManage &&
              !search &&
              !lowStockOnly && (
                <Button size="sm" className="gap-2" onClick={() => setProductModal({ open: true, product: null })}>
                  <Plus className="h-4 w-4" /> New Product
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-foreground-faint">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium text-right">On Hand</th>
                  <th className="px-4 py-3 font-medium text-right">Selling Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 shrink-0 text-foreground-faint" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {!product.is_active && <p className="text-xs text-foreground-faint">Inactive</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground-muted">{product.sku ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {product.quantity_on_hand} {product.unit}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {product.selling_price !== null ? formatMoney(product.selling_price) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {product.is_low_stock && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--danger-bg)] px-2 py-0.5 text-xs font-medium text-[var(--danger)]">
                          <AlertTriangle className="h-3 w-3" /> Low stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canManage && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setStockModalProduct(product)}>
                            Stock
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setProductModal({ open: true, product })}
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.meta.last_page > 1 && (
        <div className="mt-4">
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      )}

      <ProductModal
        open={productModal.open}
        onClose={() => setProductModal({ open: false, product: null })}
        product={productModal.product}
      />
      <StockModal open={!!stockModalProduct} onClose={() => setStockModalProduct(null)} product={stockModalProduct} />
    </div>
  );
}
