export type TenantRecord = {
  tenantId: string;
  name: string;
};

const tenants = new Map<string, TenantRecord>([
  ["tenant1", { tenantId: "tenant_1", name: "Tenant One" }],
  ["tenant2", { tenantId: "tenant_2", name: "Tenant Two" }]
]);

export function getTenantBySubdomain(subdomain: string): TenantRecord | null {
  return tenants.get(subdomain) ?? null;
}
