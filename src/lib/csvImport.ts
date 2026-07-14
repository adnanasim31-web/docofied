import Papa from "papaparse";
import { prisma } from "@/lib/db";

const HEADER_ALIASES: Record<string, string[]> = {
  npi: ["npi", "npinumber"],
  firstName: ["firstname", "first", "givenname"],
  lastName: ["lastname", "last", "surname", "familyname"],
  orgName: ["orgname", "organization", "organizationname", "practicename"],
  credentials: ["credentials", "credential", "suffix", "designation"],
  specialty: ["specialty", "speciality", "specialization"],
  subSpecialty: ["subspecialty", "subspeciality"],
  phone: ["phone", "phonenumber", "telephone"],
  email: ["email", "emailaddress"],
  website: ["website", "url"],
  addressLine1: ["address", "addressline1", "address1", "street", "streetaddress"],
  addressLine2: ["addressline2", "address2", "suite", "unit"],
  city: ["city", "town"],
  state: ["state", "st", "province"],
  zip: ["zip", "zipcode", "postalcode", "postcode"],
  gender: ["gender", "sex"],
  languages: ["languages", "language", "languagesspoken"],
  acceptingNewPatients: ["acceptingnewpatients", "accepting", "newpatients"],
  bio: ["bio", "biography", "about"],
  photoUrl: ["photourl", "photo", "image", "imageurl", "avatar"],
};

const ALIAS_TO_FIELD = new Map<string, string>();
for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
  for (const alias of aliases) ALIAS_TO_FIELD.set(alias, field);
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeRow(row: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    const field = ALIAS_TO_FIELD.get(normalizeHeader(key));
    if (field && value != null && String(value).trim() !== "") {
      out[field] = String(value).trim();
    }
  }
  return out;
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.toLowerCase();
  return !["no", "false", "0", "n"].includes(v);
}

export type ImportResult = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  skipReasons: string[];
};

export async function importProvidersFromCsv(csvText: string): Promise<ImportResult> {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data;
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const skipReasons: string[] = [];

  for (const [index, rawRow] of rows.entries()) {
    const row = normalizeRow(rawRow);
    const rowLabel = `Row ${index + 2}`;

    if (!row.specialty || !row.state) {
      skipped++;
      if (skipReasons.length < 20) {
        skipReasons.push(`${rowLabel}: missing required specialty or state`);
      }
      continue;
    }
    if (!row.firstName || !row.lastName || !row.city) {
      skipped++;
      if (skipReasons.length < 20) {
        skipReasons.push(`${rowLabel}: missing required firstName, lastName, or city`);
      }
      continue;
    }

    const data = {
      npi: row.npi ?? null,
      firstName: row.firstName,
      lastName: row.lastName,
      orgName: row.orgName ?? null,
      credentials: row.credentials ?? null,
      specialty: row.specialty,
      subSpecialty: row.subSpecialty ?? null,
      phone: row.phone ?? null,
      email: row.email ?? null,
      website: row.website ?? null,
      addressLine1: row.addressLine1 ?? null,
      addressLine2: row.addressLine2 ?? null,
      city: row.city,
      state: row.state.toUpperCase().slice(0, 2),
      zip: row.zip ?? null,
      gender: row.gender ?? null,
      languages: row.languages ?? null,
      acceptingNewPatients: parseBoolean(row.acceptingNewPatients),
      bio: row.bio ?? null,
      photoUrl: row.photoUrl ?? null,
    };

    if (row.npi) {
      const existing = await prisma.provider.findUnique({ where: { npi: row.npi } });
      if (existing) {
        await prisma.provider.update({ where: { id: existing.id }, data });
        updated++;
        continue;
      }
    }

    await prisma.provider.create({ data });
    created++;
  }

  return { total: rows.length, created, updated, skipped, skipReasons };
}
