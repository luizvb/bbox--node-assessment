import { Request, Response, Application, NextFunction } from "express";
import UserService from "./service";

export interface UserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface CustomRequest<T> extends Request {
  body: T;
}

export enum ENDPOINT {
  USERS = "/users",
}

class UserController {
  /**
   * Initialize Routes of User
   * @param {Object} app  Express Application
   */

  initialize(app: Application) {
    app.post(ENDPOINT.USERS, this.createUser);
    app.get(ENDPOINT.USERS, this.getUsers);
    app.get(`${ENDPOINT.USERS}/:id`, this.getUserById);
    app.delete(`${ENDPOINT.USERS}/:id`, this.deleteUserById);
    return app;
  }

  /**
   * Create User Route
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async createUser({ body }: CustomRequest<UserRequestBody>, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ id: await UserService.createUser(body) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * Get All Users Route
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ users: await UserService.getUsers() });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * Get User By Id Route
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await UserService.getUserById(req.params.id));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * Delete User By Id Route
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUserById(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default new UserController();
