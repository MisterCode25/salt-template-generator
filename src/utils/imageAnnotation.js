export const DEFAULT_ANNOTATION_EXPORT_MAX_WIDTH = 1600;

export function getContainedImageRect(imageWidth, imageHeight, containerWidth, containerHeight) {
    const sourceWidth = Number(imageWidth);
    const sourceHeight = Number(imageHeight);
    const targetWidth = Number(containerWidth);
    const targetHeight = Number(containerHeight);

    if (
        !Number.isFinite(sourceWidth)
        || !Number.isFinite(sourceHeight)
        || !Number.isFinite(targetWidth)
        || !Number.isFinite(targetHeight)
        || sourceWidth <= 0
        || sourceHeight <= 0
        || targetWidth <= 0
        || targetHeight <= 0
    ) {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            scale: 1,
            imageWidth: Math.max(0, sourceWidth || 0),
            imageHeight: Math.max(0, sourceHeight || 0)
        };
    }

    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;

    return {
        x: (targetWidth - width) / 2,
        y: (targetHeight - height) / 2,
        width,
        height,
        scale,
        imageWidth: sourceWidth,
        imageHeight: sourceHeight
    };
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function stagePointToImagePoint(point, imageRect) {
    if (!point || !imageRect || imageRect.width <= 0 || imageRect.height <= 0 || imageRect.scale <= 0) {
        return null;
    }
    const sourceX = Number.isFinite(imageRect.sourceX) ? imageRect.sourceX : 0;
    const sourceY = Number.isFinite(imageRect.sourceY) ? imageRect.sourceY : 0;
    const sourceWidth = Number.isFinite(imageRect.sourceWidth) ? imageRect.sourceWidth : imageRect.imageWidth;
    const sourceHeight = Number.isFinite(imageRect.sourceHeight) ? imageRect.sourceHeight : imageRect.imageHeight;

    if (
        point.x < imageRect.x
        || point.x > imageRect.x + imageRect.width
        || point.y < imageRect.y
        || point.y > imageRect.y + imageRect.height
    ) {
        return null;
    }

    return {
        x: clamp(sourceX + ((point.x - imageRect.x) / imageRect.scale), sourceX, sourceX + sourceWidth),
        y: clamp(sourceY + ((point.y - imageRect.y) / imageRect.scale), sourceY, sourceY + sourceHeight)
    };
}

export function imagePointToStagePoint(point, imageRect) {
    if (!point || !imageRect || imageRect.scale <= 0) return { x: 0, y: 0 };
    const sourceX = Number.isFinite(imageRect.sourceX) ? imageRect.sourceX : 0;
    const sourceY = Number.isFinite(imageRect.sourceY) ? imageRect.sourceY : 0;
    return {
        x: imageRect.x + (point.x - sourceX) * imageRect.scale,
        y: imageRect.y + (point.y - sourceY) * imageRect.scale
    };
}

export function normalizeRectFromPoints(start, end) {
    if (!start || !end) return { x: 0, y: 0, width: 0, height: 0 };
    return {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y)
    };
}

export function getLimitedExportSize(imageWidth, imageHeight, maxWidth = DEFAULT_ANNOTATION_EXPORT_MAX_WIDTH) {
    const width = Number(imageWidth);
    const height = Number(imageHeight);
    const limit = Number(maxWidth);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return { width: 0, height: 0, scale: 1 };
    }

    if (!Number.isFinite(limit) || limit <= 0 || width <= limit) {
        return {
            width: Math.round(width),
            height: Math.round(height),
            scale: 1
        };
    }

    const scale = limit / width;
    return {
        width: Math.round(width * scale),
        height: Math.round(height * scale),
        scale
    };
}

export function annotationBounds(annotation = {}) {
    if (annotation.type === "arrow") {
        const [x1, y1, x2, y2] = annotation.points || [];
        const points = [
            { x: x1 || 0, y: y1 || 0 },
            { x: x2 || 0, y: y2 || 0 }
        ];
        if (Number.isFinite(annotation.control?.x) && Number.isFinite(annotation.control?.y)) {
            points.push(annotation.control);
        }
        const xs = points.map((point) => point.x);
        const ys = points.map((point) => point.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        return {
            x: minX,
            y: minY,
            width: Math.max(...xs) - minX,
            height: Math.max(...ys) - minY
        };
    }
    if (annotation.type === "rect") {
        return {
            x: annotation.x || 0,
            y: annotation.y || 0,
            width: Math.abs(annotation.width || 0),
            height: Math.abs(annotation.height || 0)
        };
    }
    if (annotation.type === "text") {
        return {
            x: annotation.x || 0,
            y: annotation.y || 0,
            width: annotation.width || 0,
            height: annotation.height || 0
        };
    }
    return { x: 0, y: 0, width: 0, height: 0 };
}
