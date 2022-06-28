/**
 * @openapi
 * components:
 *  securitySchemes:
 *    bearerAuth:            # arbitrary name for the security scheme
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT    
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        email:
 *          type: string
 *    CreateUserRequest:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        expiresIn:
 *          type: number
 *        token:
 *          type: string
 *        user:
 *          "$ref": "#/components/schemas/User"
 *    LoginUserRequest:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    LoginUserResponse:
 *      type: object
 *      properties:
 *        expiresIn:
 *          type: number
 *        token:
 *          type: string
 *        user:
 *          "$ref": "#/components/schemas/User"
 *    UserResponse:
 *      type: object
 *      properties:
 *        user:
 *          "$ref": "#/components/schemas/User"

 * 
 */
