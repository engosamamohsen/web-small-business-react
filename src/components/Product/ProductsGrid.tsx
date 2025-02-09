import { ProductType } from "@/lib/types";
import { Product } from "./Product";
import Link from "next/link";
export default function ProductsGrid({ products }: { products: any }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {products?.data?.data?.map((product: ProductType) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <Product product={product} />
          </Link>
        ))}
      </div>
    </>
  );
}

// handle function add to cart
