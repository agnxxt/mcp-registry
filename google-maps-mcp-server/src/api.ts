// Shared HTTP client for Google Maps Platform APIs

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.error("GOOGLE_MAPS_API_KEY environment variable is required");
  process.exit(1);
}

export async function mapsGet(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>
): Promise<unknown> {
  const url = new URL(baseUrl);
  url.searchParams.set("key", API_KEY!);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Maps API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function mapsPost(
  baseUrl: string,
  body: Record<string, unknown>,
  headers?: Record<string, string>
): Promise<unknown> {
  const url = new URL(baseUrl);
  url.searchParams.set("key", API_KEY!);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Maps API error ${res.status}: ${text}`);
  }
  return res.json();
}

// For "New" Google APIs that use field masks (Places New, Routes)
export async function mapsPostWithFieldMask(
  baseUrl: string,
  body: Record<string, unknown>,
  fieldMask: string
): Promise<unknown> {
  return mapsPost(baseUrl, body, { "X-Goog-FieldMask": fieldMask });
}

// Build a static URL (for maps/street view images — returns URL, not fetched)
export function buildStaticUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("key", API_KEY!);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}
