export const ERROR_MESSAGE = {
    //auth
    USER_NOT_FOUND: "User Not Found",
    USER_ALREADY_EXIST: "User already exist with this email",
    SERVER_ERROR: "Server Error",
    INVALID_CREDENTIALS: "Invalid email or password",
    NO_TOKEN_FOUND: "Unauthorized - No Token Found",
    INVALID_TOKEN: "Invalid or expired token",
    UNAUTHORIZED: "Unauthorized",
    ADMIN_ACCESS: "Unauthorized Only Admin can access",
    FORBIDDEN: "Forbidden",
    USERID_NOT_FOUND: "User Id not Found",
    TOO_MANY_REQUEST: "Too many requests, please try again later",
    INVALID_OR_EXPIRED_OTP: "Invalid or expired OTP",
    CONFIRM_PASS_NOT_MATCH: "Confirm password not match ",

    // Room
    ROOM_NOT_FOUND: "Room not Found",
    ROOM_EXPIRED: "Room is expired",
    ROOM_FULL: "Room capacity is full",
    ROOM_ALREADY_JOINED: "User already joined the room",
    ROOM_MEMBER_NOT_FOUND: "room member not found",
    NOT_MEMBER: "user is not room member",

    // Element
    ELEMENT_NOT_CREATED:"Element not created",

} as const;