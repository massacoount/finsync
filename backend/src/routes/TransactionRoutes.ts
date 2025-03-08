import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";
import { container, inject, injectable } from "tsyringe";

@injectable()
class TransactionRoutes {
  public router: Router;
  private transactionController: TransactionController;

  constructor(@inject(TransactionController) transactionController: TransactionController) {
    this.router = Router();
    this.transactionController = transactionController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.transactionController.getTransactions.bind(this.transactionController));
    this.router.post("/", this.transactionController.createTransaction.bind(this.transactionController));
    this.router.get("/:id", this.transactionController.getTransaction.bind(this.transactionController));
    this.router.put("/:id", this.transactionController.updateTransaction.bind(this.transactionController));
    this.router.delete("/:id", this.transactionController.deleteTransaction.bind(this.transactionController));
  }
}

export default container.resolve(TransactionRoutes).router;