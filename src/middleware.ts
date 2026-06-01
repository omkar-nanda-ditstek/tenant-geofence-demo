import { NextResponse, type NextRequest } from "next/server";
import { getTenantBySubdomain } from "@/lib/mock-redis";
import { extractSubdomain } from "@/lib/tenant";

export function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request.headers.get("host"));

  if (!subdomain) {
    return NextResponse.next();
  }

  const tenant = getTenantBySubdomain(subdomain);

  if (!tenant) {
    return NextResponse.json({ message: "Tenant not found" }, { status: 404 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenant.tenantId);
  requestHeaders.set("x-tenant-subdomain", subdomain);
  requestHeaders.set("x-tenant-name", tenant.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|socket.io|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|woff|woff2)$).*)"
  ]
};
