import { headers } from "next/headers";
import { NextResponse } from "next/server";

export function GET() {
  const headerList = headers();

  return NextResponse.json({
    tenantId: headerList.get("x-tenant-id"),
    tenantSubdomain: headerList.get("x-tenant-subdomain"),
    tenantName: headerList.get("x-tenant-name")
  });
}
