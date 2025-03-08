import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { container, inject, injectable } from "tsyringe";

@injectable()
class UserRoutes {
  public router: Router;
  private userController: UserController;

  constructor(@inject(UserController) userController: UserController) {
    this.router = Router();
    this.userController = userController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.userController.getUsers.bind(this.userController));
    this.router.post("/", this.userController.createUser.bind(this.userController));
    this.router.get("/:id", this.userController.getUser.bind(this.userController));
    this.router.put("/:id", this.userController.updateUser.bind(this.userController));
    this.router.delete("/:id", this.userController.deleteUser.bind(this.userController));
  }
}

export default container.resolve(UserRoutes).router;