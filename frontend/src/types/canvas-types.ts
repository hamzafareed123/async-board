export type PersistedElementType = "rect" | "circle" | "pen" | "text" | "sticky" | "line" | "arrow";
export type CanvasElementType = PersistedElementType | "image";

interface CanvasElementBase {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  pointerLength?: number;
  pointerWidth?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  text?: string;
  offsetX?: number;
  tension?: number;
  lineCap?: string;
  lineJoin?: string;
  version?: number;
}

export type CanvasShape = CanvasElementBase & { type: PersistedElementType };
export type CanvasElement = CanvasShape | (CanvasElementBase & { type: "image"; src: string });

export interface ApiElement {
  _id: string;
  type: PersistedElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  points?: { x: number; y: number }[];
  style?: {
    color?: string;
    fillColor?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
  };
  text?: string | null;
  version?: number;
}

export interface CreateElementPayload {
  type: PersistedElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  points: { x: number; y: number }[];
  style: {
    color: string;
    fillColor: string;
    strokeWidth: number;
    opacity: number;
    fontSize: number;
  };
  text: string | null;
  version: number;
}

export type UpdateElementPayload = Partial<Omit<CreateElementPayload, "points" | "style">> & {
  points?: CreateElementPayload["points"];
  style?: Partial<CreateElementPayload["style"]>;
};

export interface OnlineMember {
  userId: string;
  fullName: string;
  profilePic?: string;
  cursorColor: string;
}
