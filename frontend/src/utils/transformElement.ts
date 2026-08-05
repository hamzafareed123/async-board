export const transformToKonvaShape = (el: any) => {

    const convertPointsToFlat = (points: { x: number, y: number }[]) => {
        return points.flatMap(p => [p.x, p.y]);
    };

    return {
        id: el._id,
        type: el.type, 
        x: el.position?.x || 0,
        y: el.position?.y || 0,
        width: el.size?.width || 0,
        height: el.size?.height || 0,
        radiusX: (el.size?.width / 2) || 0,
        radiusY: (el.size?.height / 2) || 0,
        points: el.points ? convertPointsToFlat(el.points) : [],
        pointerLength: 20,
        pointerWidth: 20,
        fill: el.style?.fillColor || "transparent",
        stroke: el.style?.color || "#6366F1",
        strokeWidth: el.style?.strokeWidth || 2,
        opacity: el.style?.opacity || 1,
        fontSize: el.style?.fontSize || 16,
        fontFamily: "Inter",
        text: el.text || "",
    };
};



export const transformToApiShape = (shape: any) => {
    let position = { x: shape.x || 0, y: shape.y || 0 };
    let size = { width: shape.width || 0, height: shape.height || 0 };

    if (shape.type === "circle") {
        size = {
            width: (shape.radiusX || 0) * 2,
            height: (shape.radiusY || 0) * 2,
        };
    }

    if (["line", "arrow", "pen"].includes(shape.type) && shape.points?.length >= 2) {
        position = {
            x: shape.points[0] || 0,
            y: shape.points[1] || 0,
        };
    }

  
    const convertPoints = (points: number[]) => {
        const result = [];
        for (let i = 0; i < points.length; i += 2) {
            result.push({ x: points[i], y: points[i + 1] });
        }
        return result;
    };

    return {
        type: shape.type,
        position,
        size,
        points: shape.points ? convertPoints(shape.points) : [], 
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