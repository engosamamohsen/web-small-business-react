import { Category } from "../types";

export interface Product {
    id: number;
    slug: string;
    name: string;
    category: Category;
    sub_category: Category | null;

    price: number;
    discount: number;

    description: string;
    description_steps: string[];

    tags: string[];

    product_image: string;
    gallery_images: string[];

    variations: any[]; // change later if you add options
    technicalInformation: any[]; // same here
}