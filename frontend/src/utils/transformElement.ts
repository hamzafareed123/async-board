import type { ApiElement, CanvasShape, CreateElementPayload } from "../types/canvas-types";

export const transformToKonvaShape = (element: ApiElement): CanvasShape => ({
  id: element._id,
  type: element.type,
  x: element.position.x,
  y: element.position.y,
  width: element.size.width,
  height: element.size.height,
  radiusX: element.size.width / 2,
  radiusY: element.size.height / 2,
  points: element.points?.flatMap(({ x, y }) => [x, y]) ?? [],
  pointerLength: 20,
  pointerWidth: 20,
  fill: element.style?.fillColor ?? "transparent",
  stroke: element.style?.color ?? "#6366F1",
  strokeWidth: element.style?.strokeWidth ?? 2,
  opacity: element.style?.opacity ?? 1,
  fontSize: element.style?.fontSize ?? 16,
  fontFamily: "Inter",
  text: element.text ?? "",
  version: element.version ?? 0,
});

export const transformToApiShape = (shape: CanvasShape): CreateElementPayload => {
  let position = { x: shape.x, y: shape.y };
  let size = { width: shape.width ?? 0, height: shape.height ?? 0 };

  if (shape.type === "circle") {
    size = {
      width: (shape.radiusX ?? 0) * 2,
      height: (shape.radiusY ?? 0) * 2,
    };
  }

  if ((shape.type === "line" || shape.type === "arrow" || shape.type === "pen") && (shape.points?.length ?? 0) >= 2) {
    position = {
      x: shape.points?.[0] ?? 0,
      y: shape.points?.[1] ?? 0,
    };
  }

  const points: { x: number; y: number }[] = [];
  for (let index = 0; index < (shape.points?.length ?? 0); index += 2) {
    const x = shape.points?.[index];
    const y = shape.points?.[index + 1];
    if (x !== undefined && y !== undefined) points.push({ x, y });
  }

  return {
    type: shape.type,
    position,
    size,
    points,
    style: {
      color: shape.stroke ?? "#6366F1",
      fillColor: shape.fill ?? "transparent",
      strokeWidth: shape.strokeWidth ?? 2,
      opacity: shape.opacity ?? 1,
      fontSize: shape.fontSize ?? 16,
    },
    text: shape.text ?? null,
    version: shape.version ?? 0,
  };
};
