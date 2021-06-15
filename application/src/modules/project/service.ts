import { v4 as uuidv4 } from "uuid";
import Project from "./model";
import User from "../user/model";
import { ProjectRequestBody } from "./controller";

class ProjectService {
  /**
   * Create Project Route
   * @param {Object} body description, userId
   */

  async createProject(body: ProjectRequestBody): Promise<String> {
    const uuid: string = uuidv4();

    const user = await User.findOne({ uuid: body.userId });
    if (!user) throw new Error("User Not Found");

    const findProject: Project = await Project.findOne({ description: body.description });
    if (findProject) throw new Error("Project exists");

    const project: Project = Project.create({
      uuid,
      description: body.description,
      owner: user,
      creationDate: new Date(),
    });

    await project.save();
    return uuid;
  }

  /**
   * Get Projects by User Id
   * @param {Object} userId id of user
   */

  async getProjects(userId: any): Promise<Project[]> {
    return userId ? Project.find({ where: { owner: userId } }) : Project.find();
  }

  /**
   * Get Projects by Project Id
   * @param {Object} id id of project
   */

  async getProjectById(id: string): Promise<Project | undefined> {
    return Project.findOne({ where: { uuid: id } });
  }

  /**
   * Delete Project by Project Id
   * @param {Object} id id of project
   */

  async deleteProjectById(id: string): Promise<Object> {
    const project: Project = await Project.findOne({ where: { uuid: id } });
    if (!project) throw new Error("Project not found");
    return Project.delete(project);
  }
}

export default new ProjectService();
