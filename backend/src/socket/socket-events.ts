export const SOCKET_EVENTS ={

     // connection
    CONNECTION: "connection",
    DISCONNECT: "disconnect",

    // room
    ROOM_JOIN: "room:join",
    ROOM_JOINED: "room:joined",
    ROOM_LEAVE: "room:leave",

    // users
    USER_JOINED: "user:joined",
    USER_LEFT: "user:left",

    // cursor
    CURSOR_MOVE: "cursor:move",
    CURSOR_MOVED: "cursor:moved",

    // elements
    ELEMENT_CREATED: "element:created",
    ELEMENT_ADDED: "element:added",
    ELEMENT_UPDATE: "element:update",
    ELEMENT_UPDATED: "element:updated",
    ELEMENT_DELETE: "element:delete",
    ELEMENT_DELETED: "element:deleted",

    // snapshot
    SNAPSHOT_RESTORE: "snapshot:restore",
    SNAPSHOT_RESTORED: "snapshot:restored",

    // errors
    ERROR: "error",
}