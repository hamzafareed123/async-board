import { required } from "joi";
import mongoose, { Document, model, Schema } from "mongoose";


export interface IElementDocument extends Document {
    roomId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    type: "rect" | "circle" | "pen" | "text" | "sticky" | "line" | "arrow";
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
    createdAt: Date;
    updatedAt: Date;
}



const elementSchema = new Schema<IElementDocument>({

    roomId: {
        type: mongoose.Types.ObjectId,
        ref: "Room",
        required: true
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: ["rect", "circle", "pen", "text", "sticky", "line", "arrow"],
        required: true
    },
    position: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        }
    },
    size: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 }
    },

    points: {
        type: [{ x: Number, y: Number }],
        default: []
    },

    style: {
        color: { type: String, default: "#000000" },
        fillColor: { type: String, default: "transparent" },
        strokeWidth: { type: Number, default: 2 },
        opacity: { type: Number, default: 1 },
        fontSize: { type: Number, default: 16 },
    },

    text: {
        type: String,
        default: null
    },

    version: {
        type: Number,
        default: 0
    }

}, { timestamps: true });


const Element = model<IElementDocument>("Element", elementSchema);

export default Element;