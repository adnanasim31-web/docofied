"use client";

import { useState } from "react";
import type { ImportResult } from "@/lib/csvImport";
import { importProvidersAction } from "@/app/admin/(protected)/import/actions";

export function CsvImportForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setResult(null);
    setError(null);
    if (!file) {
      setFileName(null);
      setCsvText(null);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result));
    reader.readAsText(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!csvText) {
      setError("Please choose a CSV file first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await importProvidersAction(csvText);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-muted">CSV file</label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-hover"
          />
          {fileName && <p className="mt-2 text-xs text-ink-muted">Selected: {fileName}</p>}
        </div>
        <button type="submit" disabled={loading || !csvText} className="btn-primary">
          {loading ? "Importing..." : "Import providers"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-line bg-surface-sunk p-4">
          <h3 className="text-sm font-semibold text-ink">Import complete</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat label="Total rows" value={result.total} />
            <ResultStat label="Created" value={result.created} />
            <ResultStat label="Updated" value={result.updated} />
            <ResultStat label="Skipped" value={result.skipped} />
          </div>
          {result.skipReasons.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-ink-muted">Skip reasons (first 20):</p>
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-ink-faint">
                {result.skipReasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-3 text-center">
      <p className="font-display text-xl font-bold text-accent-600">{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
