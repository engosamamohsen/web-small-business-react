import { ProductType } from "@/lib/types";
import { Product } from "./Product";
export default function ProductsGrid({ products }: { products: any }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {products?.data?.map((product: ProductType) => (
          <div
            key={product.id}
            className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <Product product={product} />
          </div>
        ))}
      </div>
    </>
  );
}

// handle function add to cart
