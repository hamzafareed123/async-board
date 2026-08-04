export const transformToKonvaShape = (el: any) => {
    return {
        id: el._id,
        type: el.type,
        x: el.position?.x || 0,
        y: el.position?.y || 0,
        width: el.size?.width || 0,
        height: el.size?.height || 0,
        points: el.points || [],
        fill: el.style?.fillColor || "transparent",
        stroke: el.style?.color || "#6366F1",
        strokeWidth: el.style?.strokeWidth || 2,
        opacity: el.style?.opacity || 1,
        fontSize: el.style?.fontSize || 16,
        text: el.text || "",
        radiusX: el.size?.width / 2 || 0,
        radiusY: el.size?.height / 2 || 0,
    };
};

export const transformToApiShape = (shape: any) => {
    return {
        type: shape.type,
        position: { x: shape.x || 0, y: shape.y || 0 },
        size: { width: shape.width || 0, height: shape.height || 0 },
        points: shape.points || [],
        style: {
            color: shape.stroke || "#6366F1",
            fillColor: shape.fill || "transparent",
            strokeWidth: shape.strokeWidth || 2,
            opacity: shape.opacity || 1,
            fontSize: shape.fontSize || 16,
        },
        text: shape.text || null,
        version: 0,
    };
};