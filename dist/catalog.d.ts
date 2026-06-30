import type { Catalog, ProductTileData, ProductTypeData, StaticProduct } from "./types";
/**
 * Fetch the catalogue from the host (e.g. https://catalog.example.com).
 * Cached per base URL for the lifetime of the page.
 */
export declare function getCatalog(baseUrl: string): Promise<Catalog>;
export declare function getProductType(products: StaticProduct[], id: string): ProductTypeData | null;
/** Print-area overlay rectangle (percentages of the canvas) for a view. */
export declare function getPrintAreaOverlay(product: ProductTypeData, viewId: string): {
    left: number;
    top: number;
    width: number;
    height: number;
} | null;
/** Deterministic pseudo out-of-stock map per (productId, appearanceId). */
export declare function buildOutOfStockMap(productId: string, appearances: {
    id: string;
}[], sizes: {
    name: string;
}[]): Record<string, string[]>;
export declare function productToTile(p: StaticProduct): ProductTileData;
/** Build the curated tile lists from a products array. */
export declare function buildTiles(products: StaticProduct[]): {
    embroideryTiles: ProductTileData[];
    allTiles: ProductTileData[];
};
