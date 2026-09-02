import type { Catalog, ProductTileData, ProductTypeData, StaticProduct, StaticSizeEntry } from "./types";
/**
 * Fetch the catalogue from the host (e.g. https://catalog.example.com).
 * Cached per base URL for the lifetime of the page.
 */
export declare function getCatalog(baseUrl: string): Promise<Catalog>;
export declare function getProductType(products: StaticProduct[], id: string): ProductTypeData | null;
/**
 * What each measurement letter means, keyed to the garment diagram Spreadshirt
 * publishes next to the table. Mirrors create-omat's
 * `product-details.size-chart.guide.size-in.*` (translations/en-GB.json), where
 * A and C are both lengths measured at different points.
 */
export declare const SIZE_MEASURE_LABELS: Record<string, string>;
/**
 * Format a millimetre measurement for display — the same rounding create-omat
 * uses (`getLocalizedSize` in src/utils/Units.ts): one decimal for cm, two for
 * inches. Returns the number only; render the unit from the column header.
 */
export declare function formatMeasure(mm: number, unit?: "cm" | "in"): string;
/**
 * The measurement letters this product publishes, in A→B→C order, taken from
 * the first size that has any. Use it for table columns so every row lines up.
 */
export declare function sizeMeasureColumns(sizeGuide: StaticSizeEntry[] | undefined): string[];
/** Look up one size's measurement by letter; null when not published. */
export declare function sizeMeasure(sizeGuide: StaticSizeEntry[] | undefined, sizeName: string, measureName: string): number | null;
/** Print-area overlay rectangle (percentages of the canvas) for a view. */
export declare function getPrintAreaOverlay(product: ProductTypeData, viewId: string): {
    left: number;
    top: number;
    width: number;
    height: number;
} | null;
/**
 * Out-of-stock sizes per (productId, appearanceId).
 *
 * A colour that publishes `outOfStock` in the catalogue is taken at its word —
 * that is real modelled stock. Every other colour keeps the deterministic
 * pseudo-random set, so the prototypes still show a plausible spread without
 * the data having to describe the whole assortment.
 */
export declare function buildOutOfStockMap(productId: string, appearances: {
    id: string;
    outOfStock?: string[];
}[], sizes: {
    name: string;
}[]): Record<string, string[]>;
export declare function productToTile(p: StaticProduct): ProductTileData;
/** Build the curated tile lists from a products array. */
export declare function buildTiles(products: StaticProduct[]): {
    embroideryTiles: ProductTileData[];
    allTiles: ProductTileData[];
};
