import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { OrdersTable } from "@/components/orders/orders-table";

export default async function OrdersHistoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return <div className="p-4">Unauthorized: No token found</div>;
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return <div className="p-4">Unauthorized: Invalid token</div>;
  }

  const paymentServiceUrl =
    process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

  try {
    const res = await fetch(`${paymentServiceUrl}/api/v1/orders`, {
      headers: {
        "Tenant-ID": payload.tenant_id,
        Cookie: `Authorization=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch orders:", res.status, res.statusText);
      return <div className="p-4">Error fetching orders: {res.statusText}</div>;
    }

    const data = await res.json();

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>
        <OrdersTable orders={data.orders || []} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div className="p-4">Error loading orders. Please try again later.</div>
    );
  }
}
