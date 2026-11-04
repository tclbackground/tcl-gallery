
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DesignStoreEditPage({
  params,
}: Props) {
  const { id } = await params;

  if (!id) {
    redirect("/admin/design-store");
  }

  // Redirect to the dedicated Design Store editor.
  redirect(
    `/admin/design-store/edit-product/${encodeURIComponent(id)}`
  );
}
