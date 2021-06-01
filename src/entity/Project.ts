import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import User from "./User";

interface ProjectRequestBody {
  userId: string;
  description: string;
}
interface CustomRequest<T> extends Request {
  body: T;
}

export enum ENDPOINT {
  PROJECTS = '/projects',
}

export const initializeProjects = (app) => {
  app.post(ENDPOINT.PROJECTS, createProject)
  app.get(ENDPOINT.PROJECTS, getProjects)
  app.get(`${ENDPOINT.PROJECTS}/:projectId`, getProjectById)
  app.delete(`${ENDPOINT.PROJECTS}/:projectId`, deleteProjectById)
  return app
}

export const createProject = async ({ body }: CustomRequest<ProjectRequestBody>,res, next) => {
  try {
  const uuid = uuidv4();
  
  const user = await User.findOne({ uuid: body.userId });
  if (!user) throw new Error ('User Not Found')
  
  const findProject = await Project.findOne({description: body.description})
  if (findProject) throw new Error ('Project exists')

  const project = Project.create({
    uuid,
    description: body.description,
    owner: user,
    creationDate: new Date(),
  })

  await project.save();
  res.status(201).json({ id: uuid })

  } catch (error) {
    console.error(error)
    next(error)
  }
}

export const getProjects = async (req,res, next) => {
  try {
    const { userId } = req.query;
    const projects = userId 
      ? await Project.find({where: { owner: userId }})
      : await Project.find();
    res.status(200).json(projects);  
  } catch (error) {
    console.log(error)
    next(error)
  } 
}

export const getProjectById = async(req,res, next) => {
  try {
    const { projectId } = req.params;
    const projects = await Project.findOne({ where: { uuid: projectId } })
    res.status(200).json(projects);  
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export const deleteProjectById = async (req,res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ where: { uuid: projectId }})
    if (!project) throw new Error('Project not found')
    Project.delete(project);
    res.sendStatus(204);  
  } catch (error) {
    console.error(error)
    next(error)
  }
}

@Entity("projects")
export default class Project extends BaseEntity {
  @PrimaryColumn()
  uuid: string;

  @Column({ name: "description" })
  description: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "owner" })
  owner: User;

  @Column({ name: "created_at" })
  creationDate: Date;
}
