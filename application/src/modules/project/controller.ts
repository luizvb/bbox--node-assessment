import { Request, Response, Application, NextFunction } from "express";
import ProjectService from "./service";

export interface ProjectRequestBody {
  userId: string;
  description: string;
}

interface CustomRequest<T> extends Request {
  body: T;
}

export enum ENDPOINT {
  PROJECTS = "/projects",
}

class ProjectController {
  /**
   * Initialize Routes of Project
   * @param {Object} app  Express Application
   */

  initialize(app: Application) {
    app.post(ENDPOINT.PROJECTS, this.createProject);
    app.get(ENDPOINT.PROJECTS, this.getProjects);
    app.get(`${ENDPOINT.PROJECTS}/:projectId`, this.getProjectById);
    app.delete(`${ENDPOINT.PROJECTS}/:projectId`, this.deleteProjectById);
    return app;
  }

  /**
   * Create Project Route
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async createProject({ body }: CustomRequest<ProjectRequestBody>, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ id: await ProjectService.createProject(body) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * Get Projects Route
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      res.status(200).json(await ProjectService.getProjects(userId ?? undefined));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * Get Project By Id
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      res.status(200).json(await ProjectService.getProjectById(projectId));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * Delete Project By Id
   * @param {Object} req     Request object
   * @param {Object} res     Response object
   * @param {Object} next    Next object
   */

  async deleteProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      await ProjectService.deleteProjectById(projectId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default new ProjectController();
