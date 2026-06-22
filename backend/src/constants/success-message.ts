import Room from '../models/room-model';
export const SUCCESS_MESSAGE = {
    USER_CREATED: "User created successfully",
    LOGIN_SUCCESSFUL: "Login successful",
    LOGOUT_SUCCESSFUL: "Logout successful",
    PASSWORD_RESET_SUCCESS: "Password Reset Successfully",
    OTP_SENT: "If that email exists, an OTP has been sent",
    OTP_VERIFIED: "OTP successfully Verified",
    AUTH_USER_FETCHED: "Authenticated user retrieved successfully",
    PROFILE_UPDATED: "Profile Updated Successfully",

    // Room
    ROOM_CREATED: "Room Created Successfully",
    ROOM_JOIN: "Successfully Joined Room",
    ROOM_DELETED: "Room Deleted Successfully",
    ROOM_MEMBERS_FETCH: "Room Members Fetch Successfully",

    // Element
    ELEMENT_CREATED: "element created successfully",
    ELEMENT_FETCH: "Elements fetch successfully"
} as const;