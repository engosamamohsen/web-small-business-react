import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}

function buildProductPath(product) {
  const id = String(product.id);
  const slug = product.slug?.trim() || (product.name ? slugify(product.name) : "");
  return slug ? `/product/${id}-${slug}` : `/product/${id}`;
}
function parseProductParam(param) {
  if (!param) return null;
  const match = param.match(/^(\d+)(?:-(.*))?$/);
  if (!match) return null;
  return { id: match[1], slug: match[2] ?? "" };
}

export { buildProductPath as b, cn as c, parseProductParam as p };
