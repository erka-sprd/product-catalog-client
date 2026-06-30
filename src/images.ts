// Image fields in the catalog are stored as root-relative paths (e.g.
// "/products/2116/947/1.webp"). Resolve them against the catalog base URL at
// runtime so no host is ever hard-coded into the data.

export function resolveImageUrl(baseUrl: string, path: string | null | undefined): string {
    if (!path) return ""
    if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path
    const base = baseUrl.replace(/\/+$/, "")
    const p = path.startsWith("/") ? path : `/${path}`
    return `${base}${p}`
}
