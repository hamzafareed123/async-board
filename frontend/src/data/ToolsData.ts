import {
    Circle,
    Eraser,
    Minus,
    Image,
    MoveUpRight,
    MousePointer2,
    Pen,
    RectangleHorizontal,
    StickyNote,
    Type,
} from "lucide-react";



export const tools = [
    { label: "Select", icon: MousePointer2, shortcut: "V" },
    { label: "Pen", icon: Pen, shortcut: "P" },
    { label: "Rectangle", icon: RectangleHorizontal, shortcut: "R" },
    { label: "Circle", icon: Circle, shortcut: "C" },
    { label: "Line", icon: Minus, shortcut: "L" },
    { label: "Arrow", icon: MoveUpRight, shortcut: "A" },
    { label: "Text", icon: Type, shortcut: "T" },
    { label: "Sticky", icon: StickyNote, shortcut: "S" },
    { label: "Eraser", icon: Eraser, shortcut: "E" },
    { label: "Image", icon: Image, shortcut: "I" },
];