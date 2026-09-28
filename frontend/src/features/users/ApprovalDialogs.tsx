"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError, Label, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAssignableRoles } from "./hooks";
import type { User } from "@/lib/api/types";

interface ApproveUserDialogProps {
  user: User | null;
  loading?: boolean;
  onConfirm: (role?: string) => void;
  onCancel: () => void;
}

/**
 * A role is only required here when the target has none yet (a
 * self-registered user) — a Manager-created user already has the role the
 * Manager picked, so this can just confirm.
 */
export function ApproveUserDialog({ user, loading, onConfirm, onCancel }: ApproveUserDialogProps) {
  const { data: roles, isLoading: rolesLoading } = useAssignableRoles();
  const [role, setRole] = useState("");
  const [touched, setTouched] = useState(false);

  const needsRole = (user?.roles.length ?? 0) === 0;
  const invalid = needsRole && touched && !role;

  const handleConfirm = () => {
    if (needsRole && !role) {
      setTouched(true);
      return;
    }
    onConfirm(role || undefined);
  };

  return (
    <Modal open={user !== null} onClose={onCancel} title="Approve user" maxWidth="max-w-sm">
      <p className="text-sm text-foreground-muted">
        {needsRole
          ? `Choose a role for "${user?.name}" and approve. They'll get an email to verify their account.`
          : `Approve "${user?.name}" (${user?.roles[0]})? They'll get an email to verify their account.`}
      </p>

      {needsRole && (
        <div className="mt-4">
          <Label htmlFor="approve-role">Role</Label>
          <Select
            id="approve-role"
            error={invalid ? "Select a role" : undefined}
            disabled={rolesLoading}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select role</option>
            {roles?.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <FieldError>{invalid ? "Select a role" : undefined}</FieldError>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Approve
        </Button>
      </div>
    </Modal>
  );
}

interface RejectUserDialogProps {
  user: User | null;
  loading?: boolean;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export function RejectUserDialog({ user, loading, onConfirm, onCancel }: RejectUserDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <Modal open={user !== null} onClose={onCancel} title="Reject user" maxWidth="max-w-sm">
      <p className="text-sm text-foreground-muted">
        {`Reject "${user?.name}"? They won't be able to sign in. This stays visible in the list as Rejected.`}
      </p>

      <div className="mt-4">
        <Label htmlFor="reject-reason">Reason (optional)</Label>
        <Textarea
          id="reject-reason"
          rows={3}
          placeholder="e.g. Not a recognized employee"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onConfirm(reason || undefined)} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Reject
        </Button>
      </div>
    </Modal>
  );
}
