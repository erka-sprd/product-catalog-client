import type {
    Catalog,
    ProductTileData,
    ProductTypeData,
    StaticProduct,
    StaticSizeEntry,
} from "./types"

// ---- Fetching --------------------------------------------------------------

const cache = new Map<string, Promise<Catalog>>()

/**
 * Fetch the catalogue from the host (e.g. https://catalog.example.com).
 * Cached per base URL for the lifetime of the page.
 */
export function getCatalog(baseUrl: string): Promise<Catalog> {
    const base = baseUrl.replace(/\/+$/, "")
    const cached = cache.get(base)
    if (cached) return cached
    const p = fetch(`${base}/catalog.json`, { headers: { Accept: "application/json" } }).then(
        async res => {
            if (!res.ok) throw new Error(`Failed to load catalog: ${res.status}`)
            return (await res.json()) as Catalog
        }
    )
    cache.set(base, p)
    return p
}

// ---- Derivations (operate on the fetched products array) -------------------

export function getProductType(products: StaticProduct[], id: string): ProductTypeData | null {
    const p = products.find(x => x.id === id)
    if (!p) return null
    const defaultViewId = p.appearances[0]?.views[0]?.id ?? "1"
    const defaultAppearance = p.appearances.find(a => a.image === p.preview) ?? p.appearances[0]
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        embroidery: p.embroidery,
        modelImageFront: p.modelImageFront,
        defaultViewId,
        defaultAppearanceId: defaultAppearance?.id ?? "",
        appearances: p.appearances,
        views: p.views,
        printAreas: p.printAreas,
        sizes: p.sizes.map((name, i) => ({ id: String(i), name })),
        sizeGuide: p.sizeGuide ?? [],
        details: p.details,
    }
}

// ---- Size guide ------------------------------------------------------------

/**
 * What each measurement letter means, keyed to the garment diagram Spreadshirt
 * publishes next to the table. Mirrors create-omat's
 * `product-details.size-chart.guide.size-in.*` (translations/en-GB.json), where
 * A and C are both lengths measured at different points.
 */
export const SIZE_MEASURE_LABELS: Record<string, string> = {
    A: "Length",
    B: "Width",
    C: "Length",
}

/**
 * Format a millimetre measurement for display — the same rounding create-omat
 * uses (`getLocalizedSize` in src/utils/Units.ts): one decimal for cm, two for
 * inches. Returns the number only; render the unit from the column header.
 */
export function formatMeasure(mm: number, unit: "cm" | "in" = "cm"): string {
    return unit === "in" ? (mm / 25.4).toFixed(2) : (mm / 10).toFixed(1)
}

/**
 * The measurement letters this product publishes, in A→B→C order, taken from
 * the first size that has any. Use it for table columns so every row lines up.
 */
export function sizeMeasureColumns(sizeGuide: StaticSizeEntry[] | undefined): string[] {
    const first = (sizeGuide ?? []).find(s => s.measures.length > 0)
    return first ? first.measures.map(m => m.name) : []
}

/** Look up one size's measurement by letter; null when not published. */
export function sizeMeasure(
    sizeGuide: StaticSizeEntry[] | undefined,
    sizeName: string,
    measureName: string
): number | null {
    const size = (sizeGuide ?? []).find(s => s.name === sizeName)
    return size?.measures.find(m => m.name === measureName)?.mm ?? null
}

/** Print-area overlay rectangle (percentages of the canvas) for a view. */
export function getPrintAreaOverlay(
    product: ProductTypeData,
    viewId: string
): { left: number; top: number; width: number; height: number } | null {
    const view = product.views.find(v => v.id === viewId)
    const viewMap = view?.viewMaps[0]
    if (!view || !viewMap) return null
    const printArea = product.printAreas.find(pa => pa.id === viewMap.printAreaId)
    if (!printArea) return null
    const canvasW = viewMap.size.width || view.canvas.width
    const canvasH = viewMap.size.height || view.canvas.height
    if (!canvasW || !canvasH) return null
    return {
        left: (viewMap.offset.x / canvasW) * 100,
        top: (viewMap.offset.y / canvasH) * 100,
        width: (printArea.boundary.width / canvasW) * 100,
        height: (printArea.boundary.height / canvasH) * 100,
    }
}

function hash(s: string): number {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

/**
 * Out-of-stock sizes per (productId, appearanceId).
 *
 * A colour that publishes `outOfStock` in the catalogue is taken at its word —
 * that is real modelled stock. Every other colour keeps the deterministic
 * pseudo-random set, so the prototypes still show a plausible spread without
 * the data having to describe the whole assortment.
 */
export function buildOutOfStockMap(
    productId: string,
    appearances: { id: string; outOfStock?: string[] }[],
    sizes: { name: string }[]
): Record<string, string[]> {
    const map: Record<string, string[]> = {}
    for (const a of appearances) {
        if (a.outOfStock) {
            // Only sizes this product actually has — a stale entry must not
            // strike a size that isn't on the rail.
            const named = new Set(sizes.map(s => s.name))
            map[a.id] = a.outOfStock.filter(name => named.has(name))
            continue
        }
        const seed = hash(`${productId}:${a.id}`)
        const count = seed % 3
        const picks = new Set<string>()
        let s = seed
        while (picks.size < Math.min(count, sizes.length)) {
            s = (s * 1664525 + 1013904223) >>> 0
            picks.add(sizes[s % sizes.length].name)
        }
        map[a.id] = Array.from(picks)
    }
    return map
}

// ---- Tiles -----------------------------------------------------------------

// Curated order of products (baseball cap 2nd, half-zip 3rd, …).
const PRODUCT_ORDER = [
    "2116", "15", "4180", "1047", "3980", "4133", "812", "943", "2940", "916",
    "2973", "1040", "20", "813", "4181", "917", "814", "1505", "4182", "4562",
    "3001", "4312",
]

// Force a specific colourway for these tiles' default image (id -> appearanceId).
const COLOR_OVERRIDE: Record<string, string> = {
    "2116": "1224",
    "1047": "649",
    "4133": "1409",
}

const NATURAL =
    /(nature|natural|ecru|cream|vanilla|oat|sand|beige|khaki|olive|stone|taupe|almond|mocha|latte|heather|sage|tan|camel|linen|wheat|clay|off.?white|bone|white)/i

function seed(s: string) {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

function shuffle<T>(arr: T[], s: number): T[] {
    const a = [...arr]
    let x = s >>> 0
    for (let i = a.length - 1; i > 0; i--) {
        x = (Math.imul(x, 1664525) + 1013904223) >>> 0
        const j = x % (i + 1)
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export function productToTile(p: StaticProduct): ProductTileData {
    const override = COLOR_OVERRIDE[p.id]
        ? p.appearances.find(a => a.id === COLOR_OVERRIDE[p.id])
        : undefined
    const natural = p.appearances.find(a => NATURAL.test(a.name)) ?? p.appearances[0]
    const chosen = override ?? natural
    return {
        id: p.id,
        image: chosen?.image || p.preview || "",
        appearanceId: chosen?.id ?? "",
        price: p.price.toFixed(2).replace(".", ",") + " €",
        priceValue: p.price,
        brand: p.details.brand || "",
        name: p.name,
        colors: shuffle(
            p.appearances.map(a => a.color),
            seed(p.id)
        ),
    }
}

/** Build the curated tile lists from a products array. */
export function buildTiles(products: StaticProduct[]): {
    embroideryTiles: ProductTileData[]
    allTiles: ProductTileData[]
} {
    const byId = new Map(products.map(p => [p.id, p]))
    const curated = PRODUCT_ORDER.map(id => byId.get(id)).filter(
        (p): p is StaticProduct => Boolean(p)
    )
    const orderedAll: StaticProduct[] = [
        ...curated,
        ...products.filter(p => !PRODUCT_ORDER.includes(p.id)),
    ]
    return {
        embroideryTiles: curated.map(productToTile),
        allTiles: orderedAll.map(productToTile),
    }
}
