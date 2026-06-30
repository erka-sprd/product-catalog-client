// ---- Fetching --------------------------------------------------------------
const cache = new Map();
/**
 * Fetch the catalogue from the host (e.g. https://catalog.example.com).
 * Cached per base URL for the lifetime of the page.
 */
export function getCatalog(baseUrl) {
    const base = baseUrl.replace(/\/+$/, "");
    const cached = cache.get(base);
    if (cached)
        return cached;
    const p = fetch(`${base}/catalog.json`, { headers: { Accept: "application/json" } }).then(async (res) => {
        if (!res.ok)
            throw new Error(`Failed to load catalog: ${res.status}`);
        return (await res.json());
    });
    cache.set(base, p);
    return p;
}
// ---- Derivations (operate on the fetched products array) -------------------
export function getProductType(products, id) {
    var _a, _b, _c, _d, _e;
    const p = products.find(x => x.id === id);
    if (!p)
        return null;
    const defaultViewId = (_c = (_b = (_a = p.appearances[0]) === null || _a === void 0 ? void 0 : _a.views[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "1";
    const defaultAppearance = (_d = p.appearances.find(a => a.image === p.preview)) !== null && _d !== void 0 ? _d : p.appearances[0];
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        embroidery: p.embroidery,
        modelImageFront: p.modelImageFront,
        defaultViewId,
        defaultAppearanceId: (_e = defaultAppearance === null || defaultAppearance === void 0 ? void 0 : defaultAppearance.id) !== null && _e !== void 0 ? _e : "",
        appearances: p.appearances,
        views: p.views,
        printAreas: p.printAreas,
        sizes: p.sizes.map((name, i) => ({ id: String(i), name })),
        details: p.details,
    };
}
/** Print-area overlay rectangle (percentages of the canvas) for a view. */
export function getPrintAreaOverlay(product, viewId) {
    const view = product.views.find(v => v.id === viewId);
    const viewMap = view === null || view === void 0 ? void 0 : view.viewMaps[0];
    if (!view || !viewMap)
        return null;
    const printArea = product.printAreas.find(pa => pa.id === viewMap.printAreaId);
    if (!printArea)
        return null;
    const canvasW = viewMap.size.width || view.canvas.width;
    const canvasH = viewMap.size.height || view.canvas.height;
    if (!canvasW || !canvasH)
        return null;
    return {
        left: (viewMap.offset.x / canvasW) * 100,
        top: (viewMap.offset.y / canvasH) * 100,
        width: (printArea.boundary.width / canvasW) * 100,
        height: (printArea.boundary.height / canvasH) * 100,
    };
}
function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
/** Deterministic pseudo out-of-stock map per (productId, appearanceId). */
export function buildOutOfStockMap(productId, appearances, sizes) {
    const map = {};
    for (const a of appearances) {
        const seed = hash(`${productId}:${a.id}`);
        const count = seed % 3;
        const picks = new Set();
        let s = seed;
        while (picks.size < Math.min(count, sizes.length)) {
            s = (s * 1664525 + 1013904223) >>> 0;
            picks.add(sizes[s % sizes.length].name);
        }
        map[a.id] = Array.from(picks);
    }
    return map;
}
// ---- Tiles -----------------------------------------------------------------
// Curated order of products (baseball cap 2nd, half-zip 3rd, …).
const PRODUCT_ORDER = [
    "2116", "15", "4180", "1047", "3980", "4133", "812", "943", "2940", "916",
    "2973", "1040", "20", "813", "4181", "917", "814", "1505", "4182", "4562",
    "3001", "4312",
];
// Force a specific colourway for these tiles' default image (id -> appearanceId).
const COLOR_OVERRIDE = {
    "2116": "1224",
    "1047": "649",
    "4133": "1409",
};
const NATURAL = /(nature|natural|ecru|cream|vanilla|oat|sand|beige|khaki|olive|stone|taupe|almond|mocha|latte|heather|sage|tan|camel|linen|wheat|clay|off.?white|bone|white)/i;
function seed(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
function shuffle(arr, s) {
    const a = [...arr];
    let x = s >>> 0;
    for (let i = a.length - 1; i > 0; i--) {
        x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
        const j = x % (i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
export function productToTile(p) {
    var _a, _b;
    const override = COLOR_OVERRIDE[p.id]
        ? p.appearances.find(a => a.id === COLOR_OVERRIDE[p.id])
        : undefined;
    const natural = (_a = p.appearances.find(a => NATURAL.test(a.name))) !== null && _a !== void 0 ? _a : p.appearances[0];
    const chosen = override !== null && override !== void 0 ? override : natural;
    return {
        id: p.id,
        image: (chosen === null || chosen === void 0 ? void 0 : chosen.image) || p.preview || "",
        appearanceId: (_b = chosen === null || chosen === void 0 ? void 0 : chosen.id) !== null && _b !== void 0 ? _b : "",
        price: p.price.toFixed(2).replace(".", ",") + " €",
        priceValue: p.price,
        brand: p.details.brand || "",
        name: p.name,
        colors: shuffle(p.appearances.map(a => a.color), seed(p.id)),
    };
}
/** Build the curated tile lists from a products array. */
export function buildTiles(products) {
    const byId = new Map(products.map(p => [p.id, p]));
    const curated = PRODUCT_ORDER.map(id => byId.get(id)).filter((p) => Boolean(p));
    const orderedAll = [
        ...curated,
        ...products.filter(p => !PRODUCT_ORDER.includes(p.id)),
    ];
    return {
        embroideryTiles: curated.map(productToTile),
        allTiles: orderedAll.map(productToTile),
    };
}
