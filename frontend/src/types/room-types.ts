export interface IRoom {
    _id: string;
    name: string;
    description?: string;
    createdBy: string;
    members: IMember[];
    inviteCode: {
        code: string;
        maxMembers: number | null;
        expiresAt: Date | null;
    };
    isPublic: boolean;
    inviteLink: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMember {
    userId: {
        _id: string;
        fullName: string;
        profilePic?: string;
    };
    role: "owner" | "editor" | "viewer";
    _id: string;
}

export interface ICreateRoomDTO {
    name: string;
    description?: string;
    isPublic?: boolean;
    maxMembers: number;
    expiresAt?: string;
}