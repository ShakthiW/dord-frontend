import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { Product } from "@/global-types";
import { ProductCard } from "@/components/products/product-card";

async function getProducts() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    throw new Error("No authorization token found");
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    throw new Error("Invalid token: missing tenant_id");
  }

  const res = await fetch(
    `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products`,
    {
      headers: {
        "Tenant-ID": tenantId,
        Cookie: `Authorization=${token}`,
      },
      cache: "no-store", // Ensure fresh data
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ProductsPage() {
  let products: Product[] = [];
  let error = null;

  try {
    const data = await getProducts();
    products = data.products || [];
  } catch (e) {
    error = e instanceof Error ? e.message : "An error occurred";
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          Error: {error}
        </div>
      )}

      <div className="grid gap-4">
        {products && products.length > 0
          ? products.map((product) => (
              <ProductCard key={product.ID} product={product} />
            ))
          : !error && <p>No products found.</p>}
      </div>
    </div>
  );
}
