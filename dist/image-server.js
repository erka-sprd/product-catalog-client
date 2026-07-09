// Spreadshirt image-server URL builders.
//
// The image server composites a design configuration onto a product view and,
// optionally, onto a real model/person photo — all server-side. You only build
// a URL and drop it into an <img>; no client-side compositing is involved.
//
// URL grammar (verified live):
//   {base}/{resource}/{id}/views/{viewId},key=val,key=val.{format}
//
// Two resources matter here:
//   - productTypes : renders a blank/stock product (optionally on a model).
//   - compositions : renders a stored set of designs+texts (Tier B — needs a
//                    compositionId created via the authenticated API).
export const IMAGE_SERVER_BASE = "https://image.spreadshirtmedia.net/image-server/v1";
function buildUrl(base, resource, id, o) {
    var _a, _b;
    const root = ((_a = o.base) !== null && _a !== void 0 ? _a : base).replace(/\/+$/, "");
    const params = [];
    if (o.width != null)
        params.push(`width=${o.width}`);
    if (o.height != null)
        params.push(`height=${o.height}`);
    // appearanceId is added by the caller-specific builders below.
    if (o.crop != null)
        params.push(`crop=${o.crop}`);
    if (o.modelId != null)
        params.push(`modelId=${o.modelId}`);
    if (o.version != null)
        params.push(`version=${o.version}`);
    const suffix = params.length ? `,${params.join(",")}` : "";
    return `${root}/${resource}/${id}/views/${o.viewId}${suffix}.${(_b = o.format) !== null && _b !== void 0 ? _b : "jpg"}`;
}
/** Live render of a stock product type on a view (and optionally a model). */
export function productTypeRenderUrl(o) {
    var _a, _b;
    const root = ((_a = o.base) !== null && _a !== void 0 ? _a : IMAGE_SERVER_BASE).replace(/\/+$/, "");
    const params = [];
    if (o.width != null)
        params.push(`width=${o.width}`);
    if (o.height != null)
        params.push(`height=${o.height}`);
    if (o.appearanceId != null)
        params.push(`appearanceId=${o.appearanceId}`);
    if (o.crop != null)
        params.push(`crop=${o.crop}`);
    if (o.modelId != null)
        params.push(`modelId=${o.modelId}`);
    if (o.version != null)
        params.push(`version=${o.version}`);
    const suffix = params.length ? `,${params.join(",")}` : "";
    return `${root}/productTypes/${o.productTypeId}/views/${o.viewId}${suffix}.${(_b = o.format) !== null && _b !== void 0 ? _b : "jpg"}`;
}
/** Live render of a stored composition (custom design) — optionally on a model. */
export function compositionRenderUrl(o) {
    return buildUrl(IMAGE_SERVER_BASE, "compositions", o.compositionId, o);
}
// --- On-model render helpers (ported from create-omat) -----------------------
// The on-model render spec is comma-separated params after the viewId, e.g.
//   {base}/products/{productKey}/views/1,modelId=42,crop=detail,appearanceId=1251,backgroundColor=F4F4F4
// `productKey` is a design saved on Spreadshirt's backend; `modelId`/`crop`/
// `appearanceId` come from the model-image metadata for the product type.
export const DEFAULT_BACKGROUND_COLOR = "F4F4F4";
function modelSuffix(o) {
    var _a;
    const params = [];
    if (o.modelId != null)
        params.push(`modelId=${o.modelId}`);
    if (o.crop != null)
        params.push(`crop=${o.crop}`);
    if (o.appearanceId != null)
        params.push(`appearanceId=${o.appearanceId}`);
    params.push(`backgroundColor=${(_a = o.backgroundColor) !== null && _a !== void 0 ? _a : DEFAULT_BACKGROUND_COLOR}`);
    const q = [];
    if (o.width != null)
        q.push(`width=${o.width}`);
    if (o.height != null)
        q.push(`height=${o.height}`);
    return `,${params.join(",")}` + (q.length ? `?${q.join("&")}` : "");
}
/** Blank product type on a model photo. No credentials required. */
export function productTypeModelUrl(o) {
    var _a;
    const root = ((_a = o.base) !== null && _a !== void 0 ? _a : IMAGE_SERVER_BASE).replace(/\/+$/, "");
    return `${root}/productTypes/${o.productTypeId}/views/${o.viewId}${modelSuffix(o)}`;
}
/** A saved product (carrying a design) on a model photo. Needs a real productKey. */
export function productModelUrl(o) {
    var _a;
    const root = ((_a = o.base) !== null && _a !== void 0 ? _a : IMAGE_SERVER_BASE).replace(/\/+$/, "");
    return `${root}/products/${o.productKey}/views/${o.viewId}${modelSuffix(o)}`;
}
