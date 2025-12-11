import DetailPage from "./DetailPage";
import { revalidateTime } from "@/constants/constansts";
import { notFound } from "next/navigation";
import { ProductType } from "@/lib/types";
import { Metadata } from "next";
import { fetchHook } from "@/hooks/fetch-hook";
import { cache } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product_id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.product_id;

  const { productData } = await getProductDetailServices({
    productId,
  });

  if (!productData || Object.keys(productData).length === 0) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const title = productData?.name || "Product Details";
  const description =
    productData?.description || "View product details and specifications";
  const images = productData?.images || [];
  const primaryImage = productData?.logo || images[0] || null;
  const price = productData?.price;
  const category = productData?.category;
  const brand = productData?.brand;

  // Create a comprehensive title with brand and category if available
  const fullTitle = [title, brand && `by ${brand}`, category && `- ${category}`]
    .filter(Boolean)
    .join(" ");

  // Enhanced description with price and key features
  const enhancedDescription = [
    description,
    price && `Starting at $${price}`,
    productData?.features &&
    `Features: ${productData.features.slice(0, 3).join(", ")}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    title: fullTitle,
    description: enhancedDescription.slice(0, 160), // SEO optimal length
    keywords: [
      ...(productData?.keywords || []),
      title,
      brand,
      category,
      "product",
      "buy online",
    ].filter(Boolean),

    // Open Graph metadata for social sharing
    openGraph: {
      title: fullTitle,
      description: enhancedDescription.slice(0, 200),
      type: "website",
      images: primaryImage
        ? [
          {
            url: primaryImage,
            width: 1200,
            height: 630,
            alt: `${title} - Product Image`,
          },
        ]
        : [],
      siteName: "Your Store Name", // You can make this dynamic from settings
      locale: "en_US",
    },

    // Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: enhancedDescription.slice(0, 200),
      images: primaryImage ? [primaryImage] : [],
    },

    // Additional metadata for better SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical URL to prevent duplicate content issues
    alternates: {
      canonical: `/products/${productId}`,
    },

    // Product-specific metadata
    other: {
      "product:price:amount": price?.toString() || "",
      "product:price:currency": "USD", // Make this dynamic if needed
      "product:availability": productData?.inStock
        ? "in stock"
        : "out of stock",
      "product:condition": "new",
      "product:brand": brand || "",
      "product:category": category || "",
    },
  };
}

type PageProps = {
  params: Promise<{ product_id: string }>;
};
async function page({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.product_id;

  const { productData } = await getProductDetailServices({
    productId,
  });
  if (productData) {
    const product: ProductType = productData;
    return <DetailPage product={product} />;
  } else {
    notFound();
  }
}

export default page;

// Cached product detail fetcher - prevents duplicate API calls
// between generateMetadata() and page() component
const getProductDetailServices = cache(async ({
  productId,
}: {
  productId: string;
}): Promise<{
  productData: any;
}> => {
  try {
    const response = await fetchHook({
      url: `v1/product-details?product_id=${productId}`,
      init: { next: { revalidate: revalidateTime } },
    });

    const productData = response?.data?.data;
    if (!productData) {
      return {
        productData: {},
      };
    }

    return {
      productData,
    };
  } catch (error) {
    return {
      productData: {},
    };
  }
});
