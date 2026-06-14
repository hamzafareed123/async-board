export interface ICreateRoomDTO {
    name: string;
    description?: string;
    isPublic?: boolean;
    createdBy: string;
    inviteCode?: string;
    maxMembers?: number;
    expiresAt?: Date;
}