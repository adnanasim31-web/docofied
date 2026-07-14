"use client";

export function DeleteButton({
  action,
  confirmMessage,
  label = "Delete",
}: {
  action: () => void | Promise<void>;
  confirmMessage: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm font-semibold text-red-600 hover:text-red-700">
        {label}
      </button>
    </form>
  );
}
