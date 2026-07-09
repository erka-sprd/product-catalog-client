export declare const IMAGE_SERVER_BASE = "https://image.spreadshirtmedia.net/image-server/v1";
export type ImageCrop = "detail" | "list" | "full";
export type ImageFormat = "jpg" | "png" | "webp";
type CommonRenderOptions = {
    viewId: string | number;
    width?: number;
    height?: number;
    crop?: ImageCrop | string;
    /**
     * Renders the product on a model/person photo. Requires a VALID model id for
     * this product type — enumerate those via the authenticated productTypes API
     * (`GET /productTypes/{id}` with an API key). An unknown id silently falls
     * back to the flat render.
     */
    modelId?: string | number;
    /** Cache-busting/version stamp, if the catalogue carries one. */
    version?: string | number;
    format?: ImageFormat;
    /** Override the image-server base (e.g. .com vs .net, or a proxy). */
    base?: string;
};
export type ProductTypeRenderOptions = CommonRenderOptions & {
    productTypeId: string | number;
    /** Colour of the product. */
    appearanceId?: string | number;
};
/** Live render of a stock product type on a view (and optionally a model). */
export declare function productTypeRenderUrl(o: ProductTypeRenderOptions): string;
export type CompositionRenderOptions = CommonRenderOptions & {
    /** Id of a composition created via the authenticated API (Tier B). */
    compositionId: string | number;
};
/** Live render of a stored composition (custom design) — optionally on a model. */
export declare function compositionRenderUrl(o: CompositionRenderOptions): string;
export declare const DEFAULT_BACKGROUND_COLOR = "F4F4F4";
export type ModelRenderSpec = {
    viewId: string | number;
    modelId?: string | number;
    crop?: string;
    appearanceId?: string | number;
    backgroundColor?: string;
    width?: number;
    height?: number;
    base?: string;
};
/** Blank product type on a model photo. No credentials required. */
export declare function productTypeModelUrl(o: ModelRenderSpec & {
    productTypeId: string | number;
}): string;
/** A saved product (carrying a design) on a model photo. Needs a real productKey. */
export declare function productModelUrl(o: ModelRenderSpec & {
    productKey: string;
}): string;
export {};
