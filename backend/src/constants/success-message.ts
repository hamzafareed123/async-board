import Room from '../models/room-model';
export const SUCCESS_MESSAGE = {
    USER_CREATED: "User created successfully",
    LOGIN_SUCCESSFUL: "Login successful",
    LOGOUT_SUCCESSFUL: "Logout successful",
    PASSWORD_RESET_SUCCESS: "Password Reset Successfully",
    OTP_SENT: "If that email exists, an OTP has been sent",
    OTP_VERIFIED: "OTP successfully Verified",
    REFRESH_TOKEN:"Token is Refreshed",
    AUTH_USER_FETCHED: "Authenticated user retrieved successfully",
    PROFILE_UPDATED: "Profile Updated Successfully",

    // Room
    ROOM_CREATED: "Room Created Successfully",
    ROOM_JOIN: "Successfully Joined Room",
    ROOM_DELETED: "Room Deleted Successfully",
    ROOM_MEMBERS_FETCH: "Room Members Fetch Successfully",
    ROOM_FETCHED:"Rooms fetched successfully" ,

    // Element
    ELEMENT_CREATED: "element created successfully",
    ELEMENT_FETCH: "Elements fetch successfully",
    ELEMENT_UPDATE: "Element Updated successfully",
    ELEMENT_DELETED: "Element Deleted successfully",


    // Snapshot
    SNAPSHOT_CREATED: "Snapshot created successfully",
    SNAPSHOT_UPDATED: "Snapshot updated successfully",
    SNAPSHOT_DELETED: "Snapshot deleted successfully",
    SNAPSHOT_FETCHED: "Sanpshot fetched successfully",
} as const;