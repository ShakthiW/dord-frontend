"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { Category, RequestCategoryPayload } from "@/global-types";
import { sendCategoryRequestEmail } from "@/lib/nodemailer";

export async function getCategories() {
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/categories`,
      {
        headers: {
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
      }
    );

    if (!res.ok) {
      return { success: false, error: "Failed to fetch categories" };
    }

    const data = await res.json();
    return { success: true, categories: data.productCategories as Category[] };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function requestCategory(data: RequestCategoryPayload) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    return { success: false, error: "No authorization token found" };
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;
  const firstName = decoded?.first_name || "Unknown";
  const lastName = decoded?.last_name || "";
  const email = decoded?.email || "Unknown";
  const phone = decoded?.phone || "Unknown";

  if (!tenantId) {
    return { success: false, error: "Invalid token: missing tenant_id" };
  }

  try {
    await sendCategoryRequestEmail({
      categoryName: data.Name,
      categoryDescription: data.Description,
      note: data.Note,
      requesterName: `${firstName} ${lastName}`,
      requesterEmail: email,
      requesterPhone: phone,
      tenantId: tenantId,
    });

    return { success: true };
  } catch (e) {
    console.error("Failed to send category request email:", e);
    return { success: false, error: "Failed to send request email" };
  }
}
