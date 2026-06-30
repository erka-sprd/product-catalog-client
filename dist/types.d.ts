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
