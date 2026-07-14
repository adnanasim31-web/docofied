import { SPECIALTIES, US_STATES } from "@/lib/constants";

export type ProviderFormValues = {
  npi?: string | null;
  firstName?: string;
  lastName?: string;
  orgName?: string | null;
  credentials?: string | null;
  specialty?: string;
  subSpecialty?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  zip?: string | null;
  gender?: string | null;
  languages?: string | null;
  acceptingNewPatients?: boolean;
  active?: boolean;
  bio?: string | null;
  photoUrl?: string | null;
};

export function ProviderForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  initial?: ProviderFormValues;
  submitLabel: string;
}) {
  const v = initial ?? {};

  return (
    <form action={action} className="space-y-6">
      <div className="card p-6">
        <h2 className="font-display text-base font-bold text-ink">Basic information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name" name="firstName" defaultValue={v.firstName} required />
          <Field label="Last name" name="lastName" defaultValue={v.lastName} required />
          <Field label="Credentials" name="credentials" defaultValue={v.credentials ?? ""} placeholder="MD, DO, DDS..." />
          <Field label="Organization name" name="orgName" defaultValue={v.orgName ?? ""} />
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-muted">Specialty</label>
            <select name="specialty" defaultValue={v.specialty ?? ""} required className="input-field">
              <option value="" disabled>
                Select specialty
              </option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Field label="Sub-specialty" name="subSpecialty" defaultValue={v.subSpecialty ?? ""} />
          <Field label="NPI" name="npi" defaultValue={v.npi ?? ""} />
          <Field label="Photo URL" name="photoUrl" defaultValue={v.photoUrl ?? ""} placeholder="https://..." />
          <Field label="Gender" name="gender" defaultValue={v.gender ?? ""} />
          <Field label="Languages" name="languages" defaultValue={v.languages ?? ""} placeholder="English, Spanish" />
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold text-ink-muted">Bio</label>
          <textarea name="bio" defaultValue={v.bio ?? ""} rows={4} className="input-field" />
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="acceptingNewPatients" defaultChecked={v.acceptingNewPatients ?? true} />
            Accepting new patients
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="active" defaultChecked={v.active ?? true} />
            Active (visible on site)
          </label>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-base font-bold text-ink">Contact & location</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone" name="phone" defaultValue={v.phone ?? ""} />
          <Field label="Email" name="email" type="email" defaultValue={v.email ?? ""} />
          <Field label="Website" name="website" defaultValue={v.website ?? ""} />
          <Field label="Address line 1" name="addressLine1" defaultValue={v.addressLine1 ?? ""} />
          <Field label="Address line 2" name="addressLine2" defaultValue={v.addressLine2 ?? ""} />
          <Field label="City" name="city" defaultValue={v.city} required />
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-muted">State</label>
            <select name="state" defaultValue={v.state ?? ""} required className="input-field">
              <option value="" disabled>
                Select state
              </option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Field label="ZIP" name="zip" defaultValue={v.zip ?? ""} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-muted">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
