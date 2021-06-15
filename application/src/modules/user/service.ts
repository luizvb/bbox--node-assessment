import { v4 as uuidv4 } from "uuid";
import User from "./model";
import { UserRequestBody } from "./controller";

export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

export enum UserEvent {
  CREATION = "CREATION",
  ACCEPTANCE = "ACCEPTANCE",
  REFUSAL = "REFUSLA",
}

class UserService {
  /**
   * Create User
   * @param {Object} body : {firstName, lastName, email, phoneNumber, password)
   */

  async createUser(body: UserRequestBody): Promise<String> {
    const uuid: string = uuidv4();
    const [findUser] = await User.find({ email: body.email });
    
    if (findUser) throw new Error("User exists");

    const user: User = User.create({
      uuid,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: body.password,
      role: UserRole.CLIENT,
      creationDate: new Date(),
      currentEvent: UserEvent.CREATION,
    });

    await user.save();
    return uuid;
  }

  /**
   * Get Users
   */
  async getUsers(): Promise<User[]> {
    return User.find();
  }

  /**
   * Get User by Id
   * @param {String} id (UserId)
   */

  async getUserById(id: string): Promise<User> {
    const user: User = await User.findOne({ uuid: id });
    if (!user) throw new Error("User Not Found");
    return user;
  }

  /**
   * Delete User by Id
   * @param {String} id (UserId)
   */

  async deleteUserById(id): Promise<Object> {
    const user: User = await User.findOne({ uuid: id });
    if (!user) throw new Error("USER NOT FOUND");
    return User.delete(user);
  }
}

export default new UserService();
