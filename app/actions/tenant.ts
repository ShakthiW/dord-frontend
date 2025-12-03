"use server";

import { cookies } from "next/headers";

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
