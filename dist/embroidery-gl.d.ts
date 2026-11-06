export type EmbroideryGlOptions = {
    /** Thread pitch in render pixels — the distance between neighbouring threads. */
    pitch?: number;
    /** Width of the satin border along edges, in render pixels. */
    border?: number;
    /** Strength of the thread's sheen, 0–1. */
    sheen?: number;
    /** Strength of the raised-patch relief and drop shadow, 0–1. */
    relief?: number;
    /** Length of one fill stitch, in thread pitches, before the needle goes down again. */
    stitch?: number;
    /** How many levels each colour channel is flattened to — fewer reads as fewer threads. */
    levels?: number;
};
export declare const EMBROIDERY_GL_DEFAULTS: Required<EmbroideryGlOptions>;
/** Whether this browser can run the shader at all. */
export declare function embroideryGlSupported(): boolean;
/**
 * Renders `source` (already scaled to `width` × `height`) as embroidery and
 * returns a fresh 2D canvas holding the result — the same shape of result the
 * JS renderer gives, so the two are interchangeable.
 */
export declare function renderEmbroideryGl(source: TexImageSource, width: number, height: number, options?: EmbroideryGlOptions): HTMLCanvasElement;
