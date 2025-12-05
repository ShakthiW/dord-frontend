"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { BankAccount } from "@/global-types";

export async function getTenant(tenantId: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${process.env.MERCHANT_SERVICE_URL}/api/v1/tenants/tenant/${tenantId}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        next: { tags: [`tenant-${tenantId}`] },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch tenant: ${response.status} ${response.statusText}`
      );
      // Log the response body for debugging if needed
      // const text = await response.text();
      // console.error("Response body:", text);
      throw new Error("Failed to fetch tenant");
    }

    const data = await response.json();
    return data.tenant;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }
}

export async function getBankAccounts(): Promise<{
  bank_accounts: BankAccount[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("Authorization")?.value;

    if (!token) {
      return { bank_accounts: [], error: "Unauthorized: No token found" };
    }

    const payload = decodeJwt(token);
    if (!payload || !payload.tenant_id) {
      return { bank_accounts: [], error: "Unauthorized: Invalid token" };
    }

    const response = await fetch(
      `${process.env.MERCHANT_SERVICE_URL}/api/v1/bank-accounts`,
      {
        headers: {
          "Tenant-ID": payload.tenant_id,
          Cookie: `Authorization=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch bank accounts: ${response.status} ${response.statusText}`
      );
      return {
        bank_accounts: [],
        error: `Error fetching bank accounts: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { bank_accounts: data.bank_accounts || [] };
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return { bank_accounts: [], error: "Error loading bank accounts." };
  }
}
