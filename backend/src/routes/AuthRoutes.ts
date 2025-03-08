import { Router } from "express";
import { container, inject, injectable } from "tsyringe";
import { AuthController } from "../controllers/AuthController";

@injectable()
class AuthRoutes {
  public router: Router;
  private authController: AuthController;

  constructor(
    @inject("Router") router: Router,
    @inject(AuthController) authController: AuthController
  ) {
    this.router = router;
    this.authController = authController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/token",
      this.authController.getAccessToken.bind(this.authController)
    );
    this.router.post(
      "/refresh",
      this.authController.refreshToken.bind(this.authController)
    );
  }
}

container.register("Router", { useValue: Router() });
export default container.resolve(AuthRoutes).router;