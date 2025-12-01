"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { requestMerchantAccount } from "@/app/actions/auth";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  message: "",
  error: "",
};

export function MerchantSignupForm({
  className,
  redirectUrl = "/admin/dashboard",
  ...props
}: React.ComponentProps<"form"> & {
  redirectUrl?: string;
}) {
  const [state, action, isPending] = useActionState(
    requestMerchantAccount,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // We don't redirect immediately as it's a request now, but maybe redirect to home or show a success state
      // For now, let's redirect to home after a delay or just keep them there with the success message
      setTimeout(() => router.push("/"), 2000);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form
      action={action}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Request Merchant Account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Submit your business details for review
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Business Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Acme Corp"
            required
          />
          <FieldDescription>
            This will be used to generate your store URL.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="businessEmail">Business Email</FieldLabel>
          <Input
            id="businessEmail"
            name="businessEmail"
            type="email"
            placeholder="admin@acme.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="businessPhone">Business Phone</FieldLabel>
          <Input
            id="businessPhone"
            name="businessPhone"
            type="tel"
            placeholder="+1-555-000-1234"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input
            id="description"
            name="description"
            type="text"
            placeholder="Flagship tenant for demos"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending Request..." : "Send Request"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
