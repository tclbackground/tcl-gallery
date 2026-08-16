import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductPage({
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
    });
  } catch (error) {
    console.error("Database query failed:", error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}