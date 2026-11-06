/** Exact allowlist: never forward arbitrary URLs, encoded paths or nested queries. */
export function safeAuthDestination(value: unknown): '/workspace' | '/auth/update-password' {
  return value === '/auth/update-password' ? value : '/workspace';
}
