export interface ICreateElementDTO {
    type: "rect" | "circle" | "path" | "text" | "sticky" | "line" | "arrow";
    position: { x: number, y: number };
    size: { width: number, height: number };
    points: { x: number, height: number }[];
    style: {
        color: string;
        fillColor: string;
        strokeWidth: number;
        opacity: number;
        fontSize: number;
    };
    text?: string;
    version: number;
}

