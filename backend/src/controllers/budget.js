const express = require("express");
class BudgetController {
  constructor(logger, dbService, util) {
    this.logger = logger;
    this.db = dbService;
    this.util = util;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.util.validateRequest(),
      this.getBudgets.bind(this)
    );
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createBudget.bind(this)
    );
    this.router.get(
      "/:id",
      this.util.validateRequest(),
      this.getBudget.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateBudget.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteBudget.bind(this)
    );
  }

  async getBudgets(req, res) {
    try {
      const budgets = await this.db.query(
        "SELECT * FROM budget WHERE user_id = ?",
        [req.user.id]
      );
      res.json(budgets);
    } catch (error) {
      this.logger.error("Error fetching budgets:", error);
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  }

  async createBudget(req, res) {
    const { category_id, amount, start_date, end_date } = req.body;
    try {
      await this.db.query(
        "INSERT INTO budget (user_id, category_id, amount, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        [req.user.id, category_id, amount, start_date, end_date]
      );
      res.status(201).json({ id: budgetId, ...req.body });
    } catch (error) {
      this.logger.error("Error creating budget:", error);
      res.status(400).json({ error: "Failed to create budget" });
    }
  }

  async getBudget(req, res) {
    try {
      const [budget] = await this.db.query(
        "SELECT * FROM budget WHERE budget_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      if (budget) {
        res.json(budget);
      } else {
        res.status(404).json({ error: "Budget not found" });
      }
    } catch (error) {
      this.logger.error("Error fetching budget:", error);
      res.status(500).json({ error: "Failed to fetch budget" });
    }
  }

  async updateBudget(req, res) {
    const { category_id, amount, start_date, end_date } = req.body;
    try {
      await this.db.query(
        "UPDATE budget SET category_id = ?, amount = ?, start_date = ?, end_date = ? WHERE budget_id = ? AND user_id = ?",
        [category_id, amount, start_date, end_date, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      this.logger.error("Error updating budget:", error);
      res.status(400).json({ error: "Failed to update budget" });
    }
  }

  async deleteBudget(req, res) {
    try {
      await this.db.query(
        "DELETE FROM budget WHERE budget_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      res.status(204).send();
    } catch (error) {
      this.logger.error("Error deleting budget:", error);
      res.status(400).json({ error: "Failed to delete budget" });
    }
  }
}

module.exports = BudgetController;
