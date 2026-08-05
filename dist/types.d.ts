export type StaticViewMap = {
    printAreaId: string;
    offset: {
        x: number;
        y: number;
        unit: string;
    };
    size: {
        width: number;
        height: number;
        unit: string;
    };
    dpi: number;
};
export type StaticView = {
    id: string;
    name: string;
    canvas: {
        width: number;
        height: number;
        unit: string;
    };
    dpi: number;
    viewMaps: StaticViewMap[];
};
export type StaticAppearanceView = {
    id: string;
    image: string;
};
export type StaticPrintType = {
    id: string;
    href: string;
};
export type StaticAppearance = {
    id: string;
    name: string;
    color: string;
    image: string;
    modelImage: string | null;
    printTypes: StaticPrintType[];
    views: StaticAppearanceView[];
};
export type StaticPrintArea = {
    id: string;
    defaultViewId: string;
    boundary: {
        width: number;
        height: number;
        unit: string;
    };
    restrictions: {
        textAllowed: boolean;
        designAllowed: boolean;
        backgroundAllowed: boolean;
    };
    printoutQuantity: number;
};
export type StaticProductDetails = {
    shortDescription: string;
    description: string;
    brand: string;
    weight: number;
    sizeFitHint: string;
};
/**
 * One body measurement of one size, as published by Spreadshirt. `name` is the
 * letter keyed to the garment diagram the shop shows beside the size table
 * (A/B/C — see SIZE_MEASURE_LABELS). Always millimetres; use formatMeasure to
 * render.
 */
export type StaticSizeMeasure = {
    name: string;
    mm: number;
};
/** Measurements for a single size. `measures` is empty when none are published. */
export type StaticSizeEntry = {
    name: string;
    measures: StaticSizeMeasure[];
};
export type StaticProduct = {
    id: string;
    name: string;
    price: number;
    preview: string;
    embroidery: boolean;
    modelImageFront: string | null;
    appearances: StaticAppearance[];
    views: StaticView[];
    sizes: string[];
    /**
     * Per-size body measurements for the size guide, in the same order as
     * `sizes`. Empty (or absent, on catalogues generated before this field
     * existed) when the product publishes no measurements — render the guide
     * without a table in that case rather than showing zeroes.
     */
    sizeGuide?: StaticSizeEntry[];
    printAreas: StaticPrintArea[];
    details: StaticProductDetails;
};
export type Catalog = {
    featuredProductId: string;
    products: StaticProduct[];
};
export type ViewImage = {
    id: string;
    image: string;
};
export type AppearanceData = {
    id: string;
    name: string;
    color: string;
    image: string;
    modelImage: string | null;
    views: ViewImage[];
};
export type ProductTypeData = {
    id: string;
    name: string;
    price: number;
    embroidery: boolean;
    modelImageFront: string | null;
    defaultViewId: string;
    defaultAppearanceId: string;
    appearances: AppearanceData[];
    views: StaticView[];
    printAreas: StaticPrintArea[];
    sizes: {
        id: string;
        name: string;
    }[];
    /** Per-size measurements for the size guide; empty when none published. */
    sizeGuide: StaticSizeEntry[];
    details: StaticProductDetails;
};
export type ProductTileData = {
    id: string;
    image: string;
    appearanceId: string;
    price: string;
    priceValue: number;
    brand: string;
    name: string;
    colors: string[];
};
