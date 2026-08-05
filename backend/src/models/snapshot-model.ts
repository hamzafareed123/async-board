import mongoose, { Document, model, Schema } from "mongoose";

export interface ISnapShotDocument extends Document {
    roomId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    label: string;
    elements: {
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
    }[],
    createdAt: Date;
}

const snapshotSchema = new Schema<ISnapShotDocument>({

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
    label: {
        type: String,
        required: true
    },
    elements: [
        {
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
        }
    ]

}, { timestamps: true })


const Snapshot = model<ISnapShotDocument>("Snapshot", snapshotSchema);
export default Snapshot;