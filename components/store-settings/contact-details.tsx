"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TenantSettings } from "@/global-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactDetailsProps {
  settings: TenantSettings;
}

export function ContactDetails({ settings }: ContactDetailsProps) {
  const address = settings.business_address;
  const fullAddress = [
    address?.address1,
    address?.address2,
    address?.city,
    address?.state,
    address?.zip,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={settings.business_email} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" value={settings.business_phone} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={fullAddress} readOnly />
        </div>
      </CardContent>
    </Card>
  );
}
