"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PublicIntakeForm } from "@/features/customer-intake/PublicIntakeForm";

export default function CustomerRequestPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitted ? "Details sent" : "Send your details"}</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-bg)] text-[var(--success)]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm text-foreground-muted">
              Thanks! We&apos;ve received your details and will be in touch shortly to prepare your invoice.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-foreground-muted">
              Fill in your details below and send them to us — no account or login needed. We&apos;ll use this to
              set you up and prepare your invoice.
            </p>
            <PublicIntakeForm onSubmitted={() => setSubmitted(true)} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
