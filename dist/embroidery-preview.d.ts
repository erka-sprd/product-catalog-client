import React from "react";
export declare function renderEmbroidery(imageData: ImageData, width: number, height: number): HTMLCanvasElement;
export interface EmbroideryPreviewProps {
    src: string;
    maxSize?: number;
    style?: React.CSSProperties;
    className?: string;
    onRendered?: (dataUrl: string) => void;
}
export declare function EmbroideryPreview({ src, maxSize, style, className, onRendered, }: EmbroideryPreviewProps): React.JSX.Element;
export default EmbroideryPreview;
