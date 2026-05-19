import { PagePlaceholder } from "@/shared/ui/page-placeholder";

export function AdminPage() {
  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="Admin"
        title="Area admin masih berupa stub, tetapi akses rute dan layout-nya sudah siap."
        description="Dashboard statistik, tabel user, dan moderasi grup akan lebih aman dikembangkan nanti karena jalur routing dan permission dasarnya sudah dipisahkan dari shell member."
        tags={["Role-aware route", "Separate layout", "Table-ready"]}
      />
    </div>
  );
}

