import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: {
        artist: true,
      },
    }).catch(async () => {
      return await prisma.product.findUnique({ where: { id } });
    });
  } catch (error) {
    console.error("Failed to query single product:", error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}