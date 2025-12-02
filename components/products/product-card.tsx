import { Product } from "@/global-types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-semibold">{product.Name}</h2>
      <p className="text-sm text-gray-500">{product.Description}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="font-medium">${product.Price}</span>
        <span className="text-sm text-gray-500">Stock: {product.Stock}</span>
      </div>
    </div>
  );
}
