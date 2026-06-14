import mongoose, { Document, model, Schema } from "mongoose";


export interface IRoomDocument extends Document {
    name: string;
    description: string
    createdBy: mongoose.Types.ObjectId;
    members: {
        userId: string;
        role: "owner" | "editor" | "viewer";
    }[];

    inviteCode: {
        code: string;
        maxMembers: number | null;
        expiresAt: Date | null;
    };

    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const roomSchema = new Schema<IRoomDocument>({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: null
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["owner", "editor", "viewer"],
                default: "viewer",
            },
        },
    ],

    inviteCode: {
        code: {
            type: String,
            required: true,
            unique: true
        },

        maxMembers: {
            type: Number,
            default: null
        },

        expiresAt: {
            type: Date,
            default: null
        }
    },

    isPublic: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });



const Room = model<IRoomDocument>("Room", roomSchema);

export default Room;