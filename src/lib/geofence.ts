import type { GeofenceCheckRequest } from "@/types/geofence";

export type ValidationResult =
  | { ok: true; data: GeofenceCheckRequest }
  | { ok: false; message: string };

export function validateGeofenceBody(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Request body must be an object" };
  }

  const { lat, lng } = body as Partial<Record<keyof GeofenceCheckRequest, unknown>>;

  if (typeof lat !== "number" || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    return { ok: false, message: "lat must be a number between -90 and 90" };
  }

  if (typeof lng !== "number" || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    return { ok: false, message: "lng must be a number between -180 and 180" };
  }

  return { ok: true, data: { lat, lng } };
}
