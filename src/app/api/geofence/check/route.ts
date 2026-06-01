import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateGeofenceBody } from "@/lib/geofence";
import type { GeofenceCheckResponse } from "@/types/geofence";

type GeofenceQueryRow = {
  inside: boolean;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateGeofenceBody(body);

  if (!validation.ok) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }

  const { lat, lng } = validation.data;
  const rows = await prisma.$queryRaw<GeofenceQueryRow[]>`
    SELECT ST_Contains(
      ST_GeomFromText('POLYGON((77.0 28.5, 77.4 28.5, 77.4 28.8, 77.0 28.8, 77.0 28.5))', 4326),
      ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)
    ) AS inside;
  `;

  const response: GeofenceCheckResponse = {
    inside: rows[0]?.inside ?? false,
    lat,
    lng
  };

  return NextResponse.json(response);
}
