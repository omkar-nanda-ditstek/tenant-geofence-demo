const LOCALHOST_NAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function stripPort(host: string): string {
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    return end === -1 ? host : host.slice(1, end);
  }

  return host.split(":")[0] ?? host;
}

export function extractSubdomain(hostHeader: string | null): string | null {
  if (!hostHeader) {
    return null;
  }

  const host = stripPort(hostHeader.trim().toLowerCase());

  if (!host || LOCALHOST_NAMES.has(host)) {
    return null;
  }

  if (host.endsWith(".localhost")) {
    const parts = host.split(".");
    return parts.length === 2 && parts[0] ? parts[0] : null;
  }

  const labels = host.split(".");
  if (labels.length < 3 || labels.some((label) => label.length === 0)) {
    return null;
  }

  return labels[0] ?? null;
}
