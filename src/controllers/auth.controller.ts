import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from "../middlewares/auth.middleware";
import AuthenticationService from '../services/auth.service';
import {
  emailLoginSchema,
  EmailLoginInput,
  emailTokenVerifySchema,
  EmailTokenVerifyInput,
} from '../schemas/auth.schema';
import { createUserSchema, CreateUserInput } from '../schemas/user.schema';
import { omit } from 'lodash';
import RequestWithUser from "../interfaces/requestWithUser.interface";
class AuthController implements Controller {
  public path = '/';
  public router = Router();
  public authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @openapi
     * '/register':
     *  post:
     *     tags:
     *     - UserCreate
     *     summary: Register a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *             $ref: '#/components/schemas/CreateUserRequest'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateUserResponse'
     *      400:
     *        description: Bad request
     *      409:
     *        description: Email exist
    */

    this.router.post(`${this.path}/register`, validationMiddleware(createUserSchema), this.registration);

    /**
     * @openapi
     * '/loginWithEmail':
     *  post:
     *     tags:
     *     - UserLogin
     *     summary: Email Login
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *             $ref: '#/components/schemas/LoginUserRequest'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/LoginUserResponse'
     *      401:
     *        description: Wrong Credentials
    */

    this.router.post(`${this.path}/loginWithEmail`, validationMiddleware(emailLoginSchema), this.loggingIn);

    /**
     * @openapi
     *  '/verifyToken':
     *  post:
     *     tags:
     *      - VerifyEmailByToken
     *     summary: VerifyEmailByToken
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            required:
     *              - token
     *            properties:
     *              token:
     *                type: string
     *     responses:
     *      200:
     *        description: Success
     *      404:
     *        description: Not Found Token
     *      400:
     *        description: Expired Token
    */

    this.router.post(`${this.path}/verifyToken`, validationMiddleware(emailTokenVerifySchema), this.verifyToken);

    /**
    * @openapi
    *  '/validateToken':
    *  post:
    *    tags:
    *     - ValidateToken
    *    summary: Validate Token
    *    security:
    *      - bearerAuth: []
    *    responses:
    *      200:
    *        description: Success
    *        content:
    *          application/json:
    *            schema:
    *              $ref: '#/components/schemas/UserResponse'
    *      401:
    *        description: Invalid token
   */

    this.router.post(`${this.path}/validateToken`, authMiddleware, this.validateToken);
  }

  private registration = async (request: Request<{}, {}, CreateUserInput["body"]>, response: Response, next: NextFunction) => {
    const userData = request.body;
    try {
      const tokenData = await this.authenticationService.register(userData, request.headers.origin);
      response.send(tokenData);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: Request<{}, {}, EmailLoginInput["body"]>, response: Response, next: NextFunction) => {
    const logInData = request.body;
    try {
      const tokenData = await this.authenticationService.login(logInData.email, logInData.password);
      response.send(tokenData);
    } catch (error) {
      next(error);
    }
  }

  private verifyToken = async (request: Request<{}, {}, EmailTokenVerifyInput["body"]>, response: Response, next: NextFunction) => {
    try {
      const token = request.body.token;
      await this.authenticationService.verifyToken(token);
      response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  private validateToken = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      response.send({ user: omit(request.user.toJSON(), ["password", "code"]) });
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController;
