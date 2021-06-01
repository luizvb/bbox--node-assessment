import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
interface UserRequestBody {
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
  USERS = '/users',
}
export const initializeUsers = (app) => {
  app.post(ENDPOINT.USERS, createUser)
  app.get(ENDPOINT.USERS, getUsers)
  app.get(`${ENDPOINT.USERS}/:id`, getUserById)
  app.delete(`${ENDPOINT.USERS}/:id`, deleteUserById)
  return app
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export enum UserEvent {
  CREATION = 'CREATION',
  ACCEPTANCE = 'ACCEPTANCE',
  REFUSAL = 'REFUSLA'
}

export const createUser = async ({ body }: CustomRequest<UserRequestBody>, res, next) => {
  try {
    const uuid = uuidv4();
    const findUser = await User.find({ email:body.email })
    if (findUser) throw new Error('User exists')
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
  res.status(201).json({ id: uuid });
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export const getUsers = async (req,res, next) => {
  try {
    const users = await User.find()
    res.status(200).json({users})  
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getUserById = async(req, res, next) => {
  try {
    const user = await User.findOne({ uuid: req.params.id })
    if (!user) throw new Error('User Not Found') 
    res.status(200).json(user);  
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export const deleteUserById = async(req, res, next) => {
  try {
    const user = await User.findOne({ uuid: req.params.id })
    if (!user) throw new Error('USER NOT FOUND')
    User.delete(user);
    res.sendStatus(204);
  } catch (error) {
    console.error(error)
    next(error)
  }
}

@Entity("users")
export default class User extends BaseEntity {
  @PrimaryColumn()
  uuid: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "phone_number" })
  phoneNumber: string;

  @Column({ name: "password" })
  password: string;

  @Column({ name: "role", type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ name: "created_at" })
  creationDate: Date;

  @Column({ name: "current_event", type: "enum", enum: UserEvent })
  currentEvent: UserEvent;
}
