import { Router } from "express";
import { AccountController } from "../controllers/AccountController";
import { container, inject, injectable } from "tsyringe";
@injectable()
class AccountRoutes {
  public router: Router;
  private accountController: AccountController;

  constructor(
    @inject("Router") router: Router,
    @inject(AccountController) accountController: AccountController
  ) {
    this.router = Router();
    this.accountController = accountController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/",
      this.accountController.getAccounts.bind(this.accountController)
    );
    this.router.post(
      "/",
      this.accountController.createAccount.bind(this.accountController)
    );
    this.router.get(
      "/:id",
      this.accountController.getAccount.bind(this.accountController)
    );
    this.router.put(
      "/:id",
      this.accountController.updateAccount.bind(this.accountController)
    );
    this.router.delete(
      "/:id",
      this.accountController.deleteAccount.bind(this.accountController)
    );
    this.router.get(
      "/:id/transactions",
      this.accountController.getAccountTransactions.bind(this.accountController)
    );
    this.router.get(
      "/:id/transactions/:transactionId",
      this.accountController.getAccountTransaction.bind(this.accountController)
    );
  }
}

container.register("Router", { useValue: Router() });
export default container.resolve(AccountRoutes).router;
