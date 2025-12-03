"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { revalidatePath } from "next/cache";

import { CreateProductPayload } from "@/global-types";

export async function createProduct(data: CreateProductPayload) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    return { success: false, error: "No authorization token found" };
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    return { success: false, error: "Invalid token: missing tenant_id" };
  }

  try {
    const res = await fetch(
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to create product",
      };
    }

    revalidatePath("/admin/dashboard/[slug]/inventory/products", "page");
    return { success: true };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}
