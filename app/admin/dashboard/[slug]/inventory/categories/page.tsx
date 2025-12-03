import { getCategories } from "@/app/actions/categories";
import { RequestCategoryDialog } from "@/components/products/request-category-dialog";
import { Category } from "@/global-types";

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let error = null;

  try {
    const res = await getCategories();
    if (res.success && res.categories) {
      categories = res.categories;
    } else {
      error = res.error || "Failed to load categories";
    }
  } catch (e) {
    error = "An unexpected error occurred";
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <RequestCategoryDialog />
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          Error: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories && categories.length > 0
          ? categories.map((category) => (
              <div
                key={category.ID}
                className="p-4 border rounded-lg shadow-sm"
              >
                <h2 className="font-semibold">{category.Name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {category.Description}
                </p>
              </div>
            ))
          : !error && <p>No categories found.</p>}
      </div>
    </div>
  );
}
