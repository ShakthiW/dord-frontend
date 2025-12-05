import { getTenant, getBankAccounts } from "@/app/actions/tenant";
import { decodeJwt } from "@/lib/utils";
import { cookies } from "next/headers";
import { StoreInfo } from "@/components/store-settings/store-info";
import { ContactDetails } from "@/components/store-settings/contact-details";
import { BrandingDetails } from "@/components/store-settings/branding-details";
import { PaymentDetails } from "@/components/store-settings/payment-details";
import { TenantSettings } from "@/global-types";

export default async function StoreSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return <div className="p-6">Unauthorized: No token found</div>;
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return <div className="p-6">Unauthorized: Invalid token</div>;
  }

  const [tenantData, bankAccountsData] = await Promise.all([
    getTenant(payload.tenant_id),
    getBankAccounts(),
  ]);

  if (!tenantData) {
    return <div className="p-6">Error loading store settings.</div>;
  }

  // Cast the data to TenantSettings since getTenant returns 'any' or a different shape
  const settings: TenantSettings = tenantData as TenantSettings;
  const bankAccounts = bankAccountsData.bank_accounts || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Store Settings</h1>
      </div>

      <div className="grid gap-6">
        <StoreInfo settings={settings} />
        <ContactDetails settings={settings} />
        <BrandingDetails settings={settings} />
        <PaymentDetails bankAccounts={bankAccounts} />
      </div>
    </div>
  );
}
