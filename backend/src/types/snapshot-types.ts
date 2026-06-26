export interface ICREATESnapShotDTO {
    label: string;
    elements: {
        type: "rect" | "circle" | "path" | "text" | "sticky" | "line" | "arrow";
        position: { x: number, y: number };
        size: { width: number, height: number };
        points: { x: number, y: number }[];
        style: {
            color: string;
            fillColor: string;
            strokeWidth: number;
            opacity: number;
            fontSize: number;
        };
        text?: string;
        version: number;
    }[],

}

export interface IUPDATESnapShotDTO {
    label?: string;
    elements?: ICREATESnapShotDTO["elements"];
}
