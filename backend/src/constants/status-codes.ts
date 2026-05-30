
export const STATUS_CODE = {

 
  OK: 200,                    
  CREATED: 201,               
  NO_CONTENT: 204,            

  
  NOT_MODIFIED: 304,          // resource has not been modified

  //  Client Errors 
  BAD_REQUEST: 400,           // invalid input / missing required fields
  UNAUTHORIZED: 401,          // not logged in / invalid token
  FORBIDDEN: 403,             // logged in but no permission
  NOT_FOUND: 404,             // resource does not exist
  CONFLICT: 409,
  UNSUPPORTED_MEDIA_TYPE:415,              // duplicate — e.g. email already exists
  UNPROCESSABLE: 422,         
  TOO_MANY_REQUESTS: 429,     // rate limit exceeded

  //  Server Errors 
  INTERNAL_SERVER_ERROR: 500, // something broke on the server
  BAD_GATEWAY: 502,           // upstream service failed
  SERVICE_UNAVAILABLE: 503,   // server is down or overloaded

} as const;