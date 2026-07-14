import { CsvImportForm } from "@/components/admin/CsvImportForm";

export default function AdminImportPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Bulk import providers</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        Upload a CSV file to bulk-create or update providers. Rows are matched to existing
        providers by NPI when present; otherwise a new provider is created. Column headers are
        matched flexibly (e.g. "First Name", "first_name", and "firstname" all work). Each row
        must include at least <strong>specialty</strong>, <strong>state</strong>,{" "}
        <strong>first name</strong>, <strong>last name</strong>, and <strong>city</strong>.
      </p>

      <div className="mt-6 max-w-2xl">
        <CsvImportForm />
      </div>
    </div>
  );
}
